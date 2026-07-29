import axios from 'axios';
import { prisma } from '../utils/db.js';
import { recalculateLeadScore } from '../lib/leadScoring.js';

export const startFlow = async (flow, eventData, instagramAccount) => {
  try {
    const nodes = typeof flow.nodes === 'string' ? JSON.parse(flow.nodes) : flow.nodes;
    const edges = typeof flow.edges === 'string' ? JSON.parse(flow.edges) : flow.edges;

    if (!nodes || !nodes.length || !edges) {
      console.log(`[FlowEngine] Flow ${flow.id} has no valid nodes/edges.`);
      return;
    }

    // Find trigger
    const triggerNode = nodes.find(n => n.type === 'trigger');
    if (!triggerNode) {
      console.log(`[FlowEngine] Flow ${flow.id} has no trigger node.`);
      return;
    }

    // Evaluate trigger condition
    if (triggerNode.data.subtype === 'comment_keyword') {
      if (eventData.type !== 'comment') return;
      
      const keyword = triggerNode.data.config?.keyword;
      const matchType = triggerNode.data.config?.match_type || 'exact';
      
      if (keyword) {
        const text = eventData.text.toLowerCase().trim();
        const key = keyword.toLowerCase().trim();
        if (matchType === 'exact' && text !== key) return;
        if (matchType === 'contains' && !text.includes(key)) return;
      }
    } else if (triggerNode.data.subtype === 'story_reply') {
      if (eventData.type !== 'story_reply') return;
    } else if (triggerNode.data.subtype === 'story_mention') {
      if (eventData.type !== 'story_mention') return;
    } else {
      return; // unknown trigger
    }

    console.log(`[FlowEngine] Flow ${flow.id} triggered successfully. Starting execution.`);
    
    // Create or update Lead
    const lead = await prisma.lead.upsert({
      where: { 
        userId_username: {
          userId: instagramAccount.user_id,
          username: eventData.username
        }
      },
      update: {
        lastActivityAt: new Date(),
        sourceFlowId: flow.id,
        ...(eventData.type ? { sourceTrigger: eventData.type } : {})
      },
      create: {
        userId: instagramAccount.user_id,
        username: eventData.username,
        sourceFlowId: flow.id,
        sourceTrigger: eventData.type || "comment"
      }
    });

    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: "flow_entered",
        metadata: { flowId: flow.id, flowName: flow.name }
      }
    });
    await recalculateLeadScore(lead.id);

    // Begin execution loop
    await executeNextNode(triggerNode.id, nodes, edges, eventData, instagramAccount, flow, lead);
  } catch (err) {
    console.error(`[FlowEngine] Error starting flow ${flow.id}:`, err);
  }
};

const executeNextNode = async (currentNodeId, nodes, edges, eventData, instagramAccount, flow, lead) => {
  const outgoingEdges = edges.filter(e => e.source === currentNodeId);
  for (const edge of outgoingEdges) {
    const nextNode = nodes.find(n => n.id === edge.target);
    if (!nextNode) continue;

    await executeNode(nextNode, nodes, edges, eventData, instagramAccount, edge, flow, lead);
  }
};

