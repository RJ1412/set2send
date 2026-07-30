import crypto from "crypto";
import { env } from "../config/env.js";
import { dmQueue, addDmJob } from "../queues/dmQueue.js";
import { prisma } from "../utils/db.js";
import axios from "axios";
import { emitAnalyticsEvent } from "../utils/analytics.js";
import { startFlow } from "../services/flowEngine.js";
import { sendCampaignDm } from "../services/sendDm.js";


export const verifyMetaWebhook = (req, res) => {
  console.log("=== Webhook Verification Hit ===");
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  
  console.log("Received Query Params:", { mode, token, challenge });

  if (mode === "subscribe" && token === env.META_WEBHOOK_VERIFY_TOKEN) {
    console.log("✅ Webhook Verification Success!");
    res.status(200).send(challenge);
  } else {
    console.error("❌ Webhook Verification Failed! Tokens did not match.");
    res.sendStatus(403);
  }
};

export const handleMetaEvent = async (req, res) => {
  console.log("=== Webhook Event Received ===");
  // 1. Verify Signature
  const signature = req.headers["x-hub-signature-256"];
  if (env.NODE_ENV !== "development" && signature) {
    if (!env.META_APP_SECRET) {
      console.error("❌ [Webhook Error] META_APP_SECRET is missing in environment variables!");
      return res.status(403).send("Missing secret");
    }
    const expectedSignature = "sha256=" + crypto
      .createHmac("sha256", env.META_APP_SECRET)
      .update(req.body) // req.body is buffer because of express.raw
      .digest("hex");
    if (signature !== expectedSignature) {
      console.error(`❌ [Webhook Error] Signature mismatch!`);
      console.error(`   Expected: ${expectedSignature}`);
      console.error(`   Received: ${signature}`);
      console.error(`   Make sure META_APP_SECRET exactly matches the App Dashboard.`);
      return res.status(403).send("Invalid signature");
    } else {
      console.log("✅ [Webhook] Signature successfully verified!");
    }
  } else if (!signature) {
    console.warn("⚠️ [Webhook Warning] No signature received. (Testing locally or misconfigured)");
  }

  let body;
  try {
    body = JSON.parse(req.body.toString());
  } catch (err) {
    console.error("❌ [Webhook Error] Failed to parse webhook payload:", err.message);
    return res.sendStatus(400);
  }
  
  console.log("Payload Received:", JSON.stringify(body, null, 2));

  // Return 200 immediately to Meta
  res.status(200).send("EVENT_RECEIVED");

  // 3. Process Async (wrapped in try/catch so errors are visible)
  try {
  if (body.object === "instagram") {
    for (const entry of body.entry || []) {
      const igUserId = entry.id; // The Instagram Account ID receiving the webhook
      
      for (const change of entry.changes || []) {
        if (change.field === "comments") {
          const comment = change.value;
          
          console.log(`Parsed Comment: Text: "${comment.text}", From: "${comment.from.username}", Media ID: "${comment.media.id}"`);
          
          // Find active campaigns for this IG Media (or all posts)
          const campaigns = await prisma.campaign.findMany({
            where: {
              OR: [
                { ig_media_id: comment.media.id },
                { ig_media_id: "ALL_POSTS" }
              ],
              status: "active"
            },
          });

          for (const campaign of campaigns) {
            // Check for Viral Mode
            const waitingCount = await dmQueue.getWaitingCount();
            const VIRAL_THRESHOLD = 50;
            let delay = 0;
            
            if (waitingCount > VIRAL_THRESHOLD) {
              console.log(`[Viral Mode] Queue has ${waitingCount} items. Throttling...`);
              // Delay by waitingCount * 5 seconds to spread load over time
              delay = waitingCount * 5000;
            }

            // Push to Queue for legacy campaigns
            await addDmJob({
              campaignId: campaign.id,
              commenterIgId: comment.from.id,
              commenterUsername: comment.from.username,
              commentText: comment.text,
              commentId: comment.id,
            }, { delay });
          }

          // === NEW: Flow Engine Execution ===
          // Find the Instagram Account associated with this incoming webhook
          const targetIgAccount = await prisma.instagramAccount.findUnique({
            where: { ig_user_id: igUserId }
          });
          
          if (targetIgAccount) {
            const flows = await prisma.flow.findMany({
              where: {
                status: 'live',
                account_id: targetIgAccount.user_id
              }
            });

            const eventData = {
              type: 'comment',
              text: comment.text,
              username: comment.from.username,
              senderId: comment.from.id,
              commentId: comment.id,
            };

            for (const flow of flows) {
              await startFlow(flow, eventData, targetIgAccount);
            }
          }
        } else if (change.field === "mentions") {
          // Handle Feature 1: Story Mention Auto-DM (from changes array)
          const mention = change.value;
          if (mention.media_id) {
            console.log(`Parsed Story Mention (Changes): From: "${mention.from.username}", Media ID: "${mention.media_id}"`);
            
            // Find active campaigns triggered by story_mention
            const campaigns = await prisma.campaign.findMany({
              where: {
                status: "active",
                trigger_type: "story_mention"
              },
            });

            for (const campaign of campaigns) {
              // Deduplicate via DB upsert — if the row already exists, skip
              const alreadyProcessed = await prisma.processedEvent.findUnique({
                where: { event_key: `mention:${campaign.id}:${mention.media_id}:${mention.from.id}` }
              }).catch(() => null);

              if (alreadyProcessed) {
                console.log(`[Webhook] Skipping mention ${mention.media_id}, already processed.`);
                continue;
              }
              await prisma.processedEvent.create({
                data: { event_key: `mention:${campaign.id}:${mention.media_id}:${mention.from.id}` }
              }).catch(() => {}); // ignore duplicate errors

              // Enqueue DM job for the story mention
              await addDmJob({
                campaignId: campaign.id,
                commenterIgId: mention.from.id,
                commenterUsername: mention.from.username,
                commentText: "story_mention", // internal flag
                commentId: mention.media_id, // we use media_id as commentId
              }, { delay: 0 });
            }
          }
        }
      }

      // Handle direct messages (messaging)
      for (const messaging of entry.messaging || []) {
        const senderId = messaging.sender?.id;
        const recipientId = messaging.recipient?.id;
        
        // Detect Event Type
        let messageText = messaging.message?.text || "";
        let eventType = "dm";
        
        const attachments = messaging.message?.attachments || [];
        const hasStoryMentionAttachment = attachments.some(a => a.type === 'story_mention' || a.type === 'ig_story_mention');
        
        if (messaging.message?.story?.mention || hasStoryMentionAttachment) {
           eventType = "story_mention";
           messageText = messageText || "[Story Mention]";
        } else if (messaging.message?.reply_to?.story) {
           eventType = "story_reply";
        }

        if (messageText || eventType !== "dm") {
            console.log(`[Webhook] Processing ${eventType} from sender ${senderId} to ${recipientId}`);
            const igAccount = await prisma.instagramAccount.findUnique({ where: { ig_user_id: recipientId } });
            console.log(`[Webhook] igAccount lookup: ${igAccount ? igAccount.ig_username : 'NOT FOUND (null)'}`);
            
            // Flow Engine Integration for Messages/Mentions
            if (igAccount) {
              const flows = await prisma.flow.findMany({
                where: {
                  status: 'live',
                  account_id: igAccount.user_id
                }
              });

              // Only trigger startFlow if this isn't a follow gate setup message (we handle those below)
              // We'll pass the message text and type to the flow engine
              if (flows.length > 0) {
                 // Try to get username for flow engine (fallback to ID)
                 let senderUsername = senderId;
                 try {
                    const res = await axios.get(`https://graph.facebook.com/v25.0/${senderId}?fields=username,name&access_token=${igAccount.access_token}`);
                    if (res.data) senderUsername = res.data.username || res.data.name || senderId;
                 } catch(e) {}
                 
                 const eventData = {
                   type: eventType,
                   text: messageText,
                   username: senderUsername,
                   senderId: senderId
                 };
                 
                 for (const flow of flows) {
                   await startFlow(flow, eventData, igAccount);
                 }
              }
            }

            // Campaign-based story mention handling (direct DM, no queue needed)
            if (igAccount && eventType === "story_mention") {
              console.log(`[Webhook] Story mention detected. Looking for active story_mention campaigns for account ${igAccount.id}...`);
              const mentionCampaigns = await prisma.campaign.findMany({
                where: {
                  status: "active",
                  trigger_type: "story_mention",
                  instagram_account_id: igAccount.id
                }
              });

              console.log(`[Webhook] Found ${mentionCampaigns.length} story_mention campaign(s).`);
              for (const campaign of mentionCampaigns) {
                const eventKey = `mention:${campaign.id}:${senderId}:${messaging.message?.mid}`;
                const alreadyProcessed = await prisma.processedEvent.findUnique({
                  where: { event_key: eventKey }
                }).catch(() => null);

                if (alreadyProcessed) continue;
                await prisma.processedEvent.create({ data: { event_key: eventKey } }).catch(() => {});

                let senderUsername = senderId;
                try {
                  const r = await axios.get(`https://graph.facebook.com/v25.0/${senderId}?fields=username,name&access_token=${igAccount.access_token}`);
                  if (r.data) senderUsername = r.data.username || r.data.name || senderId;
                } catch(e) {}

                await sendCampaignDm({
                  campaignId: campaign.id,
                  commenterIgId: senderId,
                  commenterUsername: senderUsername,
                  commentText: "story_mention",
                  commentId: messaging.message?.mid || senderId,
                });
              }
            }
            
            // Check Follow Gate Reply
            if (igAccount) {
               try {
                 const res = await axios.get(`https://graph.facebook.com/v25.0/${senderId}?fields=is_user_follow_business,name,username&access_token=${igAccount.access_token}`);
                 
                 if (res.data) {
                   const isFollowing = res.data.is_user_follow_business;
                   const username = res.data.username || res.data.name; 
                   
                   // Upsert Contact to Smart Memory
                   await prisma.instagramContact.upsert({
                     where: {
                       instagram_account_id_username: {
                         instagram_account_id: igAccount.id,
                         username: username
                       }
                     },
                     update: { messaging_ig_id: senderId },
                     create: {
                       instagram_account_id: igAccount.id,
                       username: username,
                       messaging_ig_id: senderId
                     }
                   });

                   // Find pending jobs
                   const pendingJobs = await prisma.followGateJob.findMany({
                     where: { 
                       status: { in: ['pending_follow', 'done_but_not_following'] },
                       ...(username ? { commenter_username: username } : {})
                     },
                     include: { campaign: true }
                   });

                   const isDoneReply = messageText.toLowerCase().trim() === "done";

                   for (const job of pendingJobs) {
                     if (isDoneReply) {
                       if (isFollowing) {
                         // Deliver link
                         let messageToSend = job.campaign.dm_template;
                         const apiUrl = env.API_URL || "http://localhost:5000";
                         const urlRegex = /(https?:\/\/[^\s]+)/g;
                         messageToSend = messageToSend.replace(urlRegex, (match) => {
                            return `${apiUrl}/r?c=${job.campaign_id}&u=${senderId}&s=original&url=${encodeURIComponent(match)}`;
                         });

                         await axios.post(
                           `https://graph.facebook.com/v25.0/me/messages`,
                           { recipient: { id: senderId }, message: { text: messageToSend } },
                           { headers: { Authorization: `Bearer ${igAccount.access_token}` } }
                         );

                         await prisma.followGateJob.update({
                           where: { id: job.id },
                           data: { status: "delivered", delivered_at: new Date() }
                         });
                         
                         await prisma.campaign.update({
                           where: { id: job.campaign_id },
                           data: { follow_gate_count: { increment: 1 }, dms_sent: { increment: 1 } }
                         });

                         await emitAnalyticsEvent(job.campaign_id, "done_received_following", username);
                         await emitAnalyticsEvent(job.campaign_id, "link_delivered", username);

                       } else {
                         // DONE but not following
                         const defaultMsg = `Looks like you haven't followed yet!\nFollow @${igAccount.ig_username} and you're all set.`;
                         const customMsg = job.campaign.not_following_message;
                         
                         await axios.post(
                             `https://graph.facebook.com/v25.0/me/messages`,
                             { recipient: { id: senderId }, message: { text: customMsg || defaultMsg } },
                             { headers: { Authorization: `Bearer ${igAccount.access_token}` } }
                         );
                         
                         await prisma.followGateJob.update({
                           where: { id: job.id },
                           data: { status: "done_but_not_following", messaging_ig_id: senderId }
                         });

                         await emitAnalyticsEvent(job.campaign_id, "done_received_not_following", username);
                       }
                     } else {
                        await prisma.followGateJob.update({
                          where: { id: job.id },
                          data: { messaging_ig_id: senderId }
                        });
                        // The silentRecheckWorker will pick this up automatically
                      }
                   }
                 }
               } catch (err) {
                 console.error("Follow verify error:", err.response?.data || err.message);
               }
            }

            // Check if we recently prompted them for an email (DB-based, no Redis)
            const promptRecord = await prisma.emailPrompt.findUnique({
              where: {
                ig_user_id_sender_ig_id: {
                  ig_user_id: recipientId,
                  sender_ig_id: senderId
                }
              }
            }).catch(() => null);
            const campaignId = promptRecord && new Date() < new Date(promptRecord.expiresAt) ? promptRecord.campaign_id : null;

            if (campaignId) {
              // Validate email
              const emailMatch = messageText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
              if (emailMatch) {
                const email = emailMatch[1];
                
                if (igAccount) {
                  let senderUsername = senderId;
                  try {
                    const res = await axios.get(`https://graph.facebook.com/v25.0/${senderId}?fields=username,name&access_token=${igAccount.access_token}`);
                    if (res.data) senderUsername = res.data.username || res.data.name || senderId;
                  } catch(e) {}

                  // Update the lead in CRM
                  await prisma.lead.updateMany({
                    where: {
                      userId: igAccount.user_id,
                      username: senderUsername
                    },
                    data: {
                      email: email
                    }
                  });

                  // Actually we can get username from instagram api, but we might just save without it for now
                  await prisma.collectedEmail.create({
                    data: {
                      campaign_id: campaignId,
                      commenter_username: senderUsername, // Save the actual username
                      email: email
                    }
                  });

                  console.log(`[Email Collection] Saved email ${email} for campaign ${campaignId}`);
                  
                  // Send quick thanks
                  try {
                    await axios.post(
                      `https://graph.facebook.com/v25.0/me/messages`,
                      {
                        recipient: { id: senderId },
                        message: { text: "Got it, thanks! Keep an eye on your inbox." },
                      },
                      {
                        headers: { Authorization: `Bearer ${igAccount.access_token}` },
                      }
                    );
                  } catch (err) {
                    console.error("Failed to send email thanks:", err.message);
                  }

                  // Clear prompt so we don't save multiple times
                  await prisma.emailPrompt.delete({
                    where: {
                      ig_user_id_sender_ig_id: {
                        ig_user_id: recipientId,
                        sender_ig_id: senderId
                      }
                    }
                  }).catch(() => {});
                }
              }
            }

            // Check for keyword triggers (Story Replies / Direct Messages)
            if (igAccount) {
              const campaigns = await prisma.campaign.findMany({
                where: {
                  status: "active",
                  trigger_type: "story_reply",
                  instagram_account_id: igAccount.id
                }
              });

              for (const campaign of campaigns) {
                // Determine if this messaging event is a story reply
                const replyToStory = messaging.message?.reply_to?.story;
                const storyId = replyToStory?.id;
                
                // If the user specified a specific story, it MUST match the story ID
                if (campaign.ig_media_id !== "ALL_POSTS") {
                  if (!replyToStory || storyId !== campaign.ig_media_id) {
                     continue; // Skip, not the targeted story
                  }
                } else {
                  // ALL_POSTS (All Stories). Must actually be a story reply.
                  if (!replyToStory) {
                     continue; // Skip, not a story reply
                  }
                }
                
                let isMatch = false;
                const lowerMsg = messageText.toLowerCase().trim();
                const lowerKeyword = campaign.keyword.toLowerCase().trim();

                if (campaign.fuzzy_match) {
                  isMatch = lowerMsg.includes(lowerKeyword);
                } else {
                  isMatch = lowerMsg === lowerKeyword;
                }

                if (isMatch) {
                  // Deduplicate using message mid stored in DB
                  const mid = messaging.message?.mid || `dm_${Date.now()}`;
                  const alreadyProcessed = await prisma.processedEvent.findUnique({
                    where: { event_key: `dm_trigger:${campaign.id}:${mid}` }
                  }).catch(() => null);

                  if (!alreadyProcessed) {
                    await prisma.processedEvent.create({
                      data: { event_key: `dm_trigger:${campaign.id}:${mid}` }
                    }).catch(() => {});

                    console.log(`[Webhook] Matched DM/Story Reply trigger for campaign ${campaign.id}`);
                    
                    // Fetch username if possible
                    let username = "IG User";
                    try {
                      const res = await axios.get(`https://graph.facebook.com/v25.0/${senderId}?fields=name,username&access_token=${igAccount.access_token}`);
                      if (res.data) {
                        username = res.data.username || res.data.name || "IG User";
                      }
                    } catch (err) {
                      console.error("Failed to fetch username for DM trigger:", err.message);
                    }

                    await addDmJob({
                      campaignId: campaign.id,
                      commenterIgId: senderId,
                      commenterUsername: username,
                      commentText: messageText,
                      commentId: mid, // Use message ID
                    }, { delay: 0 });
                  }
                }
              }
            }
        }
      }
    }
  }
  } catch (err) {
    console.error(err);
  }
};
