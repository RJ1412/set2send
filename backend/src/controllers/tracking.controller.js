import { prisma } from "../utils/db.js";

export const handleLinkClick = async (req, res, next) => {
  try {
    const { c: campaignId, u: commenterIgId, s: source, url } = req.query;

    if (!campaignId || !commenterIgId || !url) {
      return res.status(400).send("Invalid link");
    }

    // Log the click
    await prisma.linkClick.create({
      data: {
        campaign_id: campaignId,
        commenter_ig_id: commenterIgId,
        source: source || "original"
      }
    });

    // Redirect to the actual destination
    res.redirect(302, decodeURIComponent(url));
  } catch (err) {
    console.error("Link tracking error:", err);
    // If it fails, still try to redirect so user isn't stuck
    if (req.query.url) {
      res.redirect(302, decodeURIComponent(req.query.url));
    } else {
      res.status(500).send("Server Error");
    }
  }
};
