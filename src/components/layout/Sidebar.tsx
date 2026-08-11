'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban, 
  BarChart3, 
  BrainCircuit, 
  GitFork,
  Activity,
  Terminal
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const pathname = usePathname();

  const navigation = [
    { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Task Hub', href: '/tasks', icon: CheckSquare },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Smart Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'AI Copilot', href: '/copilot', icon: BrainCircuit },
    { name: 'Workflows', href: '/workflows', icon: GitFork },
  ];

  return (
    <aside className="w-64 border-r border-[#E5E0D8] bg-[#EAE5D9] flex flex-col h-screen sticky top-0 shrink-0 z-40 font-body">
      {/* Brand Logo */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-[#E5E0D8]">
        <div className="w-8 h-8 rounded-lg bg-[#004434] flex items-center justify-center shadow-sm">
          <Terminal className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <span className="font-extrabold text-sm tracking-widest text-[#1C1917] uppercase font-heading">
            NEXUS
          </span>
          <span className="block text-[9px] text-[#004434] uppercase font-bold tracking-wider">
            AI Platform
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-sm font-semibold transition-all relative overflow-hidden ${
                isActive 
                  ? 'text-white bg-[#004434]' 
                  : 'text-[#44403C] hover:text-[#1C1917] hover:bg-[#F5F2EB]'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 duration-200 ${
                isActive ? 'text-white' : 'text-[#78716C] group-hover:text-[#1C1917]'
              }`} />
              
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer info */}
      <div className="p-4 border-t border-[#E5E0D8] bg-[#F5F2EB]/50 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#15803d] animate-pulse" />
          <span className="text-[10px] uppercase font-bold text-[#78716C] tracking-widest">
            Core Engine Online
          </span>
        </div>
        <p className="text-[10px] text-[#A8A29E] leading-normal font-medium">
          v1.0.0-PROD • Secure Connection
        </p>
      </div>
    </aside>
  );
};
