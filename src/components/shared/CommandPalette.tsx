'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  CheckSquare, 
  FolderKanban, 
  ArrowRight, 
  Plus, 
  Sparkles,
  Command,
  Layout,
  BarChart,
  Bot
} from 'lucide-react';
import { useNexusStore } from '@/store/nexusStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const tasks = useNexusStore((state) => state.tasks);
  const projects = useNexusStore((state) => state.projects);
  const addTask = useNexusStore((state) => state.addTask);
  const toggleTaskCompletion = useNexusStore((state) => state.toggleTaskCompletion);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle keyboard navigation inside list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  interface PaletteItem {
    type: string;
    title: string;
    subtitle?: string;
    icon: React.ComponentType<any>;
    action: () => void;
  }

  // Compile search list
  const navigationItems: PaletteItem[] = [
    { type: 'nav', title: 'Go to Command Center', icon: Layout, action: () => { router.push('/dashboard'); onClose(); } },
    { type: 'nav', title: 'Go to Task Hub', icon: CheckSquare, action: () => { router.push('/tasks'); onClose(); } },
    { type: 'nav', title: 'Go to Projects Hub', icon: FolderKanban, action: () => { router.push('/projects'); onClose(); } },
    { type: 'nav', title: 'Go to Smart Analytics', icon: BarChart, action: () => { router.push('/analytics'); onClose(); } },
    { type: 'nav', title: 'Go to AI Copilot', icon: Bot, action: () => { router.push('/copilot'); onClose(); } },
    { type: 'nav', title: 'Go to Workflows Canvas', icon: Command, action: () => { router.push('/workflows'); onClose(); } },
  ];

  const searchTasks: PaletteItem[] = tasks.map((t) => ({
    type: 'task',
    title: t.title,
    subtitle: `Project: ${projects.find((p) => p.id === t.projectId)?.name || 'Unknown'} • Status: ${t.status}`,
    icon: CheckSquare,
    action: () => {
      toggleTaskCompletion(t.id);
      onClose();
    }
  }));

  const searchProjects: PaletteItem[] = projects.map((p) => ({
    type: 'project',
    title: p.name,
    subtitle: `${p.description.slice(0, 45)}... • Progress: ${p.progress}%`,
    icon: FolderKanban,
    action: () => {
      router.push('/projects');
      onClose();
    }
  }));

  const createActions: PaletteItem[] = [
    {
      type: 'action',
      title: 'Create a quick task: "' + (query.trim() || 'New Task') + '"',
      icon: Plus,
      action: () => {
        const titleStr = query.trim() || 'New Task';
        addTask({
          title: titleStr,
          description: 'Created quickly via Command Console.',
          projectId: projects[0]?.id || 'proj-1',
          priority: 'MEDIUM',
          status: 'TODO',
          deadline: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0] // 3 days from now
        });
        onClose();
      }
    }
  ];

  const allItems: PaletteItem[] = [
    ...createActions,
    ...navigationItems,
    ...searchTasks,
    ...searchProjects
  ];

  const filteredItems = allItems.filter((item) => {
    if (!query) return item.type !== 'action'; // Only show navigation / existing tasks initially
    return item.title.toLowerCase().includes(query.toLowerCase()) || 
      (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()));
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onKeyDown={handleKeyDown}
            className="relative w-full max-w-xl overflow-hidden rounded-xl border border-white/10 bg-[#080d16] shadow-2xl z-10 glass-panel"
          >
            {/* Search Input Box */}
            <div className="flex items-center px-4 py-3 border-b border-white/5 gap-3.5">
              <Search className="w-5 h-5 text-accent-primary" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search tasks, navigate workspace, create new items..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-dim border-none ring-0 focus:ring-0"
              />
              <kbd className="hidden sm:inline-flex items-center bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-text-dim">
                ESC
              </kbd>
            </div>

            {/* List Results */}
            <div className="max-h-[350px] overflow-y-auto p-2 space-y-0.5">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      onClick={item.action}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-white/5 text-text-primary' 
                          : 'text-text-muted hover:text-text-primary hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-1.5 rounded-md ${
                          isSelected ? 'bg-accent-primary/10 text-accent-primary' : 'bg-white/5 text-text-dim'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-sm font-semibold">{item.title}</span>
                          {item.subtitle && (
                            <span className="block text-[10px] text-text-dim mt-0.5 font-medium">{item.subtitle}</span>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1.5 text-accent-secondary">
                          <span className="text-[10px] font-bold uppercase tracking-wider">Execute</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-text-muted">
                  <Sparkles className="w-8 h-8 text-text-dim mx-auto mb-2 animate-pulse" />
                  <p className="text-sm font-semibold">No results match your search query</p>
                  <p className="text-xs text-text-dim mt-0.5">Type something else to locate resources or create actions.</p>
                </div>
              )}
            </div>

            {/* Hint Footer */}
            <div className="flex justify-between items-center px-4 py-2 border-t border-white/5 bg-black/30 text-[10px] text-text-dim uppercase tracking-wider font-semibold">
              <div className="flex items-center gap-2">
                <span>↑↓ navigate</span>
                <span>•</span>
                <span>enter select</span>
              </div>
              <div>Nexus Cmd Palette v1.0</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
