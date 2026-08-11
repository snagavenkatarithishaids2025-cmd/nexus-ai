'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useNexusStore } from '@/store/nexusStore';
import { BentoCard } from '@/components/BentoCard';
import { Button } from '@/components/ui/Button';
import { 
  Sparkles, 
  ArrowRight, 
  Play
} from 'lucide-react';

// Core Page Component Imports
import Dashboard from './dashboard/page';
import TaskHub from './tasks/page';
import ProjectHub from './projects/page';
import SmartAnalytics from './analytics/page';
import WorkflowBuilder from './workflows/page';

export default function Home() {
  const productivityScore = useNexusStore((state) => state.productivityScore);
  const tasks = useNexusStore((state) => state.tasks);
  const projects = useNexusStore((state) => state.projects);

  const pendingTasks = tasks.filter((t) => t.status !== 'DONE').length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;

  return (
    <div className="bg-[#F5F2EB] text-[#1C1917] min-h-screen font-body select-none">
      {/* 1. Hero Landing Section */}
      <section id="hero" className="scroll-mt-24 max-w-7xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        {/* Dynamic Status Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#004434]/5 border border-[#004434]/15 mb-6 shadow-sm font-body"
        >
          <Sparkles className="w-4 h-4 text-[#004434] animate-pulse" />
          <span className="text-xs font-bold text-[#004434] uppercase tracking-wider">NEXUS Core Platform Operational</span>
        </motion.div>

        {/* Cinematic Premium Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-[#1C1917] font-heading leading-tight max-w-4xl"
        >
          THE INTELLIGENT AI <span className="text-[#004434] select-all">COMMAND CENTER</span>
        </motion.h1>

        {/* Descriptive subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg text-[#44403C]/80 mt-6 max-w-2xl leading-relaxed"
        >
          Refactored into a unified single-page productivity environment. Smoothly scroll between layouts, orchestrate connections, view milestones, and analyze velocity metrics.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4 mt-8 justify-center"
        >
          <a href="#dashboard">
            <Button variant="primary" className="flex items-center gap-2 py-3 px-6 shadow-md rounded-xl text-sm">
              <span>Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
          <a href="#workflows">
            <Button variant="outline" className="flex items-center gap-2 py-3 px-6 border-[#E5E0D8] bg-[#EAE5D9] hover:bg-[#004434] hover:text-white transition-all rounded-xl text-sm text-[#1C1917]">
              <span>Configure Automation</span>
              <Play className="w-3.5 h-3.5" />
            </Button>
          </a>
        </motion.div>

        {/* Quick Bento Stats Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mt-16"
        >
          <BentoCard variant="cream" className="text-center p-6 border border-[#E5E0D8]">
            <span className="block text-[10px] uppercase font-bold text-[#78716C] tracking-widest">Productivity Integrity</span>
            <span className="block text-3xl font-bold text-[#004434] mt-2 font-heading">{productivityScore}%</span>
          </BentoCard>
          
          <BentoCard variant="cream" className="text-center p-6 border border-[#E5E0D8]">
            <span className="block text-[10px] uppercase font-bold text-[#78716C] tracking-widest">Active Milestones</span>
            <span className="block text-3xl font-bold text-[#1C1917] mt-2 font-heading">{projects.length}</span>
          </BentoCard>

          <BentoCard variant="cream" className="text-center p-6 border border-[#E5E0D8]">
            <span className="block text-[10px] uppercase font-bold text-[#78716C] tracking-widest">Pending Logs</span>
            <span className="block text-3xl font-bold text-[#1C1917] mt-2 font-heading">{pendingTasks}</span>
          </BentoCard>

          <BentoCard variant="cream" className="text-center p-6 border border-[#E5E0D8]">
            <span className="block text-[10px] uppercase font-bold text-[#78716C] tracking-widest">Resolved Logs</span>
            <span className="block text-3xl font-bold text-[#004434] mt-2 font-heading">{completedTasks}</span>
          </BentoCard>
        </motion.div>
      </section>

      {/* 2. Consolidated Smooth Scroll Sections */}
      <div className="max-w-7xl mx-auto px-6 space-y-24 pb-32">
        
        {/* Dashboard Section */}
        <section id="dashboard" className="scroll-mt-24 pt-16 border-t border-[#E5E0D8]">
          <Dashboard />
        </section>

        {/* Tasks Section */}
        <section id="tasks" className="scroll-mt-24 pt-16 border-t border-[#E5E0D8]">
          <TaskHub />
        </section>

        {/* Projects Section */}
        <section id="projects" className="scroll-mt-24 pt-16 border-t border-[#E5E0D8]">
          <ProjectHub />
        </section>

        {/* Analytics Section */}
        <section id="analytics" className="scroll-mt-24 pt-16 border-t border-[#E5E0D8]">
          <SmartAnalytics />
        </section>

        {/* Workflows Section */}
        <section id="workflows" className="scroll-mt-24 pt-16 border-t border-[#E5E0D8]">
          <WorkflowBuilder />
        </section>

      </div>
    </div>
  );
}