import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, Node, Edge } from 'reactflow';
import api from '../lib/api';

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  flowId: string | null;
  flowName: string;
  status: string;
  selectedNodeId: string | null;
  isDirty: boolean;
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  selectNode: (id: string | null) => void;
  deselectNode: () => void;
  updateNodeData: (id: string, data: any) => void;
  setFlowName: (name: string) => void;
  markClean: () => void;
  loadFlow: (flowData: any) => void;
  saveDraft: () => Promise<boolean>;
  publish: () => Promise<boolean>;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  flowId: null,
  flowName: 'Untitled Flow',
  status: 'draft',
  selectedNodeId: null,
  isDirty: false,

  setNodes: (nodesOrUpdater) => {
    set((state) => {
      const newNodes = typeof nodesOrUpdater === 'function' ? nodesOrUpdater(state.nodes) : nodesOrUpdater;
      return { nodes: newNodes, isDirty: true };
    });
  },

  setEdges: (edgesOrUpdater) => {
    set((state) => {
      const newEdges = typeof edgesOrUpdater === 'function' ? edgesOrUpdater(state.edges) : edgesOrUpdater;
      return { edges: newEdges, isDirty: true };
    });
  },

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
      isDirty: true,
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
      isDirty: true,
    }));
  },

  selectNode: (id) => {
    set({ selectedNodeId: id });
  },

  deselectNode: () => {
    set({ selectedNodeId: null });
  },

  updateNodeData: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
      isDirty: true,
    }));
  },

  setFlowName: (name) => {
    set({ flowName: name, isDirty: true });
  },

  markClean: () => {
    set({ isDirty: false });
  },

  loadFlow: (flowData) => {
    set({
      flowId: flowData.id,
      flowName: flowData.name,
      status: flowData.status,
      nodes: flowData.nodes || [],
      edges: flowData.edges || [],
      isDirty: false,
      selectedNodeId: null,
    });
  },

  saveDraft: async () => {
    const { flowId, flowName, nodes, edges, status } = get();
    try {
      if (flowId && flowId !== 'new') {
        await api.put(`/flows/${flowId}`, {
          name: flowName,
          nodes,
          edges,
          status: status === 'live' ? 'draft' : status,
        });
        set({ status: status === 'live' ? 'draft' : status, isDirty: false });
        return true;
      } else {
        const res = await api.post('/flows', {
          name: flowName,
          nodes,
          edges,
          status: 'draft',
        });
        set({ flowId: res.data.id, status: 'draft', isDirty: false });
        window.history.replaceState(null, '', `/dashboard/flows/${res.data.id}`);
        return true;
      }
    } catch (err) {
      console.error('Failed to save draft:', err);
      return false;
    }
  },

  publish: async () => {
    let { flowId, flowName, nodes, edges } = get();
    try {
      if (!flowId || flowId === 'new') {
        const res = await api.post('/flows', { name: flowName, nodes, edges, status: 'live' });
        flowId = res.data.id;
        set({ flowId });
        window.history.replaceState(null, '', `/dashboard/flows/${flowId}`);
      } else {
        await api.post(`/flows/${flowId}/publish`, { name: flowName, nodes, edges });
      }
      set({ status: 'live', isDirty: false });
      return true;
    } catch (err) {
      console.error('Failed to publish flow:', err);
      throw err;
    }
  }
}));
