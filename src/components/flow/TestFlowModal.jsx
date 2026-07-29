import React, { useState, useEffect } from 'react';
import { X, Play, MessageCircle, GitBranch, Clock, Lock, CheckCircle2 } from 'lucide-react';

export default function TestFlowModal({ isOpen, onClose, nodes, edges }) {
  const [logs, setLogs] = useState([]);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [waitingForCondition, setWaitingForCondition] = useState(null); // { nodeId, conditionType }

  useEffect(() => {
    if (isOpen) {
      setLogs([]);
      setIsFinished(false);
      setWaitingForCondition(null);
      startSimulation();
    }
  }, [isOpen]);

  const startSimulation = () => {
    const triggerNode = nodes.find(n => n.type === 'trigger');
    if (!triggerNode) {
      setLogs([{ type: 'error', message: 'No trigger node found in the flow to start testing.' }]);
      setIsFinished(true);
      return;
    }

    setLogs([{ type: 'system', message: 'Simulation started.' }]);
    executeNode(triggerNode.id);
  };

  const executeNode = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setCurrentNodeId(nodeId);

    setTimeout(() => {
      let logMsg = '';
      let logType = 'info';

      switch (node.type) {
        case 'trigger':
          logMsg = `Trigger matched: ${node.data.label}`;
          logType = 'trigger';
          break;
        case 'action':
          logMsg = `Action executed: ${node.data.label} ${node.data.config?.message ? `("${node.data.config.message}")` : ''}`;
          logType = 'action';
          break;
        case 'condition':
          logMsg = `Evaluating Condition: ${node.data.label}`;
          logType = 'condition';
          break;
        case 'delay':
          logMsg = `Waiting for ${node.data.config?.amount || 1} ${node.data.config?.unit || 'minutes'}`;
          logType = 'delay';
          break;
        case 'follow_gate':
          logMsg = `Checking if user is following...`;
          logType = 'gate';
          break;
        default:
          logMsg = `Executed ${node.data.label}`;
      }

      setLogs(prev => [...prev, { type: logType, message: logMsg, time: new Date().toLocaleTimeString() }]);

      // Process next step
      if (node.type === 'condition' || node.type === 'follow_gate') {
        // Stop and wait for user input
        setWaitingForCondition({ nodeId: node.id, type: node.type });
      } else {
        // Move to next node automatically
        const outgoingEdges = edges.filter(e => e.source === node.id);
        if (outgoingEdges.length > 0) {
          executeNode(outgoingEdges[0].target);
        } else {
          finishSimulation();
        }
      }
    }, 800); // add a slight delay for realistic feeling
  };

  const handleConditionResponse = (responsePath) => { // 'yes' or 'no'
    const nodeId = waitingForCondition.nodeId;
    setWaitingForCondition(null);
    setLogs(prev => [...prev, { type: 'user', message: `Simulated path: ${responsePath.toUpperCase()}`, time: new Date().toLocaleTimeString() }]);

    const pathEdges = edges.filter(e => e.source === nodeId && e.sourceHandle === responsePath);
    
    if (pathEdges.length > 0) {
      executeNode(pathEdges[0].target);
    } else {
      finishSimulation();
    }
  };

  const finishSimulation = () => {
    setCurrentNodeId(null);
    setIsFinished(true);
    setLogs(prev => [...prev, { type: 'success', message: 'Flow execution completed successfully.', time: new Date().toLocaleTimeString() }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-white/10 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col h-[80vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 rounded-t-xl">
          <div className="flex items-center space-x-2 text-white font-bold">
            <Play className="w-5 h-5 text-orange-500" />
            <h2>Flow Test Runner</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logs Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0f1117]">
          {logs.map((log, i) => (
            <div key={i} className="flex items-start space-x-3 text-sm animate-in slide-in-from-bottom-2 fade-in duration-300">
              <div className="flex-shrink-0 mt-0.5">
                {log.type === 'system' && <Play className="w-4 h-4 text-gray-500" />}
                {log.type === 'trigger' && <Play className="w-4 h-4 text-orange-500" />}
                {log.type === 'action' && <MessageCircle className="w-4 h-4 text-green-500" />}
                {log.type === 'condition' && <GitBranch className="w-4 h-4 text-amber-500" />}
                {log.type === 'delay' && <Clock className="w-4 h-4 text-blue-500" />}
                {log.type === 'gate' && <Lock className="w-4 h-4 text-purple-500" />}
                {log.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                {log.type === 'user' && <div className="w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-500 flex items-center justify-center text-[8px] text-indigo-400">You</div>}
                {log.type === 'error' && <X className="w-4 h-4 text-red-500" />}
              </div>
              <div className="flex-1">
                <div className="text-gray-300">
                  {log.message}
                </div>
                {log.time && <div className="text-[10px] text-gray-600 mt-0.5">{log.time}</div>}
              </div>
            </div>
          ))}

          {currentNodeId && !waitingForCondition && !isFinished && (
            <div className="flex items-center space-x-2 text-sm text-gray-500 animate-pulse mt-4">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animation-delay-150"></div>
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animation-delay-300"></div>
              <span className="ml-2">Executing...</span>
            </div>
          )}

          {waitingForCondition && (
            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg animate-in slide-in-from-bottom-4 fade-in">
              <p className="text-sm text-gray-300 mb-3 font-medium">Please choose a path to simulate:</p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleConditionResponse('yes')}
                  className="flex-1 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-md hover:bg-green-500/20 transition-colors font-medium text-sm"
                >
                  Path: YES
                </button>
                <button 
                  onClick={() => handleConditionResponse('no')}
                  className="flex-1 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md hover:bg-red-500/20 transition-colors font-medium text-sm"
                >
                  Path: NO
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 rounded-b-xl flex justify-between items-center">
          {isFinished ? (
            <button 
              onClick={startSimulation}
              className="px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors text-sm font-medium"
            >
              Restart Test
            </button>
          ) : (
            <div className="text-xs text-gray-500">Simulation is running...</div>
          )}
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-[#E84B1E] text-white rounded-md hover:bg-[#d64319] shadow-sm shadow-[#E84B1E]/20 transition-colors text-sm font-medium"
          >
            Close Runner
          </button>
        </div>
      </div>
    </div>
  );
}
