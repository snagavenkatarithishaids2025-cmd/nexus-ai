'use client';

import React, { useState } from 'react';
import { useNexusStore, Project, Task } from '@/store/nexusStore';
import { BentoCard } from '@/components/BentoCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { 
  Plus, 
  FolderKanban, 
  Trash2, 
  Clock, 
  Activity as ActIcon,
  CheckCircle2, 
  ListTodo,
  Grid,
  List,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProjectHub() {
  const projects = useNexusStore((state) => state.projects);
  const tasks = useNexusStore((state) => state.tasks);
  const activities = useNexusStore((state) => state.activities);
  const addProject = useNexusStore((state) => state.addProject);
  const deleteProject = useNexusStore((state) => state.deleteProject);
  const addTask = useNexusStore((state) => state.addTask);

  // States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Modal states
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<Project['priority']>('MEDIUM');
  const [newDeadline, setNewDeadline] = useState('');

  // Quick task in project detail
  const [quickTaskTitle, setQuickTaskTitle] = useState('');

  // Add Project routine
  const handleAddProject = () => {
    if (!newName.trim()) return;
    addProject({
      name: newName,
      description: newDesc,
      priority: newPriority,
      status: 'ACTIVE',
      deadline: newDeadline || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0] // 30 days default
    });
    setNewName('');
    setNewDesc('');
    setNewPriority('MEDIUM');
    setNewDeadline('');
    setCreateOpen(false);
  };

  // Add quick task inside project detail view
  const handleAddQuickTask = (projectId: string) => {
    if (!quickTaskTitle.trim()) return;
    addTask({
      title: quickTaskTitle,
      description: 'Quick task created from Project workspace detail.',
      projectId,
      priority: 'MEDIUM',
      status: 'TODO',
      deadline: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
    });
    setQuickTaskTitle('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-body">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1C1917] tracking-tight font-heading uppercase select-none">Project Repository</h1>
          <p className="text-xs text-text-muted mt-0.5 font-body">Track milestones, monitor team deliverables, and manage system assets.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* View Toggles */}
          <div className="flex items-center rounded-lg bg-[#EAE5D9] border border-[#004434]/15 p-0.5 font-body">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#004434] text-white' : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                viewMode === 'list' ? 'bg-[#004434] text-white' : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button 
            variant="primary" 
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 text-xs py-2 shadow-lg font-body"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </Button>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => {
            const projTasks = tasks.filter((t) => t.projectId === proj.id);
            const doneCount = projTasks.filter((t) => t.status === 'DONE').length;
            const isHigh = proj.priority === 'HIGH' || proj.priority === 'URGENT';
            
            return (
              <motion.div
                key={proj.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedProject(proj)}
                className="cursor-pointer"
              >
                <BentoCard
                  variant={isHigh ? 'green' : 'cream'}
                  className="flex flex-col justify-between min-h-[220px] shadow-lg relative overflow-hidden group border border-[#004434]/10 p-6"
                >
                  {/* Glow overlay */}
                  <div className={`absolute -right-12 -top-12 w-28 h-28 rounded-full blur-3xl pointer-events-none transition-colors ${
                    isHigh ? 'bg-[#EAE5D9]/10' : 'bg-[#004434]/5 group-hover:bg-[#004434]/10'
                  }`} />

                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded border ${
                          isHigh ? 'bg-white/10 text-white border-white/20' : 'bg-[#004434]/5 text-[#004434] border-[#004434]/10'
                        }`}>
                          <FolderKanban className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold line-clamp-1 font-heading">{proj.name}</h3>
                          <span className={`block text-[10px] uppercase font-bold tracking-wider mt-0.5 ${
                            isHigh ? 'text-white/60' : 'text-slate-500'
                          }`}>
                            Milestone: {proj.deadline}
                          </span>
                        </div>
                      </div>
                      <Badge variant={proj.health} className={isHigh ? 'bg-white/10 text-white' : ''}>{proj.health}</Badge>
                    </div>

                    <div className="mt-3 space-y-4">
                      <p className={`text-xs leading-relaxed line-clamp-2 ${
                        isHigh ? 'text-white/80' : 'text-slate-600'
                      }`}>
                        {proj.description}
                      </p>

                      {/* Progress Slider bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className={isHigh ? 'text-white/60' : 'text-slate-500'}>Operational Progress</span>
                          <span>{proj.progress}%</span>
                        </div>
                        <div className={`h-1.5 w-full rounded-full overflow-hidden border ${
                          isHigh ? 'bg-white/10 border-white/10' : 'bg-[#F5F2EB] border-[#004434]/10'
                        }`}>
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isHigh ? 'bg-white' : 'bg-[#004434]'
                            }`} 
                            style={{ width: `${proj.progress}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Metrics */}
                  <div className={`border-t pt-3 mt-5 flex justify-between items-center text-xs font-semibold ${
                    isHigh ? 'border-white/10 text-white/70' : 'border-[#004434]/15 text-[#78716C]'
                  }`}>
                    <div className="flex items-center gap-1">
                      <ListTodo className="w-3.5 h-3.5" />
                      <span>{doneCount}/{projTasks.length} Tasks Complete</span>
                    </div>
                    <Badge variant={proj.priority} className={isHigh ? 'bg-white/10 text-white' : ''}>{proj.priority}</Badge>
                  </div>
                </BentoCard>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* List Mode */
        <BentoCard variant="cream" className="p-0 overflow-hidden shadow-lg border border-[#004434]/10">
          <div className="divide-y divide-[#004434]/10 bg-[#EAE5D9]">
            {projects.map((proj) => {
              const projTasks = tasks.filter((t) => t.projectId === proj.id);
              const isHigh = proj.priority === 'HIGH' || proj.priority === 'URGENT';
              
              return (
                <div 
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all cursor-pointer ${
                    isHigh ? 'bg-[#004434] text-white hover:bg-[#003629]' : 'hover:bg-[#F5F2EB]/50 text-[#1C1917]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1 font-body">
                    <div className={`p-1.5 rounded border ${
                      isHigh ? 'bg-white/10 text-white border-white/20' : 'bg-[#F5F2EB] border-[#004434]/10 text-[#004434]'
                    }`}>
                      <FolderKanban className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-sm font-bold font-heading">{proj.name}</span>
                      <span className={`block text-xs truncate max-w-md ${
                        isHigh ? 'text-white/70' : 'text-[#78716C]'
                      }`}>{proj.description}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-body">
                    <Badge variant={proj.health} className={isHigh ? 'bg-white/10 text-white' : ''}>{proj.health}</Badge>
                    <Badge variant={proj.priority} className={isHigh ? 'bg-white/10 text-white' : ''}>{proj.priority}</Badge>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-[#1C1917]">{proj.progress}%</span>
                      <span className={`text-[10px] ${
                        isHigh ? 'text-white/60' : 'text-[#78716C]'
                      }`}>{projTasks.length} Tasks</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </BentoCard>
      )}

      {/* Dialog for Project Creation */}
      <Dialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Initialize New Project"
        footerActions={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddProject}>Deploy Project</Button>
          </>
        }
      >
        <div className="space-y-4 font-body">
          <Input 
            label="Project Name"
            placeholder="e.g. Titan Integration Layer"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
              Project Description
            </label>
            <textarea
              className="glass-input w-full p-2 text-sm min-h-[80px]"
              placeholder="Outline project milestones, architecture and objectives..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Priority Tier
              </label>
              <select
                className="w-full p-2 text-sm bg-white text-[#1C1917] border border-slate-200 rounded-lg outline-none focus:border-[#004434] focus:ring-2 focus:ring-[#004434]/20"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Project['priority'])}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <Input 
              label="Target Deadline"
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
            />
          </div>
        </div>
      </Dialog>

      {/* Dialog / Slider Drawer for Project Detail View */}
      {selectedProject && (
        <Dialog
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={`Asset Registry: ${selectedProject.name}`}
          footerActions={
            <>
              <Button 
                variant="danger" 
                onClick={() => {
                  deleteProject(selectedProject.id);
                  setSelectedProject(null);
                }}
                className="mr-auto"
              >
                Archive Project
              </Button>
              <Button variant="ghost" onClick={() => setSelectedProject(null)}>Close</Button>
            </>
          }
        >
          <div className="space-y-5 font-body">
            {/* Description */}
            <div className="p-3 bg-[#F5F2EB] border border-[#004434]/10 rounded-lg text-xs leading-relaxed text-[#44403C]">
              {selectedProject.description}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded bg-[#F5F2EB] border border-[#004434]/10">
                <span className="block text-[9px] uppercase font-bold text-[#78716C]">Priority</span>
                <span className="block text-xs font-bold text-[#1C1917] mt-1 font-heading">{selectedProject.priority}</span>
              </div>
              <div className="p-2.5 rounded bg-[#F5F2EB] border border-[#004434]/10">
                <span className="block text-[9px] uppercase font-bold text-[#78716C]">Health</span>
                <span className="block text-xs font-bold text-[#1C1917] mt-1 font-heading">{selectedProject.health}</span>
              </div>
              <div className="p-2.5 rounded bg-[#F5F2EB] border border-[#004434]/10">
                <span className="block text-[9px] uppercase font-bold text-[#78716C]">Due Date</span>
                <span className="block text-xs font-bold text-[#1C1917] mt-1 font-heading">{selectedProject.deadline}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-text-muted uppercase">Computed Integrity</span>
                <span className="text-[#004434]">{selectedProject.progress}%</span>
              </div>
              <div className="h-2 w-full bg-[#004434]/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#004434] rounded-full" 
                  style={{ width: `${selectedProject.progress}%` }} 
                />
              </div>
            </div>

            {/* Task list inside project */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-[#78716C] uppercase tracking-wider">Associated Task Logs</span>
              <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1">
                {tasks.filter((t) => t.projectId === selectedProject.id).length > 0 ? (
                  tasks.filter((t) => t.projectId === selectedProject.id).map((task) => (
                    <div 
                      key={task.id} 
                      className="p-2 rounded bg-[#F5F2EB] border border-[#004434]/10 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-1.5 h-1.5 rounded-full ${task.status === 'DONE' ? 'bg-[#15803d]' : 'bg-[#004434] animate-pulse'}`} />
                        <span className={`truncate ${task.status === 'DONE' ? 'line-through text-text-dim' : 'text-[#1C1917] font-semibold'}`}>
                          {task.title}
                        </span>
                      </div>
                      <Badge variant={task.status}>{task.status}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#78716C]">No tasks created under this project repository yet.</p>
                )}
              </div>
            </div>

            {/* Quick Task Creation Block */}
            <div className="border-t border-[#004434]/15 pt-3 mt-3 space-y-2">
              <span className="block text-xs font-bold text-[#78716C] uppercase tracking-wider">Add Action Item</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Create quick task in project..."
                  value={quickTaskTitle}
                  onChange={(e) => setQuickTaskTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 text-[#1C1917] placeholder:text-[#A8A29E] rounded-lg outline-none focus:border-[#004434] focus:ring-2 focus:ring-[#004434]/20"
                />
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleAddQuickTask(selectedProject.id)}
                >
                  Quick Add
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
