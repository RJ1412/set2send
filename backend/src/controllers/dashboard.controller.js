import { prisma } from "../utils/db.js";

export const getPlatforms = async (req, res, next) => {
  try {
    const platforms = await prisma.platformConnection.findMany({
      where: { userId: req.userId }
    });

    // Frontend expects an object mapping platform name to its stats
    // Default structure:
    const platformData = {
      instagram: { connected: false, messages: 0, flow: "None", leads: 0, status: "Inactive" },
      whatsapp: { connected: false, messages: 0, flow: "None", leads: 0, status: "Inactive" },
      messenger: { connected: false, messages: 0, flow: "None", leads: 0, status: "Inactive" },
      tiktok: { connected: false, messages: 0, flow: "None", leads: 0, status: "Inactive" },
      telegram: { connected: false, messages: 0, flow: "None", leads: 0, status: "Inactive" }
    };

    platforms.forEach(p => {
      if (platformData[p.platformName]) {
        platformData[p.platformName] = {
          connected: p.connected,
          messages: p.messagesSent,
          flow: p.activeCampaignFlow || "None",
          leads: p.leadsCaptured,
          status: p.status
        };
      }
    });

    res.json({ platforms: platformData });
  } catch (error) {
    next(error);
  }
};

export const togglePlatform = async (req, res, next) => {
  try {
    const { platformName } = req.body;
    if (!platformName) return res.status(400).json({ error: "platformName required" });

    let connection = await prisma.platformConnection.findFirst({
      where: { userId: req.userId, platformName }
    });

    if (connection) {
      connection = await prisma.platformConnection.update({
        where: { id: connection.id },
        data: {
          connected: !connection.connected,
          status: !connection.connected ? "Active" : "Inactive",
          messagesSent: !connection.connected ? 250 : 0,
          leadsCaptured: !connection.connected ? 45 : 0,
          activeCampaignFlow: !connection.connected ? "Default Welcome Script" : "None"
        }
      });
    } else {
      connection = await prisma.platformConnection.create({
        data: {
          userId: req.userId,
          platformName,
          connected: true,
          status: "Active",
          messagesSent: 250,
          leadsCaptured: 45,
          activeCampaignFlow: "Default Welcome Script"
        }
      });
    }

    res.json({ success: true, connection });
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (req, res, next) => {
  try {
    const leads = await prisma.lead.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Match frontend mapping format if needed
    const formattedLeads = leads.map(l => ({
      name: l.name,
      email: l.email,
      channel: l.channel,
      date: l.createdAt.toISOString(),
      status: l.status
    }));

    res.json({ leads: formattedLeads });
  } catch (error) {
    next(error);
  }
};

export const addTestLead = async (req, res, next) => {
  try {
    const { name, email, channel } = req.body;
    
    const lead = await prisma.lead.create({
      data: {
        userId: req.userId,
        name: name || "Marcus Wright",
        email: email || "marcus.dev@set2send.com",
        channel: channel || "Instagram",
        status: "Verified"
      }
    });

    // Automatically increase metrics for the channel
    const connection = await prisma.platformConnection.findFirst({
      where: { userId: req.userId, platformName: (channel || "instagram").toLowerCase() }
    });

    if (connection) {
      await prisma.platformConnection.update({
        where: { id: connection.id },
        data: {
          messagesSent: connection.messagesSent + 1,
          leadsCaptured: connection.leadsCaptured + 1
        }
      });
    }

    res.json({ success: true, lead });
  } catch (error) {
    next(error);
  }
};