const executeNode = async (node, nodes, edges, eventData, instagramAccount, incomingEdge, flow, lead) => {
  console.log(`[FlowEngine] Executing node: ${node.type} - ${node.data.subtype || node.data.label}`);
  
  let continueExecution = true;
  let conditionResult = null;

  try {
    if (node.type === 'action' && node.data.subtype === 'send_dm') {
      const messageTemplate = node.data.config?.message || 'Hello!';
      let messageText = messageTemplate
        .replace('{first_name}', eventData.username)
        .replace('{username}', eventData.username);
      
      const linkUrl = node.data.config?.linkUrl;
      if (linkUrl) {
        messageText += `\n${linkUrl}`;
      }

      const attachmentType = node.data.config?.attachmentType;
      const attachmentUrl = node.data.config?.attachmentUrl;
      
      const url = `https://graph.facebook.com/v25.0/me/messages`;
      
      let payload = {
        message: { text: messageText }
      };

      // In Instagram Graph API, a message can contain EITHER text OR an attachment.
      // So if both are present, we might need to send two messages.
      // For comment replies, we can only send one message. We prioritize text if both exist, 
      // or we can just send the text, and if it's not a comment reply, we can send the attachment in a subsequent call.
      // Wait, to keep it simple, if there's an attachment, let's send it. If there is both, we send text first, then attachment if not a comment reply.
      // Actually, if we send attachment, it replaces text if we use the same payload message object. Let's create two payloads if needed.
      
      let payloads = [];
      if (messageText.trim()) {
        payloads.push({ message: { text: messageText } });
      }

      if (attachmentType && attachmentType !== 'none' && attachmentUrl) {
        payloads.push({
          message: {
            attachment: {
              type: attachmentType,
              payload: { url: attachmentUrl }
            }
          }
        });
      }

      // If no text but attachment exists, payloads will just have the attachment.
      // If neither, fallback
      if (payloads.length === 0) {
        payloads.push({ message: { text: 'Hello!' } });
      }

      // If it's a comment, we MUST use comment_id for the private reply API
      let recipientObj = null;
      if (eventData.type === 'comment' && eventData.commentId) {
         recipientObj = { comment_id: eventData.commentId };
         // For comment replies, Instagram only allows 1 message. 
         // We will only send the first payload.
         payloads = [payloads[0]];
      } else if (eventData.senderId) {
         recipientObj = { id: eventData.senderId };
      } else {
         console.log(`[FlowEngine] No valid recipient found to send DM.`);
         continueExecution = false;
      }

      if (continueExecution) {
        for (const p of payloads) {
          p.recipient = recipientObj;
          await axios.post(url, p, {
            headers: { Authorization: `Bearer ${instagramAccount.access_token}` }
          });
        }
        console.log(`[FlowEngine] Sent DM(s) for node ${node.id}`);
        
        if (lead) {
          await prisma.lead.update({
            where: { id: lead.id },
            data: { dmsSent: { increment: payloads.length }, lastActivityAt: new Date() }
          });
          await prisma.leadActivity.create({
            data: { leadId: lead.id, type: "dm_sent", metadata: { text: messageText, attachment: attachmentUrl } }
          });
          await recalculateLeadScore(lead.id);
        }
      }
    } 
    else if (node.type === 'action' && node.data.subtype === 'add_tag') {
      console.log(`[FlowEngine] Adding tag (mock)`);
    }
    else if (node.type === 'condition') {
      // In a real scenario we'd look up user data in DB. 
      // For this POC, we just hardcode it to follow the 'yes' path.
      conditionResult = 'yes';
      console.log(`[FlowEngine] Evaluated condition ${node.data.subtype}: ${conditionResult}`);
    }
    else if (node.type === 'delay') {
      console.log(`[FlowEngine] Delay node encountered. Scheduling for later is required (Queue). Stopping branch here.`);
      continueExecution = false;
    }
    else if (node.type === 'follow_gate') {
       console.log(`[FlowEngine] Follow Gate encountered. (Logic not fully ported). Stopping branch here.`);
       continueExecution = false;
    }
  } catch (err) {
    console.error(`[FlowEngine] Error executing node ${node.id}:`, err.response?.data?.error?.message || err.message);
    continueExecution = false; 
  }

  // Find next nodes in this path
  if (continueExecution) {
    const outgoingEdges = edges.filter(e => {
      if (e.source !== node.id) return false;
      if (node.type === 'condition') {
        return e.sourceHandle === conditionResult;
      }
      return true;
    });

    for (const edge of outgoingEdges) {
      const nextNode = nodes.find(n => n.id === edge.target);
      if (nextNode) {
        await executeNode(nextNode, nodes, edges, eventData, instagramAccount, edge, flow, lead);
      }
    }
  }
};
