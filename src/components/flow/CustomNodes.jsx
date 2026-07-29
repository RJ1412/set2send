import React from 'react';
import { Handle, Position } from 'reactflow';
import { Zap, MessageCircle, Clock, GitBranch, Lock } from 'lucide-react';

const icons = {
  trigger: Zap,
  action: MessageCircle,
  delay: Clock,
  condition: GitBranch,
  follow_gate: Lock,
};

const NodeShell = ({ type, color, title, data, isSelected, isConnectable, children, handles }) => {
  const Icon = icons[type] || Zap;
  return (
    <div className={`bg-white rounded-[12px] shadow-sm border border-[#e8e5de] overflow-hidden w-64 transition-all ${isSelected ? 'ring-2 ring-[#8b5cf6] border-[#8b5cf6]' : ''}`}>
      <div className="flex" style={{ borderLeft: `4px solid ${color}` }}>
        <div className="p-4 flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-1.5 rounded-md" style={{ backgroundColor: `${color}15`, color: color }}>
              <Icon size={16} />
            </div>
            <div className="font-bold text-[#1a1a18] text-[11px] uppercase tracking-wide">{title}</div>
          </div>
          <div className="text-[12px] text-[#888] truncate">{data.label || 'Configure node...'}</div>
          {children}
        </div>
      </div>
      {handles}
    </div>
  );
};

export const TriggerNode = ({ data, isConnectable, selected }) => {
  return (
    <NodeShell type="trigger" color="#f97316" title="Trigger" data={data} isSelected={selected} isConnectable={isConnectable} handles={
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-white border-2 border-[#8b5cf6]" />
    } />
  );
};

export const ActionNode = ({ data, isConnectable, selected }) => {
  return (
    <NodeShell type="action" color="#22c55e" title="Action" data={data} isSelected={selected} isConnectable={isConnectable} handles={
      <>
        <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-white border-2 border-[#8b5cf6]" />
        <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-white border-2 border-[#8b5cf6]" />
      </>
    } />
  );
};

export const ConditionNode = ({ data, isConnectable, selected }) => {
  return (
    <NodeShell type="condition" color="#f59e0b" title="Condition" data={data} isSelected={selected} isConnectable={isConnectable} handles={
      <>
        <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-white border-2 border-[#8b5cf6]" />
        <Handle type="source" position={Position.Bottom} id="yes" isConnectable={isConnectable} className="w-3 h-3 bg-green-500 border-2 border-white" style={{ left: '30%' }} />
        <Handle type="source" position={Position.Bottom} id="no" isConnectable={isConnectable} className="w-3 h-3 bg-red-500 border-2 border-white" style={{ left: '70%' }} />
        <div className="flex justify-between text-[10px] text-gray-400 px-10 pb-2 font-bold absolute bottom-0 w-full" style={{ marginBottom: '-16px' }}>
          <span className="text-green-500">YES</span>
          <span className="text-red-500">NO</span>
        </div>
      </>
    } />
  );
};

export const DelayNode = ({ data, isConnectable, selected }) => {
  return (
    <NodeShell type="delay" color="#3b82f6" title="Delay" data={data} isSelected={selected} isConnectable={isConnectable} handles={
      <>
        <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-white border-2 border-[#8b5cf6]" />
        <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-white border-2 border-[#8b5cf6]" />
      </>
    } />
  );
};

export const FollowGateNode = ({ data, isConnectable, selected }) => {
  return (
    <NodeShell type="follow_gate" color="#a855f7" title="Follow Gate" data={{ ...data, label: "Waiting for follow-back" }} isSelected={selected} isConnectable={isConnectable} handles={
      <>
        <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-white border-2 border-[#8b5cf6]" />
        <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-white border-2 border-[#8b5cf6]" />
      </>
    } />
  );
};
