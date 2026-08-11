'use client';

import React, { useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  addEdge,
  Connection, 
  Edge,
  Handle,
  Position,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useNexusStore } from '@/store/nexusStore';
import { BentoCard } from '@/components/BentoCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  PlusCircle, 
  BrainCircuit, 
  GitBranch, 
  Zap, 
  Bell, 
  FolderKanban,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Copy,
  Trash2
} from 'lucide-react';

// Custom Node Components
const TriggerNode = ({ data }: any) => (
  <div className="px-4 py-3 rounded-2xl border border-teal-500/30 bg-teal-50/95 text-left shadow-md min-w-[180px] font-body">
    <Handle type="source" position={Position.Right} className="!bg-teal-500" />
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 rounded bg-teal-500/10 text-teal-600">
        <PlusCircle className="w-4 h-4" />
      </div>
      <div>
        <span className="block text-[10px] font-extrabold text-teal-700 uppercase tracking-wider">Trigger</span>
        <span className="block text-xs font-bold text-[#1C1917] mt-0.5">{data.label}</span>
      </div>
    </div>
    <span className="block text-[9px] text-slate-500 mt-1.5">{data.description}</span>
  </div>
);

const AINode = ({ data }: any) => (
  <div className="px-4 py-3 rounded-2xl border border-purple-500/30 bg-purple-50/95 text-left shadow-md min-w-[180px] font-body">
    <Handle type="target" position={Position.Left} className="!bg-purple-500" />
    <Handle type="source" position={Position.Right} className="!bg-purple-500" />
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 rounded bg-purple-500/10 text-purple-600">
        <BrainCircuit className="w-4 h-4" />
      </div>
      <div>
        <span className="block text-[10px] font-extrabold text-purple-700 uppercase tracking-wider">AI Copilot</span>
        <span className="block text-xs font-bold text-[#1C1917] mt-0.5">{data.label}</span>
      </div>
    </div>
    <span className="block text-[9px] text-slate-500 mt-1.5">{data.description}</span>
  </div>
);

const ConditionNode = ({ data }: any) => (
  <div className="px-4 py-3 rounded-2xl border border-amber-500/30 bg-amber-50/95 text-left shadow-md min-w-[180px] font-body">
    <Handle type="target" position={Position.Left} className="!bg-amber-500" />
    <Handle type="source" position={Position.Right} id="true" className="!bg-amber-500" style={{ top: '35%' }} />
    <Handle type="source" position={Position.Right} id="false" className="!bg-amber-500" style={{ top: '65%' }} />
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 rounded bg-amber-500/10 text-amber-600">
        <GitBranch className="w-4 h-4" />
      </div>
      <div>
        <span className="block text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">Condition</span>
        <span className="block text-xs font-bold text-[#1C1917] mt-0.5">{data.label}</span>
      </div>
    </div>
    <span className="block text-[9px] text-slate-500 mt-1.5">{data.description}</span>
  </div>
);

const ActionNode = ({ data }: any) => (
  <div className="px-4 py-3 rounded-2xl border border-indigo-500/30 bg-indigo-50/95 text-left shadow-md min-w-[180px] font-body">
    <Handle type="target" position={Position.Left} className="!bg-indigo-500" />
    <Handle type="source" position={Position.Right} className="!bg-indigo-500" />
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-600">
        <Zap className="w-4 h-4" />
      </div>
      <div>
        <span className="block text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider">Action</span>
        <span className="block text-xs font-bold text-[#1C1917] mt-0.5">{data.label}</span>
      </div>
    </div>
    <span className="block text-[9px] text-slate-500 mt-1.5">{data.description}</span>
  </div>
);

const NotificationNode = ({ data }: any) => (
  <div className="px-4 py-3 rounded-2xl border border-rose-500/30 bg-rose-50/95 text-left shadow-md min-w-[180px] font-body">
    <Handle type="target" position={Position.Left} className="!bg-rose-500" />
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 rounded bg-rose-500/10 text-rose-600">
        <Bell className="w-4 h-4" />
      </div>
      <div>
        <span className="block text-[10px] font-extrabold text-rose-700 uppercase tracking-wider">Notification</span>
        <span className="block text-xs font-bold text-[#1C1917] mt-0.5">{data.label}</span>
      </div>
    </div>
    <span className="block text-[9px] text-slate-500 mt-1.5">{data.description}</span>
  </div>
);

