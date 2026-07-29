import { prisma } from '../utils/db.js';
import { recalculateLeadScore } from '../lib/leadScoring.js';

export const getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 50, search, stage, tag, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const where = { userId: req.userId };

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (stage) where.stage = stage;
    if (tag) where.tags = { some: { name: tag } };

    const leads = await prisma.lead.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: { [sortBy]: sortOrder },
      include: { tags: true }
    });

    const total = await prisma.lead.count({ where });

    res.json({
      leads,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber)
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getLeadById = async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: req.params.id, userId: req.userId },
      include: { activities: { orderBy: { createdAt: 'desc' } }, tags: true, notes: { orderBy: { createdAt: 'desc' } } }
    });
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json(lead);
  } catch (error) {
    console.error("Error fetching lead:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateLead = async (req, res) => {
  try {
    const { stage, email, phone, tags } = req.body;
    const updateData = {};
    if (stage) updateData.stage = stage;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;

    const lead = await prisma.lead.update({
      where: { id: req.params.id, userId: req.userId },
      data: updateData
    });

    if (stage) {
      // Record activity and recalculate score
      await prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          type: "stage_changed",
          metadata: { newStage: stage }
        }
      });
      await recalculateLeadScore(lead.id);
    }

    res.json(lead);
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const addNote = async (req, res) => {
  try {
    const { content } = req.body;
    const note = await prisma.leadNote.create({
      data: { leadId: req.params.id, content }
    });
    
    await prisma.leadActivity.create({
      data: {
        leadId: req.params.id,
        type: "note_added",
        metadata: { noteId: note.id }
      }
    });

    res.status(201).json(note);
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    await prisma.leadNote.deleteMany({
      where: { id: req.params.noteId, leadId: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const addTag = async (req, res) => {
  try {
    const { name, color } = req.body;
    const tag = await prisma.leadTag.create({
      data: { leadId: req.params.id, name, color }
    });

    await prisma.leadActivity.create({
      data: { leadId: req.params.id, type: "tag_added", metadata: { tagName: name } }
    });

    res.status(201).json(tag);
  } catch (error) {
    console.error("Error adding tag:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteTag = async (req, res) => {
  try {
    await prisma.leadTag.deleteMany({
      where: { id: req.params.tagId, leadId: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting tag:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const bulkAction = async (req, res) => {
  try {
    const { action, leadIds, payload } = req.body;
    
    if (action === "change_stage") {
      await prisma.lead.updateMany({
        where: { id: { in: leadIds }, userId: req.userId },
        data: { stage: payload.stage }
      });
      // Would ideally trigger activity for each, but we simplify for bulk
      for (const id of leadIds) {
        await prisma.leadActivity.create({
           data: { leadId: id, type: "stage_changed", metadata: { newStage: payload.stage } }
        });
        await recalculateLeadScore(id);
      }
    } else if (action === "add_tag") {
      const tagPromises = leadIds.map(id => prisma.leadTag.create({
        data: { leadId: id, name: payload.name, color: payload.color }
      }));
      await Promise.all(tagPromises);
    } else if (action === "export") {
      // Return a temporary token or directly handle export differently
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error performing bulk action:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const exportLeads = async (req, res) => {
  try {
    const { search, stage, tag } = req.query;
    const where = { userId: req.userId };

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (stage) where.stage = stage;
    if (tag) where.tags = { some: { name: tag } };

    const leads = await prisma.lead.findMany({
      where,
      include: { tags: true }
    });

    const csvData = leads.map(l => ({
      Username: l.username || '',
      FullName: l.fullName || '',
      Email: l.email || '',
      Phone: l.phone || '',
      Stage: l.stage,
      Score: l.score,
      Tags: l.tags.map(t => t.name).join(', '),
      SourceFlow: l.sourceFlowId || '',
      SourcePost: l.sourcePostId || '',
      DMsSent: l.dmsSent,
      DMsOpened: l.dmsOpened,
      LinksClicked: l.linksClicked,
      RepliesGiven: l.repliesGiven,
      EmailCaptured: l.emailCaptured ? 'Yes' : 'No',
      FollowerCount: l.followerCount || 0,
      IsFollower: l.isFollower ? 'Yes' : 'No',
      FirstSeen: l.createdAt.toISOString(),
      LastActivity: l.lastActivityAt ? l.lastActivityAt.toISOString() : '',
      ConvertedAt: l.convertedAt ? l.convertedAt.toISOString() : ''
    }));

    // Respond with JSON array so frontend Papa.unparse can convert to CSV
    res.json(csvData);
  } catch (error) {
    console.error("Error exporting leads:", error);
    res.status(500).json({ error: "Server error" });
  }
};
