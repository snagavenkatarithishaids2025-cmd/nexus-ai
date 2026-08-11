'use client';

import React, { useState } from 'react';
import { useNexusStore, Task } from '@/store/nexusStore';
import { BentoCard } from '@/components/BentoCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  List, 
  KanbanSquare, 
  Calendar,
  AlertCircle,
  ArrowRightLeft,
  ChevronRight,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaskHub() {
  const tasks = useNexusStore((state) => state.tasks);
  const projects = useNexusStore((state) => state.projects);
  const addTask = useNexusStore((state) => state.addTask);
  const updateTask = useNexusStore((state) => state.updateTask);
  const deleteTask = useNexusStore((state) => state.deleteTask);
  const toggleTaskCompletion = useNexusStore((state) => state.toggleTaskCompletion);

  // States
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');
  
  // Create task modal states
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newProjId, setNewProjId] = useState('');
  const [newPriority, setNewPriority] = useState<Task['priority']>('MEDIUM');
  const [newDeadline, setNewDeadline] = useState('');

  // Edit task modal states
  const [editOpen, setEditOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editProjId, setEditProjId] = useState('');
  const [editPriority, setEditPriority] = useState<Task['priority']>('MEDIUM');
  const [editStatus, setEditStatus] = useState<Task['status']>('TODO');
  const [editDeadline, setEditDeadline] = useState('');

  // Handle task additions
  const handleAddTask = () => {
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle,
      description: newDesc,
      projectId: newProjId || projects[0]?.id || 'proj-1',
      priority: newPriority,
      status: 'TODO',
      deadline: newDeadline || new Date().toISOString().split('T')[0]
    });
    // Reset
    setNewTitle('');
    setNewDesc('');
    setNewProjId('');
    setNewPriority('MEDIUM');
    setNewDeadline('');
    setCreateOpen(false);
  };

  // Trigger editing task setup
  const openEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDesc(task.description);
    setEditProjId(task.projectId);
    setEditPriority(task.priority);
    setEditStatus(task.status);
    setEditDeadline(task.deadline);
    setEditOpen(true);
  };

  // Save updates
  const handleSaveTask = () => {
    if (!editingTaskId || !editTitle.trim()) return;
    updateTask(editingTaskId, {
      title: editTitle,
      description: editDesc,
      projectId: editProjId,
      priority: editPriority,
      status: editStatus,
      deadline: editDeadline
    });
    setEditOpen(false);
    setEditingTaskId(null);
  };

  // Filter and Search Logic
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchesProject = projectFilter === 'ALL' || t.projectId === projectFilter;
    return matchesSearch && matchesPriority && matchesProject;
  });

  const columns: { title: string; status: Task['status'] }[] = [
    { title: 'To Do', status: 'TODO' },
    { title: 'In Progress', status: 'IN_PROGRESS' },
    { title: 'Review', status: 'REVIEW' },
    { title: 'Completed', status: 'DONE' }
  ];

  // Helper to progress/cycle task status
  const cycleStatus = (id: string, currentStatus: Task['status']) => {
    const sequence: Task['status'][] = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
    const currentIdx = sequence.indexOf(currentStatus);
    const nextStatus = sequence[(currentIdx + 1) % sequence.length];
    updateTask(id, { status: nextStatus });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-body">
      {/* Top Banner section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1C1917] tracking-tight font-heading uppercase select-none">Task Workspace</h1>
          <p className="text-xs text-text-muted mt-0.5 font-body">Manage details, track backlogs, and prioritize items.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* View Toggles */}
          <div className="flex items-center rounded-lg bg-[#EAE5D9] border border-[#004434]/15 p-0.5 font-body">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                viewMode === 'board' ? 'bg-[#004434] text-white' : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <KanbanSquare className="w-4 h-4" />
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
            <span>Create Task</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <BentoCard variant="cream" className="flex flex-col md:flex-row gap-4 justify-between items-center shadow-md">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#78716C]" />
          <input
            type="text"
            placeholder="Search task logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004434]/20 focus:border-[#004434] font-body"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end font-body">
          {/* Priority filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-700 outline-none border-none font-semibold cursor-pointer focus:ring-0"
            >
              <option value="ALL" className="bg-white text-slate-900">All Priorities</option>
              <option value="LOW" className="bg-white text-slate-900">Low</option>
              <option value="MEDIUM" className="bg-white text-slate-900">Medium</option>
              <option value="HIGH" className="bg-white text-slate-900">High</option>
              <option value="URGENT" className="bg-white text-slate-900">Urgent</option>
            </select>
          </div>

          {/* Project filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-700 outline-none border-none font-semibold cursor-pointer focus:ring-0"
            >
              <option value="ALL" className="bg-white text-slate-900">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-white text-slate-900">{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </BentoCard>

      {/* Main Board View */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);
            return (
              <div key={col.status} className="flex flex-col min-h-[500px]">
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-[#004434]/15 pb-2.5 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider font-heading">{col.title}</span>
                    <span className="w-5 h-5 rounded-full bg-[#EAE5D9] flex items-center justify-center text-[10px] text-[#1C1917] font-bold font-body">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Task Cards Container */}
                <div className="flex-1 space-y-4">
                  {colTasks.length > 0 ? (
                    colTasks.map((task) => {
                      const isHigh = task.priority === 'HIGH' || task.priority === 'URGENT';
                      return (
                        <motion.div
                          key={task.id}
                          layout
                          whileHover={{ scale: 1.01 }}
                          onClick={() => openEditModal(task)}
                          className="cursor-pointer"
                        >
                          <BentoCard 
                            variant={isHigh ? 'green' : 'cream'} 
                            className="p-4 space-y-3 shadow-md hover:scale-[1.01] hover:-translate-y-0.5 border border-[#004434]/10 transition-all"
                          >
                            {/* Upper Details */}
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isHigh ? 'text-[#EAE5D9]' : 'text-[#004434]'}`}>
                                {projects.find((p) => p.id === task.projectId)?.name || 'Generic'}
                              </span>
                              <Badge variant={task.priority} className={isHigh ? 'bg-white/10 text-white' : ''}>{task.priority}</Badge>
                            </div>

                            {/* Title and description */}
                            <div>
                              <h4 className="text-sm font-bold line-clamp-1 font-heading">{task.title}</h4>
                              <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${isHigh ? 'text-white/80' : 'text-slate-600'}`}>{task.description}</p>
                            </div>

                            {/* Deadline & Control toolbar */}
                            <div className={`flex items-center justify-between border-t pt-2 mt-2 ${isHigh ? 'border-white/10' : 'border-[#004434]/15'}`}>
                              <div className={`flex items-center gap-1.5 text-[10px] ${isHigh ? 'text-white/60' : 'text-slate-500'}`}>
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{task.deadline}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {/* Cycle status */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    cycleStatus(task.id, task.status);
                                  }}
                                  className={`p-1 rounded transition-colors cursor-pointer ${
                                    isHigh ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-[#F5F2EB] hover:bg-[#F5F2EB]/80 text-[#004434]'
                                  }`}
                                  title="Advance Status"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTask(task.id);
                                  }}
                                  className={`p-1 rounded transition-colors cursor-pointer ${
                                    isHigh ? 'bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300' : 'bg-[#F5F2EB] hover:bg-red-100 text-[#004434] hover:text-red-700'
                                  }`}
                                  title="Delete Task"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </BentoCard>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="border border-dashed border-[#004434]/15 rounded-3xl py-12 text-center">
                      <AlertCircle className="w-6 h-6 text-[#004434]/30 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-[#004434]/50">Column Empty</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <BentoCard variant="cream" className="p-0 overflow-hidden shadow-lg border border-[#004434]/10">
          <div className="divide-y divide-[#004434]/10 bg-[#EAE5D9]">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const isHigh = task.priority === 'HIGH' || task.priority === 'URGENT';
                return (
                  <div 
                    key={task.id} 
                    className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all cursor-pointer ${
                      isHigh ? 'bg-[#004434] text-white hover:bg-[#003629]' : 'hover:bg-[#F5F2EB]/50 text-[#1C1917]'
                    }`}
                    onClick={() => openEditModal(task)}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskCompletion(task.id);
                        }}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          isHigh ? 'border-white/40 hover:border-white' : 'border-[#004434]/30 hover:border-[#004434]'
                        }`}
                      >
                        {task.status === 'DONE' && (
                          <CheckCircle2 className={`w-4 h-4 ${isHigh ? 'text-[#EAE5D9]' : 'text-[#004434]'}`} />
                        )}
                      </button>
                      <div className="min-w-0">
                        <span className={`block text-sm font-bold ${task.status === 'DONE' ? 'line-through opacity-50' : ''}`}>
                          {task.title}
                        </span>
                        <span className={`block text-xs mt-0.5 truncate max-w-lg ${isHigh ? 'text-white/70' : 'text-slate-500'}`}>
                          {task.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 shrink-0">
                      <span className={`text-[10px] font-extrabold uppercase ${isHigh ? 'text-[#EAE5D9]' : 'text-[#004434]'}`}>
                        {projects.find((p) => p.id === task.projectId)?.name || 'Generic'}
                      </span>
                      <Badge variant={task.status} className={isHigh ? 'bg-white/10 text-white' : ''}>{task.status}</Badge>
                      <Badge variant={task.priority} className={isHigh ? 'bg-white/10 text-white' : ''}>{task.priority}</Badge>
                      
                      <div className="flex items-center gap-2 pl-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                          }}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            isHigh ? 'bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300' : 'bg-[#F5F2EB] hover:bg-red-100 text-[#004434] hover:text-red-700'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 text-[#004434]">
                <AlertCircle className="w-10 h-10 text-[#004434]/40 mx-auto mb-2" />
                <p className="text-sm font-bold">No tasks matching filters</p>
                <p className="text-xs text-[#004434]/60 mt-0.5">Try resetting search query or filter options.</p>
              </div>
            )}
          </div>
        </BentoCard>
      )}

      {/* Dialog for Quick Task Creation */}
      <Dialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Operational Task"
        footerActions={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddTask}>Confirm Task</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input 
            label="Task Title"
            placeholder="e.g. Implement OIDC token signing verification"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
              Task Description
            </label>
            <textarea
              className="glass-input w-full p-2 text-sm min-h-[80px]"
              placeholder="Provide context and requirements..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Project Link
              </label>
              <select
                className="glass-input w-full p-2 text-sm bg-[#080d16] text-text-primary"
                value={newProjId}
                onChange={(e) => setNewProjId(e.target.value)}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Priority
              </label>
              <select
                className="glass-input w-full p-2 text-sm bg-[#080d16] text-text-primary"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Task['priority'])}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
          <Input 
            label="Deadline Date"
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
          />
        </div>
      </Dialog>

      {/* Dialog for Editing Task */}
      <Dialog
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Modify Task Properties"
        footerActions={
          <>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveTask}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input 
            label="Task Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
              Task Description
            </label>
            <textarea
              className="glass-input w-full p-2 text-sm min-h-[80px]"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Project Link
              </label>
              <select
                className="glass-input w-full p-2 text-sm bg-[#080d16] text-text-primary"
                value={editProjId}
                onChange={(e) => setEditProjId(e.target.value)}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Priority
              </label>
              <select
                className="glass-input w-full p-2 text-sm bg-[#080d16] text-text-primary"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as Task['priority'])}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Status
              </label>
              <select
                className="glass-input w-full p-2 text-sm bg-[#080d16] text-text-primary"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as Task['status'])}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="DONE">Completed</option>
              </select>
            </div>
          </div>
          <Input 
            label="Deadline Date"
            type="date"
            value={editDeadline}
            onChange={(e) => setEditDeadline(e.target.value)}
          />
        </div>
      </Dialog>
    </div>
  );
}
