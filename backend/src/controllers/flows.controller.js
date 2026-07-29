import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createFlow = async (req, res) => {
  try {
    const { name, nodes, edges, status } = req.body;
    const flow = await prisma.flow.create({
      data: {
        account_id: req.userId,
        name: name || "Untitled Flow",
        status: status || "draft",
        nodes: nodes ? JSON.stringify(nodes) : "[]",
        edges: edges ? JSON.stringify(edges) : "[]"
      }
    });
    res.status(201).json({ ...flow, nodes: JSON.parse(flow.nodes || "[]"), edges: JSON.parse(flow.edges || "[]") });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFlows = async (req, res) => {
  try {
    const flows = await prisma.flow.findMany({
      where: { account_id: req.userId },
      orderBy: { updated_at: 'desc' }
    });
    const parsedFlows = flows.map(f => ({ ...f, nodes: f.nodes ? JSON.parse(f.nodes) : [], edges: f.edges ? JSON.parse(f.edges) : [] }));
    res.json(parsedFlows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFlowById = async (req, res) => {
  try {
    const { id } = req.params;
    const flow = await prisma.flow.findUnique({
      where: { id, account_id: req.userId }
    });
    if (!flow) return res.status(404).json({ error: "Flow not found" });
    res.json({
      ...flow,
      nodes: flow.nodes ? JSON.parse(flow.nodes) : [],
      edges: flow.edges ? JSON.parse(flow.edges) : []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFlow = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, nodes, edges } = req.body;
    
    const flow = await prisma.flow.update({
      where: { id, account_id: req.userId },
      data: {
        name,
        status,
        nodes: nodes ? JSON.stringify(nodes) : undefined,
        edges: edges ? JSON.stringify(edges) : undefined
      }
    });
    res.json({
      ...flow,
      nodes: flow.nodes ? JSON.parse(flow.nodes) : [],
      edges: flow.edges ? JSON.parse(flow.edges) : []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFlow = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.flow.delete({
      where: { id, account_id: req.userId }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const publishFlow = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nodes, edges } = req.body;

    const flow = await prisma.flow.update({
      where: { id, account_id: req.userId },
      data: {
        name,
        status: 'live',
        nodes: nodes ? JSON.stringify(nodes) : undefined,
        edges: edges ? JSON.stringify(edges) : undefined
      }
    });
    res.json({
      ...flow,
      nodes: flow.nodes ? JSON.parse(flow.nodes) : [],
      edges: flow.edges ? JSON.parse(flow.edges) : []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const duplicateFlow = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.flow.findUnique({
      where: { id, account_id: req.userId }
    });
    if (!existing) return res.status(404).json({ error: "Flow not found" });

    const newFlow = await prisma.flow.create({
      data: {
        account_id: req.userId,
        name: `${existing.name} (Copy)`,
        status: "draft",
        nodes: existing.nodes,
        edges: existing.edges
      }
    });
    res.status(201).json(newFlow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
