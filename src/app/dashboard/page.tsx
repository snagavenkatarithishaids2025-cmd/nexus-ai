'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useNexusStore } from '@/store/nexusStore';
import { Badge } from '@/components/ui/Badge';
import { BentoCard } from '@/components/BentoCard';
import { 
  Brain, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  FolderKanban, 
  CheckSquare, 
  TrendingUp,
  LayoutDashboard,
  GitFork,
  BarChart3,
  Mail,
  User,
  ShieldCheck
} from 'lucide-react';

export default function Dashboard() {
  const tasks = useNexusStore((state) => state.tasks);
  const projects = useNexusStore((state) => state.projects);
  const productivityScore = useNexusStore((state) => state.productivityScore);
  const toggleTaskCompletion = useNexusStore((state) => state.toggleTaskCompletion);

  // Stats calculation
  const activeProjectsCount = projects.filter((p) => p.status !== 'COMPLETED').length;
  const completedTasksCount = tasks.filter((t) => t.status === 'DONE').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'DONE');

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-body">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#004434]/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1C1917] font-heading uppercase select-none">
            Dashboard Terminal
          </h1>
          <p className="text-xs text-text-muted mt-1 uppercase font-semibold tracking-widest font-body">
            Core System Operational • Sector Green
          </p>
        </div>
      </div>

      {/* Modern Asymmetric Bento Grid System */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-auto">
        
        {/* Card 1: Hero Header Card (col-span-2 row-span-1, Green #004434) */}
        <motion.div whileHover={{ scale: 1.01 }} className="col-span-1 md:col-span-2">
          <BentoCard
            variant="green"
            className="h-full flex flex-col justify-between min-h-[220px] shadow-lg relative overflow-hidden group border border-[#005a45] p-8"
          >
            {/* Subtle background glow */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#EAE5D9]/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 w-fit text-[10px] uppercase font-bold tracking-widest text-[#EAE5D9] font-body">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Secure Command Node</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white leading-tight font-heading">
                Command Center
              </h2>
              <p className="text-sm text-white/80 max-w-md font-medium leading-relaxed font-body">
                Integrate triggers, consult neural LLM feedback pipelines, and synchronize task execution logs across sectors.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/copilot">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EAE5D9] hover:bg-[#EAE5D9]/90 text-[#004434] text-xs font-extrabold uppercase tracking-wider transition-all hover:translate-y-[-1px] shadow-md cursor-pointer select-none font-body">
                  <Brain className="w-3.5 h-3.5" />
                  <span>Consult Copilot</span>
                </span>
              </Link>
              <Link href="/workflows">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-[#EAE5D9] transition-colors p-2 cursor-pointer font-body">
                  <span>View Automation Engine</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </BentoCard>
        </motion.div>

        {/* Card 2: Profile / Specialist Card (col-span-1 row-span-2, Cream #EAE5D9) */}
        <motion.div whileHover={{ scale: 1.01 }} className="col-span-1 md:row-span-2">
          <BentoCard
            variant="cream"
            className="h-full flex flex-col justify-between min-h-[300px] shadow-lg border border-[#004434]/10 p-8"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <Badge variant="default" className="bg-[#004434] text-white hover:bg-[#004434]/90 text-[9px] font-body">
                  Specialist Profile
                </Badge>
                <div className="w-3 h-3 rounded-full bg-[#004434] animate-pulse" />
              </div>

              {/* Specialist Portrait placeholder with abstract geometric styling */}
              <div className="relative w-28 h-28 mx-auto rounded-full bg-[#004434]/5 border border-[#004434]/15 flex items-center justify-center overflow-hidden shadow-inner group">
                {/* Abstract avatar overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#004434]/20 to-[#EAE5D9]/10" />
                <User className="w-14 h-14 text-[#004434] opacity-80 group-hover:scale-105 transition-transform duration-300" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-[#1C1917] font-heading">Commander Specialist</h3>
                <p className="text-xs font-semibold text-[#004434] tracking-wider uppercase font-body">System Orchestrator</p>
              </div>
            </div>

            <div className="mt-8 border-t border-[#004434]/10 pt-4 space-y-3 text-xs font-body">
              <div className="flex justify-between items-center text-[10px] font-bold text-[#004434] uppercase tracking-wider">
                <span>Security Cleared</span>
                <ShieldCheck className="w-4 h-4 text-[#004434]" />
              </div>
              <div className="p-2.5 rounded-lg bg-[#004434]/5 text-[11px] font-semibold text-[#004434] leading-normal flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span className="truncate">specialist@nexus.ai</span>
              </div>
            </div>
          </BentoCard>
        </motion.div>

        {/* Card 3: KPI & Metrics Card (col-span-1 row-span-1, Green #004434) */}
        <motion.div whileHover={{ scale: 1.01 }} className="col-span-1">
          <BentoCard
            variant="green"
            className="h-full flex flex-col justify-between min-h-[220px] shadow-lg border border-[#005a45] relative overflow-hidden p-6"
          >
            <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-[#EAE5D9]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#EAE5D9] tracking-widest font-body">
                Performance Matrix
              </span>
              <TrendingUp className="w-4 h-4 text-[#EAE5D9]" />
            </div>

            <div className="my-3 space-y-1">
              <span className="block text-4xl font-bold tracking-tight text-white font-heading">
                {productivityScore}%
              </span>
              <span className="block text-[11px] font-semibold text-[#EAE5D9]/70 uppercase tracking-wider font-body">
                Productivity score
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-[#EAE5D9]/10 pt-3 text-xs font-body">
              <div>
                <span className="block font-bold text-[#EAE5D9] text-sm">{activeProjectsCount}</span>
                <span className="block text-[9px] text-[#EAE5D9]/60 uppercase font-semibold">Active Proj</span>
              </div>
              <div>
                <span className="block font-bold text-[#EAE5D9] text-sm">{completedTasksCount}</span>
                <span className="block text-[9px] text-[#EAE5D9]/60 uppercase font-semibold">Done Tasks</span>
              </div>
            </div>
          </BentoCard>
        </motion.div>

        {/* Card 4: Task Hub / Workspace Card (col-span-2 row-span-1, Cream #EAE5D9) */}
        <motion.div whileHover={{ scale: 1.01 }} className="col-span-1 md:col-span-2">
          <BentoCard
            variant="cream"
            className="h-full flex flex-col justify-between min-h-[260px] shadow-lg border border-[#004434]/10 p-8"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#004434]/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#004434]" />
                  <h3 className="text-base font-bold text-[#1C1917] font-heading uppercase tracking-wider">
                    Workspace backlogs
                  </h3>
                </div>
                <Badge className="bg-[#004434] text-white text-[9px] font-body">
                  {pendingTasks.length} Pending
                </Badge>
              </div>

              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {pendingTasks.length > 0 ? (
                  pendingTasks.slice(0, 3).map((task) => (
                    <div 
                      key={task.id}
                      className="p-3 rounded-xl bg-white hover:bg-[#EAE5D9]/50 transition-all flex items-center justify-between border border-[#004434]/5 group cursor-pointer"
                      onClick={() => toggleTaskCompletion(task.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0 font-body">
                        <div className="w-4 h-4 rounded-full border-2 border-[#004434]/30 flex items-center justify-center group-hover:border-[#004434] transition-all">
                          <div className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#004434] transition-all" />
                        </div>
                        <span className="text-xs font-bold text-[#1C1917] truncate max-w-[280px]">
                          {task.title}
                        </span>
                      </div>
                      <Badge variant={task.priority} className="text-[9px] font-body">
                        {task.priority}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs font-semibold text-[#004434]/50 font-body">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-1 text-[#004434]" />
                    <span>All tasks completed successfully</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-[#004434]/10 pt-4 mt-6 flex justify-end font-body">
              <Link href="/tasks">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#004434] hover:text-[#004434]/80 transition-colors uppercase tracking-wider cursor-pointer">
                  <span>Navigate Task Hub</span>
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </BentoCard>
        </motion.div>

        {/* Card 5: Social / Quick Actions Card (col-span-1 row-span-1, Green #004434) */}
        <motion.div whileHover={{ scale: 1.01 }} className="col-span-1">
          <BentoCard
            variant="green"
            className="h-full flex flex-col justify-between min-h-[260px] shadow-lg border border-[#005a45] relative overflow-hidden p-6"
          >
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#EAE5D9]/5 rounded-full blur-2xl pointer-events-none" />

            <span className="text-[10px] uppercase font-bold text-[#EAE5D9] tracking-widest block mb-2 font-body">
              Console Shortcuts
            </span>

            <div className="space-y-1.5 font-body">
              {[
                { name: 'Command Center', icon: LayoutDashboard, href: '/dashboard' },
                { name: 'Task Workspace', icon: CheckSquare, href: '/tasks' },
                { name: 'Project Milestones', icon: FolderKanban, href: '/projects' },
                { name: 'Smart Analytics', icon: BarChart3, href: '/analytics' },
                { name: 'Workflows Canvas', icon: GitFork, href: '/workflows' }
              ].map((route) => (
                <Link key={route.name} href={route.href}>
                  <span className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all cursor-pointer">
                    <route.icon className="w-3.5 h-3.5 text-[#EAE5D9]" />
                    <span>{route.name}</span>
                  </span>
                </Link>
              ))}
            </div>

            <div className="border-t border-white/10 pt-2 text-[9px] text-[#EAE5D9]/60 font-semibold uppercase tracking-wider text-center mt-3 font-body">
              Local vector nodes
            </div>
          </BentoCard>
        </motion.div>

        {/* Card 6: Proof / User Stats Card (col-span-1 row-span-1, Green #004434) */}
        <motion.div whileHover={{ scale: 1.01 }} className="col-span-1">
          <BentoCard
            variant="green"
            className="h-full flex flex-col justify-between min-h-[260px] shadow-lg border border-[#005a45] relative overflow-hidden p-6"
          >
            <div className="absolute -left-6 -top-6 w-20 h-20 bg-[#EAE5D9]/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <span className="text-[10px] uppercase font-bold text-[#EAE5D9] tracking-widest block font-body">
                Integrity Stats
              </span>

              {/* Avatar group stack */}
              <div className="flex items-center -space-x-2 mt-4 select-none font-body">
                <div className="w-7 h-7 rounded-full bg-[#EAE5D9] text-[#004434] flex items-center justify-center font-extrabold text-[10px] border-2 border-[#004434]">A</div>
                <div className="w-7 h-7 rounded-full bg-white text-[#004434] flex items-center justify-center font-extrabold text-[10px] border-2 border-[#004434]">B</div>
                <div className="w-7 h-7 rounded-full bg-[#EAE5D9]/60 text-white flex items-center justify-center font-extrabold text-[10px] border-2 border-[#004434]">C</div>
                <div className="w-7 h-7 rounded-full bg-white/20 text-[#EAE5D9] flex items-center justify-center font-extrabold text-[9px] border-2 border-[#004434]">+35</div>
              </div>
            </div>

            <div className="space-y-2 mt-4 font-body">
              <span className="block text-2xl font-bold text-[#EAE5D9] font-heading">35+</span>
              <p className="text-[11px] font-bold text-[#EAE5D9]/80 leading-relaxed uppercase tracking-wider">
                Active Workflows & Satisfied Clients
              </p>
            </div>

            <div className="border-t border-white/10 pt-2 text-[9px] text-[#EAE5D9]/60 font-semibold uppercase tracking-wider text-right font-body">
              Verified logs
            </div>
          </BentoCard>
        </motion.div>

      </div>
    </div>
  );
}
