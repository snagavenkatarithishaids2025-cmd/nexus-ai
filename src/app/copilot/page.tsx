'use client';

import React, { useState } from 'react';
import { useNexusStore, Task, Project } from '@/store/nexusStore';
import { BentoCard } from '@/components/BentoCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  BrainCircuit, 
  Send, 
  Sparkles, 
  Terminal, 
  AlertOctagon, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RichResponse {
  query: string;
  type: 'priority' | 'warning' | 'summary' | 'recommendation' | 'general';
  title: string;
  summaryText: string;
  stats?: { label: string; value: string | number }[];
  actionItems?: { id: string; title: string; actionLabel: string; handler: () => void }[];
  projectWarnings?: { id: string; name: string; issue: string; progress: number }[];
}

export default function AICopilot() {
  const tasks = useNexusStore((state) => state.tasks);
  const projects = useNexusStore((state) => state.projects);
  const toggleTaskCompletion = useNexusStore((state) => state.toggleTaskCompletion);
  const updateProject = useNexusStore((state) => state.updateProject);

  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [response, setResponse] = useState<RichResponse | null>(null);

  const suggestedPrompts = [
    { text: 'What is my highest priority today?', query: 'priority' },
    { text: 'Which project requires attention?', query: 'warning' },
    { text: 'Summarize my workspace logs', query: 'summary' },
    { text: 'What should I work on next?', query: 'recommendation' }
  ];

  // Process Query Dynamic Engine (reaches into Zustand!)
  const processQuery = (queryType: string) => {
    setIsThinking(true);
    setResponse(null);

    // Simulate neural LLM thinking time
    setTimeout(() => {
      setIsThinking(false);

      if (queryType.includes('priority')) {
        // Find highest priority tasks
        const urgentTodo = tasks.filter((t) => t.status !== 'DONE' && t.priority === 'URGENT');
        const highTodo = tasks.filter((t) => t.status !== 'DONE' && t.priority === 'HIGH');
        const topTask = urgentTodo[0] || highTodo[0];

        if (topTask) {
          const associatedProj = projects.find((p) => p.id === topTask.projectId);
          setResponse({
            query: "What's my highest priority today?",
            type: 'priority',
            title: 'Critical Focus Recommendation',
            summaryText: `Your current bottleneck is "${topTask.title}". It is marked as ${topTask.priority} priority and is linked to the "${associatedProj?.name || 'Workspace'}" milestone. Resolving this will lift your velocity by approximately 15%.`,
            stats: [
              { label: 'Priority Tier', value: topTask.priority },
              { label: 'Deadline', value: topTask.deadline },
              { label: 'Linked Asset', value: associatedProj?.name || 'None' }
            ],
            actionItems: [
              {
                id: topTask.id,
                title: topTask.title,
                actionLabel: 'Complete Task',
                handler: () => toggleTaskCompletion(topTask.id)
              }
            ]
          });
        } else {
          setResponse({
            query: "What's my highest priority today?",
            type: 'priority',
            title: 'Priority Registry Clean',
            summaryText: 'You have zero URGENT or HIGH priority tasks pending in your current queue. Focus on reviewing completed tasks or refining the workflow builder scripts.',
            stats: [
              { label: 'Urgent Backlog', value: 0 },
              { label: 'Total Pending', value: tasks.filter((t) => t.status !== 'DONE').length }
            ]
          });
        }
      } 
      
      else if (queryType.includes('warning') || queryType.includes('attention')) {
        // Find projects with warnings or low progress
        const alertProjects = projects.filter((p) => p.health === 'WARNING' || p.progress < 50);
        
        if (alertProjects.length > 0) {
          setResponse({
            query: 'Which project requires attention?',
            type: 'warning',
            title: 'Operational Health Warnings',
            summaryText: `Analysis has detected warning conditions in ${alertProjects.length} project repository. Specifically, "Helios UI" has multiple pending tasks close to deadlines.`,
            projectWarnings: alertProjects.map((p) => ({
              id: p.id,
              name: p.name,
              issue: p.health === 'WARNING' ? 'Delayed priority milestones' : 'Slow execution velocity',
              progress: p.progress
            })),
            actionItems: alertProjects.map((p) => ({
              id: p.id,
              title: `Optimize ${p.name} deliverables`,
              actionLabel: 'Clear Warning Status',
              handler: () => updateProject(p.id, { health: 'STABLE' })
            }))
          });
        } else {
          setResponse({
            query: 'Which project requires attention?',
            type: 'warning',
            title: 'Workspace Health Stable',
            summaryText: 'All operational project repositories are performing within normal parameters. There are no overdue deadlines or warnings logged.',
            stats: [
              { label: 'System Health', value: '100% SECURE' },
              { label: 'Active Projects', value: projects.length }
            ]
          });
        }
      } 
      
      else if (queryType.includes('summary') || queryType.includes('summarize')) {
        const completed = tasks.filter((t) => t.status === 'DONE').length;
        const total = tasks.length;
        setResponse({
          query: 'Summarize my workspace logs',
          type: 'summary',
          title: 'Weekly Velocity Summary',
          summaryText: `Your performance index is strong. Out of ${total} configured tasks, you have successfully completed ${completed} deliverables. This indicates a ${Math.round((completed/total)*100)}% project completion velocity.`,
          stats: [
            { label: 'Completed', value: completed },
            { label: 'Total Logs', value: total },
            { label: 'Active Nodes', value: projects.length },
            { label: 'Unresolved Bugs', value: tasks.filter((t) => t.priority === 'URGENT' && t.status !== 'DONE').length }
          ]
        });
      } 
      
      else if (queryType.includes('recommendation') || queryType.includes('next')) {
        // Pick an IN_PROGRESS or TODO task
        const pending = tasks.filter((t) => t.status !== 'DONE');
        const nextTask = pending.find((t) => t.status === 'IN_PROGRESS') || pending[0];

        if (nextTask) {
          setResponse({
            query: 'What should I work on next?',
            type: 'recommendation',
            title: 'Sequential Recommendation Engine',
            summaryText: `Based on your recent patterns, we recommend picking up "${nextTask.title}". You already started this task, and completing it unlocks secondary pipeline dependencies.`,
            stats: [
              { label: 'Task Node', value: nextTask.title },
              { label: 'Estimated effort', value: 'Medium (2 hrs)' }
            ],
            actionItems: [
              {
                id: nextTask.id,
                title: nextTask.title,
                actionLabel: 'Mark Completed',
                handler: () => toggleTaskCompletion(nextTask.id)
              }
            ]
          });
        } else {
          setResponse({
            query: 'What should I work on next?',
            type: 'recommendation',
            title: 'Agenda Completed',
            summaryText: 'Congratulations! You have completed all active backlog items in your dashboard. You can create a new automation script inside the workflows page.',
            stats: [
              { label: 'Next steps', value: 'Design Workflows' }
            ]
          });
        }
      } 
      
      else {
        // Default general response
        setResponse({
          query: inputVal || 'Custom prompt query',
          type: 'general',
          title: 'Nexus Neural Response',
          summaryText: `I have compiled your custom request: "${inputVal}". Connecting search vectors to local store. No anomalies detected. Let me know if you would like me to summarize tasks or filter project health.`,
          stats: [
            { label: 'Query Intent', value: 'General Inquiry' },
            { label: 'Vector Logs', value: 'OK' }
          ]
        });
      }
      
      setInputVal('');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-body">
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b border-[#004434]/10 pb-4">
        <div className="p-2 bg-[#004434]/10 rounded-lg text-[#004434] border border-[#004434]/15">
          <BrainCircuit className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#1C1917] tracking-tight font-heading uppercase select-none">AI Copilot Terminal</h1>
          <p className="text-xs text-text-muted mt-0.5 font-body">Orchestrate resources and analyze code blocks using natural prompts.</p>
        </div>
      </div>

      {/* Main Console Box */}
      <BentoCard variant="cream" className="min-h-[400px] flex flex-col justify-between relative overflow-hidden border border-[#004434]/10 shadow-xl p-8">
        {/* Glowing backdrop orbs */}
        <div className="absolute -left-16 -top-16 w-36 h-36 bg-[#004434]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-16 -bottom-16 w-44 h-44 bg-[#004434]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Console Body */}
        <div className="flex-1 p-2 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {isThinking ? (
              /* Thinking Loader */
              <motion.div
                key="thinking"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 space-y-4"
              >
                <div className="relative w-12 h-12 mx-auto">
                  <Loader2 className="w-12 h-12 text-[#004434] animate-spin" />
                  <Sparkles className="w-5 h-5 text-[#EAE5D9] absolute top-3.5 left-3.5 animate-pulse" />
                </div>
                <div className="space-y-1 text-[#004434] font-body">
                  <p className="text-sm font-semibold uppercase tracking-widest animate-pulse">Ingesting Context Vectors</p>
                  <p className="text-[10px] uppercase font-bold tracking-wider opacity-75">Evaluating projects • Scanning pending tasks</p>
                </div>
              </motion.div>
            ) : response ? (
              /* Rich UI Response Cards */
              <motion.div
                key="response"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Header Title block */}
                <div className="flex items-center justify-between border-b border-[#004434]/15 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#004434]" />
                    <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider font-heading">{response.title}</span>
                  </div>
                  <Badge variant={response.type === 'warning' ? 'WARNING' : 'STABLE'}>{response.type}</Badge>
                </div>

                {/* Text summary block */}
                <p className="text-sm leading-relaxed p-4 rounded-2xl bg-[#004434] text-white border border-[#005a45] shadow-sm font-body">
                  {response.summaryText}
                </p>

                {/* Grid stats parameters */}
                {response.stats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-body">
                    {response.stats.map((stat, idx) => (
                      <div key={idx} className="p-3 bg-[#F5F2EB]/50 border border-[#004434]/10 rounded-2xl text-center shadow-sm">
                        <span className="block text-[9px] uppercase font-bold text-[#78716C]">{stat.label}</span>
                        <span className="block text-sm font-bold text-[#1C1917] mt-1 truncate font-heading">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Project warnings list */}
                {response.projectWarnings && (
                  <div className="space-y-3 font-body">
                    <span className="block text-[10px] uppercase font-bold text-[#78716C] tracking-wider">Project Risk Registry</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {response.projectWarnings.map((proj) => (
                        <div key={proj.id} className="p-3.5 rounded-2xl bg-red-100/50 border border-red-200/50 space-y-2 text-[#1C1917]">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#1C1917] text-xs font-heading">{proj.name}</span>
                            <Badge variant="CRITICAL">Risk</Badge>
                          </div>
                          <p className="text-[11px] text-slate-700 leading-tight">{proj.issue}</p>
                          <div className="h-1.5 w-full bg-[#004434]/10 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 rounded-full" style={{ width: `${proj.progress}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions Hub */}
                {response.actionItems && (
                  <div className="space-y-3 font-body">
                    <span className="block text-[10px] uppercase font-bold text-[#78716C] tracking-wider">Recommended Interventions</span>
                    <div className="space-y-2">
                      {response.actionItems.map((action) => (
                        <div 
                          key={action.id} 
                          className="p-3 rounded-2xl bg-[#F5F2EB] border border-[#004434]/10 flex items-center justify-between gap-4 shadow-sm text-[#1C1917]"
                        >
                          <span className="text-xs font-bold text-[#1C1917] truncate font-heading">{action.title}</span>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => {
                              action.handler();
                              setResponse(null); // Clear after executing action to keep it clean
                            }}
                            className="text-xs items-center gap-1 shrink-0 font-body"
                          >
                            <span>{action.actionLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              /* Empty state prompt selector */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 space-y-4 text-[#004434]"
              >
                <BrainCircuit className="w-12 h-12 text-[#004434] mx-auto animate-pulse" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#1C1917] font-heading">AI Copilot Operational</p>
                  <p className="text-xs text-[#78716C] font-medium font-body">Query task bottlenecks, projects falling behind, or generate quick summaries.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggested Queries Container */}
        <div className="mt-8 border-t border-[#004434]/15 pt-4">
          <div className="flex flex-wrap gap-2.5 mb-4">
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => processQuery(p.query)}
                className="px-3 py-2 text-xs font-bold rounded-lg bg-[#004434]/5 border border-[#004434]/10 hover:bg-[#004434]/10 text-[#004434] transition-all cursor-pointer select-none font-body"
              >
                {p.text}
              </button>
            ))}
          </div>

          {/* Typing Prompt Input */}
          <div className="flex gap-2.5">
            <input
              type="text"
              placeholder="Ask copilot custom prompts..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  processQuery(inputVal);
                }
              }}
              className="flex-1 px-4 py-2.5 text-sm bg-white border border-[#004434]/20 rounded-xl text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#004434] focus:ring-2 focus:ring-[#004434]/20 font-body"
            />
            <Button 
              variant="primary" 
              onClick={() => processQuery(inputVal)}
              className="px-4 py-2.5 shrink-0 font-body"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </BentoCard>
    </div>
  );
}
