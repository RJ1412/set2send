"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useRouter, useParams } from 'next/navigation';
import { TriggerNode, ActionNode, ConditionNode, DelayNode, FollowGateNode } from '../../../../components/flow/CustomNodes';
import { X, Save, Play, ChevronLeft, Zap, MessageCircle, GitBranch, Clock, Lock, Copy } from 'lucide-react';
import { useFlowStore } from '../../../../store/flowStore';
import { validateFlow } from '../../../../lib/flowValidation';
import api from '@/lib/api';
import TestFlowModal from '../../../../components/flow/TestFlowModal';

const initialNodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
  follow_gate: FollowGateNode,
};

let id = Date.now();
const getId = () => `dndnode_${id++}`;

let draggedNode: any = null;

const FlowBuilderCanvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const routeFlowId = params?.id as string;
  const router = useRouter();
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', 'error'

  const { 
    nodes, edges, flowName, status, selectedNodeId, isDirty,
    setNodes, setEdges, onNodesChange, onEdgesChange,
    selectNode, deselectNode, updateNodeData, setFlowName,
    loadFlow, saveDraft, publish 
  } = useFlowStore();

  const { screenToFlowPosition } = useReactFlow();

  // Load flow data on mount
  useEffect(() => {
    if (routeFlowId && routeFlowId !== 'new') {
      api.get(`/flows/${routeFlowId}`).then(res => {
        loadFlow(res.data);
      }).catch(err => {
        if (err.response?.status !== 403 && err.response?.status !== 404) console.error(err);
      });
    }
  }, [routeFlowId, loadFlow]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirty) {
        handleSaveDraft();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isDirty, saveDraft]);

  const handleSaveDraft = async () => {
    setSaveStatus('saving');
    const success = await saveDraft();
    if (success) {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    } else {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const safeNodes = Array.isArray(nodes) ? nodes : [];
  const selectedNode = safeNodes.find(n => n.id === selectedNodeId);

  const onConnect = useCallback((params: any) => {
    let edgeStyle = { stroke: '#D4CEBC', strokeWidth: 2 };
    let edgeLabel: string | undefined = undefined;
    
    if (params.sourceHandle === 'yes') {
      edgeStyle = { stroke: '#22c55e', strokeWidth: 2 };
      edgeLabel = 'YES';
    } else if (params.sourceHandle === 'no') {
      edgeStyle = { stroke: '#ef4444', strokeWidth: 2 };
      edgeLabel = 'NO';
    }

    setEdges((eds) => addEdge({ 
      ...params, 
      animated: status === 'live', 
      style: edgeStyle,
      label: edgeLabel,
      labelBgStyle: { fill: '#fff' },
      labelStyle: { fill: '#1a1a18', fontWeight: 700 }
    }, eds));
  }, [setEdges, status]);

  const onDragStart = (event: React.DragEvent, nodeType: string, subtype: string, label: string) => {
    const data = JSON.stringify({ type: nodeType, subtype, label });
    draggedNode = { type: nodeType, subtype, label };
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/reactflow', data);
    event.dataTransfer.setData('text/plain', nodeType);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      let nodeData = draggedNode;

      if (!nodeData) {
        const dataStr = event.dataTransfer.getData('application/reactflow');
        if (dataStr) {
          try {
            nodeData = JSON.parse(dataStr);
          } catch (e) {}
        }
      }

      if (!nodeData || !nodeData.type) return;

      const { type, subtype, label } = nodeData;

      let position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (!position || isNaN(position.x) || isNaN(position.y)) {
        position = { x: event.clientX || 100, y: event.clientY || 100 };
      }

      position.x = Math.round(position.x / 20) * 20;
      position.y = Math.round(position.y / 20) * 20;

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label, subtype, config: {} },
      };

      setNodes((nds) => {
        const safeNds = Array.isArray(nds) ? nds : [];
        return safeNds.concat(newNode);
      });
      draggedNode = null;
    },
    [screenToFlowPosition, setNodes]
  );

  const handlePublish = async () => {
    const { isValid, errors, errorNodes } = validateFlow(safeNodes, edges);
    
    if (!isValid) {
      alert("Validation Failed:\n" + errors.join("\n"));
      setNodes(nds => {
        const safeNds = Array.isArray(nds) ? nds : [];
        return safeNds.map(n => ({
          ...n,
          style: errorNodes.includes(n.id) ? { border: '2px solid red' } : {}
        }));
      });
      return;
    }

    try {
      await publish();
      alert("Flow published successfully!");
    } catch (e: any) {
      alert("Failed to publish: " + e.message);
    }
  };

  const handleExport = () => {
    const data = JSON.stringify({ nodes, edges, flowName }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${flowName || 'flow'}_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
          if (data.flowName) setFlowName(data.flowName);
        } else {
          alert('Invalid flow file format');
        }
      } catch (err) {
        alert('Failed to parse file');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onPaneClick = useCallback(() => deselectNode(), [deselectNode]);
  const onNodeClick = useCallback((_: any, node: any) => selectNode(node.id), [selectNode]);

  return (
    <div className="flex flex-col w-full bg-[#f5f3ef] relative z-10 font-sans" style={{ height: 'calc(100vh - 68px)' }}>
      {/* Top Toolbar */}
      <div className="bg-white border-b border-[#e8e5de] px-6 py-4 flex items-center justify-between z-10 relative">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.push('/dashboard')} className="text-[#1a1a18] hover:text-[#8b5cf6] transition-colors bg-[#f0ede8] p-[8px] rounded-[8px]">
            <ChevronLeft size={18} strokeWidth={3} />
          </button>
          <input 
            type="text" 
            value={flowName} 
            onChange={e => setFlowName(e.target.value)}
            className="bg-transparent border-b border-transparent hover:border-[#e0ddd6] text-xl font-bold text-[#1a1a18] focus:outline-none focus:border-[#8b5cf6] px-2 py-1 transition-colors"
          />
          <div className="flex items-center space-x-2 px-3 py-1 bg-[#f5f3ef] rounded-[8px] text-[11px] font-bold text-[#444] border border-[#e0ddd6]">
            <div className={`w-2 h-2 rounded-full ${status === 'live' ? 'bg-emerald-500' : 'bg-zinc-500'}`}></div>
            <span>{status.toUpperCase()}</span>
          </div>
          {isDirty && <span className="text-xs text-[#888] font-semibold">Unsaved changes</span>}
        </div>
          <div className="flex flex-col items-end relative">
            <div className="space-x-[12px] flex items-center">
              <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
              
              <div className="flex bg-[#f5f3ef] p-[4px] rounded-[10px] border border-[#e0ddd6]">
                <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 rounded-[6px] hover:bg-white text-[12px] font-bold text-[#555] transition-colors">
                  Import
                </button>
                <button onClick={handleExport} className="px-3 py-1.5 rounded-[6px] hover:bg-white text-[12px] font-bold text-[#555] transition-colors">
                  Export
                </button>
              </div>

              <button onClick={() => setIsTestModalOpen(true)} className="px-4 py-[8px] bg-white border border-[#e0ddd6] rounded-[8px] hover:bg-[#fafaf8] text-[13px] font-semibold text-[#1a1a18] transition-colors">
                Test Flow
              </button>
              <button onClick={handleSaveDraft} className="flex items-center px-4 py-[8px] bg-white border border-[#e0ddd6] rounded-[8px] hover:bg-[#fafaf8] text-[13px] font-semibold text-[#1a1a18] transition-colors">
                <Save className="w-4 h-4 mr-2 text-[#8b5cf6]" />
                Save Draft
              </button>
              <button onClick={handlePublish} className="flex items-center px-5 py-[8px] bg-[#1a1a18] rounded-[8px] hover:bg-[#333] text-[13px] font-semibold text-white shadow-sm transition-all cursor-pointer">
                <Play className="w-4 h-4 mr-2" />
                Publish
              </button>
            </div>
            {saveStatus === 'saving' && <span className="text-[10px] text-[#888] absolute top-[calc(100%+6px)] font-bold">SAVING...</span>}
            {saveStatus === 'saved' && <span className="text-[10px] text-emerald-500 absolute top-[calc(100%+6px)] font-bold">DRAFT SAVED</span>}
            {saveStatus === 'error' && <span className="text-[10px] text-red-500 absolute top-[calc(100%+6px)] font-bold">FAILED TO SAVE</span>}
            {!saveStatus && !isDirty && status === 'draft' && <span className="text-[10px] text-[#888] absolute top-[calc(100%+6px)] font-bold">DRAFT SAVED</span>}
          </div>
        </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* Left Sidebar Palette */}
        <div className="w-[260px] bg-white border-r border-[#e8e5de] p-5 space-y-6 flex-shrink-0 overflow-y-auto hidden md:block z-10 shadow-sm relative">
          <div>
            <h3 className="text-[#1a1a18] font-bold mb-3 text-[11px] uppercase tracking-wider">Triggers</h3>
            <div className="space-y-[10px]">
              <div draggable={true} onDragStart={(e) => onDragStart(e, 'trigger', 'comment_keyword', 'Comment Keyword')} className="flex items-center p-3 border border-[#e0ddd6] rounded-[10px] bg-white cursor-grab hover:border-[#8b5cf6] hover:bg-[#f5f3ff] hover:text-[#8b5cf6] transition-all text-[12.5px] font-semibold text-[#444] shadow-sm">
                <Zap size={15} className="mr-3" /> Comment Keyword
              </div>
              <div draggable={true} onDragStart={(e) => onDragStart(e, 'trigger', 'story_reply', 'Story Reply')} className="flex items-center p-3 border border-[#e0ddd6] rounded-[10px] bg-white cursor-grab hover:border-[#8b5cf6] hover:bg-[#f5f3ff] hover:text-[#8b5cf6] transition-all text-[12.5px] font-semibold text-[#444] shadow-sm">
                <Zap size={15} className="mr-3" /> Story Reply
              </div>
              <div draggable={true} onDragStart={(e) => onDragStart(e, 'trigger', 'story_mention', 'Story Mention')} className="flex items-center p-3 border border-[#e0ddd6] rounded-[10px] bg-white cursor-grab hover:border-[#8b5cf6] hover:bg-[#f5f3ff] hover:text-[#8b5cf6] transition-all text-[12.5px] font-semibold text-[#444] shadow-sm">
                <Zap size={15} className="mr-3" /> Story Mention
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[#1a1a18] font-bold mb-3 text-[11px] uppercase tracking-wider">Actions</h3>
            <div className="space-y-[10px]">
              <div draggable={true} onDragStart={(e) => onDragStart(e, 'action', 'send_dm', 'Send DM')} className="flex items-center p-3 border border-[#e0ddd6] rounded-[10px] bg-white cursor-grab hover:border-[#8b5cf6] hover:bg-[#f5f3ff] hover:text-[#8b5cf6] transition-all text-[12.5px] font-semibold text-[#444] shadow-sm">
                <MessageCircle size={15} className="mr-3" /> Send DM
              </div>
              <div draggable={true} onDragStart={(e) => onDragStart(e, 'action', 'add_tag', 'Add Tag')} className="flex items-center p-3 border border-[#e0ddd6] rounded-[10px] bg-white cursor-grab hover:border-[#8b5cf6] hover:bg-[#f5f3ff] hover:text-[#8b5cf6] transition-all text-[12.5px] font-semibold text-[#444] shadow-sm">
                <MessageCircle size={15} className="mr-3" /> Add Tag
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[#1a1a18] font-bold mb-3 text-[11px] uppercase tracking-wider">Conditions</h3>
            <div className="space-y-[10px]">
              <div draggable={true} onDragStart={(e) => onDragStart(e, 'condition', 'has_tag', 'Has Tag')} className="flex items-center p-3 border border-[#e0ddd6] rounded-[10px] bg-white cursor-grab hover:border-[#8b5cf6] hover:bg-[#f5f3ff] hover:text-[#8b5cf6] transition-all text-[12.5px] font-semibold text-[#444] shadow-sm">
                <GitBranch size={15} className="mr-3" /> Has Tag
              </div>
              <div draggable={true} onDragStart={(e) => onDragStart(e, 'condition', 'is_follower', 'Is Follower')} className="flex items-center p-3 border border-[#e0ddd6] rounded-[10px] bg-white cursor-grab hover:border-[#8b5cf6] hover:bg-[#f5f3ff] hover:text-[#8b5cf6] transition-all text-[12.5px] font-semibold text-[#444] shadow-sm">
                <GitBranch size={15} className="mr-3" /> Is Follower
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[#1a1a18] font-bold mb-3 text-[11px] uppercase tracking-wider">Timing & Special</h3>
            <div className="space-y-[10px]">
              <div draggable={true} onDragStart={(e) => onDragStart(e, 'delay', 'wait', 'Wait Delay')} className="flex items-center p-3 border border-[#e0ddd6] rounded-[10px] bg-white cursor-grab hover:border-[#8b5cf6] hover:bg-[#f5f3ff] hover:text-[#8b5cf6] transition-all text-[12.5px] font-semibold text-[#444] shadow-sm">
                <Clock size={15} className="mr-3" /> Delay
              </div>
              <div draggable={true} onDragStart={(e) => onDragStart(e, 'follow_gate', 'follow_gate', 'Follow Gate')} className="flex items-center p-3 border border-[#e0ddd6] rounded-[10px] bg-white cursor-grab hover:border-[#8b5cf6] hover:bg-[#f5f3ff] hover:text-[#8b5cf6] transition-all text-[12.5px] font-semibold text-[#444] shadow-sm">
                <Lock size={15} className="mr-3" /> Follow Gate
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-[#f5f3ef]" style={{ height: '100%' }} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={safeNodes}
            edges={Array.isArray(edges) ? edges : []}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={initialNodeTypes}
            snapToGrid={true}
            snapGrid={[20, 20]}
            fitView
            fitViewOptions={{ maxZoom: 1, padding: 0.2 }}
            className="bg-transparent"
          >
            <Controls className="!bg-white !border-[#e0ddd6] shadow-sm [&>button]:!bg-white [&>button]:!border-b-[#e0ddd6] [&>button>svg]:!fill-[#1a1a18] [&>button:hover]:!bg-[#f5f3ef]" />
            <MiniMap 
              nodeStrokeColor={(n) => {
                if (n.type === 'trigger') return '#f97316';
                if (n.type === 'action') return '#10b981';
                if (n.type === 'condition') return '#eab308';
                if (n.type === 'delay') return '#3b82f6';
                if (n.type === 'follow_gate') return '#a855f7';
                return '#444';
              }}
              nodeColor="#fff"
              maskColor="rgba(245, 243, 239, 0.7)"
              style={{ backgroundColor: '#fff', border: '1px solid #e8e5de', borderRadius: '12px' }}
            />
            <Background color="#d4cebc" gap={20} size={2} />
          </ReactFlow>
        </div>

        {/* Right Configuration Panel */}
        {selectedNode && (
          <div className="w-[340px] bg-white border-l border-[#e8e5de] p-6 z-20 flex-shrink-0 overflow-y-auto absolute right-0 top-0 bottom-0 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e8e5de]">
              <h2 className="text-[16px] font-bold text-[#1a1a18]">
                {selectedNode.data.label}
              </h2>
              <button onClick={deselectNode} className="text-[#888] hover:text-[#1a1a18] transition-colors cursor-pointer bg-[#f0ede8] p-[6px] rounded-[6px]">
                <X size={16} strokeWidth={3} />
              </button>
            </div>

            <div className="space-y-[20px]">
              <div>
                <label className="block text-[11px] font-bold text-[#1a1a18] uppercase tracking-wider mb-[8px]">Node Label</label>
                <input 
                  type="text" 
                  value={selectedNode.data.label} 
                  onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                  className="w-full px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] font-medium text-[#1a1a18] focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]"
                />
              </div>

              {selectedNode.data.subtype === 'comment_keyword' && (
                <div>
                  <label className="block text-[11px] font-bold text-[#1a1a18] uppercase tracking-wider mb-[8px]">Keyword</label>
                  <input 
                    type="text" 
                    value={selectedNode.data.config?.keyword || ''}
                    onChange={(e) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, keyword: e.target.value }})}
                    placeholder="Enter trigger keyword"
                    className="w-full px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] font-medium text-[#1a1a18] focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]"
                  />
                  <select 
                    value={selectedNode.data.config?.match_type || 'exact'}
                    onChange={(e) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, match_type: e.target.value }})}
                    className="w-full mt-[10px] px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] font-medium text-[#1a1a18] focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]"
                  >
                    <option value="exact">Exact match</option>
                    <option value="contains">Contains</option>
                  </select>
                </div>
              )}

              {selectedNode.data.subtype === 'send_dm' && (
                <div className="space-y-[20px]">
                  <div>
                    <label className="block text-[11px] font-bold text-[#1a1a18] uppercase tracking-wider mb-[8px]">Message Template</label>
                    <textarea 
                      rows={5}
                      value={selectedNode.data.config?.message || ''}
                      onChange={(e) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, message: e.target.value }})}
                      placeholder="Enter your message here..."
                      className="w-full px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] text-[#1a1a18] focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] resize-none leading-relaxed"
                    />
                    <p className="text-[11px] text-[#888] mt-2">Variables: {'{first_name}'}, {'{username}'}</p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#1a1a18] uppercase tracking-wider mb-[8px]">Attachment Type</label>
                    <select 
                      value={selectedNode.data.config?.attachmentType || 'none'}
                      onChange={(e) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, attachmentType: e.target.value }})}
                      className="w-full px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] font-medium text-[#1a1a18] focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]"
                    >
                      <option value="none">None</option>
                      <option value="image">Image</option>
                      <option value="video">GIF / Video</option>
                      <option value="audio">Voice Note</option>
                    </select>
                  </div>
                  {selectedNode.data.config?.attachmentType && selectedNode.data.config?.attachmentType !== 'none' && (
                    <div>
                      <label className="block text-[11px] font-bold text-[#1a1a18] uppercase tracking-wider mb-[8px]">Attachment URL</label>
                      <input 
                        type="text" 
                        value={selectedNode.data.config?.attachmentUrl || ''}
                        onChange={(e) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, attachmentUrl: e.target.value }})}
                        placeholder={`Enter ${selectedNode.data.config?.attachmentType} URL`}
                        className="w-full px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] font-medium text-[#1a1a18] focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-[11px] font-bold text-[#1a1a18] uppercase tracking-wider mb-[8px]">Link URL</label>
                    <input 
                      type="text" 
                      value={selectedNode.data.config?.linkUrl || ''}
                      onChange={(e) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, linkUrl: e.target.value }})}
                      placeholder="Enter a link to include"
                      className="w-full px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] font-medium text-[#1a1a18] focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]"
                    />
                  </div>
                </div>
              )}

              {selectedNode.type === 'delay' && (
                <div>
                  <label className="block text-[11px] font-bold text-[#1a1a18] uppercase tracking-wider mb-[8px]">Wait Duration</label>
                  <div className="flex space-x-3">
                    <input 
                      type="number" 
                      min="1"
                      value={selectedNode.data.config?.amount || 1}
                      onChange={(e) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, amount: parseInt(e.target.value) }})}
                      className="w-1/2 px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] font-medium text-[#1a1a18] focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]"
                    />
                    <select 
                      value={selectedNode.data.config?.unit || 'minutes'}
                      onChange={(e) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, unit: e.target.value }})}
                      className="w-1/2 px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] font-medium text-[#1a1a18] focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]"
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedNode.type === 'condition' && (
                <div>
                  <label className="block text-[11px] font-bold text-[#1a1a18] uppercase tracking-wider mb-[8px]">Condition Value</label>
                  <input 
                    type="text" 
                    placeholder="e.g. buyer"
                    value={selectedNode.data.config?.value || ''}
                    onChange={(e) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, value: e.target.value }})}
                    className="w-full px-[14px] py-[10px] bg-white border border-[#e0ddd6] rounded-[10px] text-[13px] font-medium text-[#1a1a18] focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]"
                  />
                </div>
              )}
            </div>
            
            <div className="absolute bottom-6 left-6 right-6 space-y-3">
              <button 
                onClick={() => {
                  const newNode = { ...selectedNode, id: getId(), position: { x: selectedNode.position.x + 50, y: selectedNode.position.y + 50 } };
                  setNodes(nds => {
                    const safeNds = Array.isArray(nds) ? nds : [];
                    return safeNds.concat(newNode);
                  });
                }}
                className="w-full flex items-center justify-center px-4 py-[10px] bg-white text-[#1a1a18] border border-[#e0ddd6] rounded-[10px] hover:bg-[#fafaf8] transition-colors font-semibold text-[13px] cursor-pointer"
              >
                <Copy size={16} className="mr-2 text-[#555]" /> Duplicate
              </button>
              <button 
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this node?")) {
                    setNodes(nds => {
                      const safeNds = Array.isArray(nds) ? nds : [];
                      return safeNds.filter(n => n.id !== selectedNode.id);
                    });
                    setEdges(eds => {
                      const safeEds = Array.isArray(eds) ? eds : [];
                      return safeEds.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id);
                    });
                    deselectNode();
                  }
                }}
                className="w-full px-4 py-[10px] bg-[#fff0f0] text-[#ff4d4d] border border-[#ffd6d6] rounded-[10px] hover:bg-[#ffe6e6] transition-colors font-semibold text-[13px] cursor-pointer"
              >
                Delete Node
              </button>
            </div>
          </div>
        )}
      </div>

      <TestFlowModal 
        isOpen={isTestModalOpen} 
        onClose={() => setIsTestModalOpen(false)} 
        nodes={safeNodes} 
        edges={Array.isArray(edges) ? edges : []} 
      />
    </div>
  );
};

export default function FlowBuilder() {
  return (
    <ReactFlowProvider>
      <FlowBuilderCanvas />
    </ReactFlowProvider>
  );
}