export default function WorkflowBuilder() {
  const storeNodes = useNexusStore((state) => state.nodes);
  const storeEdges = useNexusStore((state) => state.edges);
  const setStoreNodes = useNexusStore((state) => state.setNodes);
  const setStoreEdges = useNexusStore((state) => state.setEdges);
  const loadWorkflowPreset = useNexusStore((state) => state.loadWorkflowPreset);
  const addActivity = useNexusStore((state) => state.addActivity);

  // Local React Flow State mapped to Zustand Store initially
  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

  // Keep Zustand store synchronized with node dragging
  React.useEffect(() => {
    setNodes(storeNodes);
  }, [storeNodes, setNodes]);

  React.useEffect(() => {
    setEdges(storeEdges);
  }, [storeEdges, setEdges]);

  // Hook connection event
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `e-${Date.now()}`,
        animated: true, // Force visual flow indicators
        style: { stroke: '#6366f1', strokeWidth: 2 }
      };
      setEdges((eds) => addEdge(newEdge, eds));
      setStoreEdges((eds) => addEdge(newEdge, eds));
      addActivity('New workflow connection created', 'workflow');
    },
    [setEdges, setStoreEdges, addActivity]
  );

  const nodeTypes = useMemo(() => ({
    triggerNode: TriggerNode,
    aiNode: AINode,
    conditionNode: ConditionNode,
    actionNode: ActionNode,
    notificationNode: NotificationNode
  }), []);

  // Preset loading routines
  const handleLoadPreset = (name: string) => {
    loadWorkflowPreset(name);
  };

  // Add random node helper
  const handleAddNode = (type: 'triggerNode' | 'aiNode' | 'conditionNode' | 'actionNode' | 'notificationNode') => {
    const id = `node-${Date.now()}`;
    const labels = {
      triggerNode: 'API Webhook Hook',
      aiNode: 'AI Intent Classifier',
      conditionNode: 'Evaluation Loop',
      actionNode: 'Push to Archive',
      notificationNode: 'Dispatched Slack Log'
    };
    const descriptions = {
      triggerNode: 'Catches incoming event stream triggers',
      aiNode: 'Identifies contextual priorities',
      conditionNode: 'Branches based on criteria logic',
      actionNode: 'Updates local database nodes',
      notificationNode: 'Issues message to team channels'
    };

    const newNode = {
      id,
      type,
      position: { x: Math.random() * 250 + 150, y: Math.random() * 200 + 100 },
      data: { 
        label: labels[type], 
        description: descriptions[type]
      }
    };

    setStoreNodes((nds) => [...nds, newNode]);
    addActivity(`Created new ${type} workflow node`, 'workflow');
  };

  // Delete node helper
  const handleDeleteNode = () => {
    // Delete currently highlighted node
    const activeNodes = nodes.filter((n) => n.selected);
    if (activeNodes.length === 0) return;
    
    const activeId = activeNodes[0].id;
    setStoreNodes((nds) => nds.filter((n) => n.id !== activeId));
    setStoreEdges((eds) => eds.filter((e) => e.source !== activeId && e.target !== activeId));
    addActivity('Deleted workflow canvas node', 'workflow');
  };

  // Run/test simulation alert
  const handleTestRun = () => {
    addActivity('Initiating automation dry-run simulation', 'workflow');
    alert('Workflow automation test run successful. Check dashboard logs for ingested activities.');
  };

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col font-body">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-[#1C1917] tracking-tight font-heading uppercase select-none">Visual Workflows</h1>
          <p className="text-xs text-text-muted mt-0.5 font-body">Wire trigger webhooks, configure cognitive steps, and dispatch notifications.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleTestRun}
            className="flex items-center gap-2 text-xs py-2 font-body"
          >
            <Play className="w-4 h-4 text-[#004434]" />
            <span>Test Workflow</span>
          </Button>

          <select
            onChange={(e) => handleLoadPreset(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-white text-[#1C1917] border border-slate-200 rounded-lg outline-none cursor-pointer focus:border-[#004434] focus:ring-2 focus:ring-[#004434]/20 font-body"
            defaultValue=""
          >
            <option value="" disabled>Load Automation Template</option>
            <option value="automation">Task Prioritization Pipeline</option>
            <option value="aiRouter">Vercel Auto Deploy & Audit</option>
          </select>
        </div>
      </div>

      {/* Main Flow Canvas Bento Split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
        
        {/* Left Control Toolbox */}
        <BentoCard variant="green" className="lg:col-span-1 flex flex-col justify-between h-full min-h-0 overflow-y-auto p-6 border border-[#005a45]">
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider">Automation Palette</h3>
              <Badge variant="default" className="bg-white/10 text-white font-body">Nodes</Badge>
            </div>

            <div className="space-y-3.5 font-body">
              <span className="block text-[10px] uppercase font-bold text-white/50 tracking-wider">Drag & Click Injectors</span>
              
              <button
                onClick={() => handleAddNode('triggerNode')}
                className="w-full p-3 rounded-lg border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 flex items-center justify-between text-xs text-teal-400 font-semibold transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4.5 h-4.5" />
                  <span>Trigger Node</span>
                </div>
                <span className="text-[10px] text-teal-500 font-bold">Add</span>
              </button>

              <button
                onClick={() => handleAddNode('aiNode')}
                className="w-full p-3 rounded-lg border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 flex items-center justify-between text-xs text-purple-400 font-semibold transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <BrainCircuit className="w-4.5 h-4.5" />
                  <span>AI Copilot Node</span>
                </div>
                <span className="text-[10px] text-purple-500 font-bold">Add</span>
              </button>

              <button
                onClick={() => handleAddNode('conditionNode')}
                className="w-full p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 flex items-center justify-between text-xs text-amber-400 font-semibold transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <GitBranch className="w-4.5 h-4.5" />
                  <span>Condition Node</span>
                </div>
                <span className="text-[10px] text-amber-500 font-bold">Add</span>
              </button>

              <button
                onClick={() => handleAddNode('actionNode')}
                className="w-full p-3 rounded-lg border border-indigo-500/20 bg-indigo-50/5 hover:bg-indigo-500/10 flex items-center justify-between text-xs text-indigo-400 font-semibold transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4.5 h-4.5" />
                  <span>Action Node</span>
                </div>
                <span className="text-[10px] text-indigo-500 font-bold">Add</span>
              </button>

              <button
                onClick={() => handleAddNode('notificationNode')}
                className="w-full p-3 rounded-lg border border-rose-500/20 bg-rose-50/5 hover:bg-rose-500/10 flex items-center justify-between text-xs text-rose-400 font-semibold transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4.5 h-4.5" />
                  <span>Notification Node</span>
                </div>
                <span className="text-[10px] text-rose-500 font-bold">Add</span>
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 mt-6 space-y-3.5 font-body">
            <span className="block text-[10px] uppercase font-bold text-white/50 tracking-wider">Canvas Commands</span>
            
            <div className="flex gap-2">
              <Button 
                variant="danger" 
                size="sm" 
                onClick={handleDeleteNode}
                className="w-full flex items-center justify-center gap-1 text-[11px]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Node</span>
              </Button>
            </div>

            <p className="text-[10px] text-white/40 leading-relaxed">
              * Select a node on the canvas and click delete, or drag edges between handle points to link operations.
            </p>
          </div>
        </BentoCard>

        {/* Right Flow Canvas */}
        <BentoCard variant="cream" className="lg:col-span-3 h-full p-0 relative overflow-hidden shadow-lg border border-[#004434]/10">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            colorMode="light"
          >
            <Background color="#A8A29E" gap={16} size={1} />
            <Controls className="!bg-white !border-slate-200 !text-slate-800" />
            <MiniMap 
              className="!bg-white !border-slate-200" 
              nodeColor={() => '#004434'}
              maskColor="rgba(255,255,255,0.6)"
            />
          </ReactFlow>
        </BentoCard>
      </div>
    </div>
  );
}
