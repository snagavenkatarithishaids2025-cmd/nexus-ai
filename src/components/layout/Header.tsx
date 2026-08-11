'use client';

import React from 'react';

export function Header({ onOpenPalette }: { onOpenPalette: () => void }) {
  return (
    <header className="sticky top-0 z-50 bg-[#F5F2EB]/90 backdrop-blur-md border-b border-[#E5E0D8] px-6 py-4 flex items-center justify-between">
      {/* Brand Logo & Motto */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#004434] flex items-center justify-center text-white font-heading font-bold text-xl">
          N
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-[#1C1917] leading-none">NEXUS</h1>
          <p className="font-body text-xs text-[#1C1917]/60">Your Intelligent Command Center</p>
        </div>
      </div>

      {/* Smooth Scroll Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 font-body text-sm font-medium text-[#1C1917]">
        <a href="#hero" className="hover:text-[#004434] transition-colors">Home</a>
        <a href="#dashboard" className="hover:text-[#004434] transition-colors">Dashboard</a>
        <a href="#tasks" className="hover:text-[#004434] transition-colors">Tasks</a>
        <a href="#projects" className="hover:text-[#004434] transition-colors">Projects</a>
        <a href="#analytics" className="hover:text-[#004434] transition-colors">Analytics</a>
        <a href="#workflows" className="hover:text-[#004434] transition-colors">Workflows</a>
      </nav>

      {/* Actions */}
      <button
        onClick={onOpenPalette}
        className="px-4 py-2 rounded-xl bg-[#EAE5D9] text-[#1C1917] text-xs font-semibold hover:bg-[#004434] hover:text-white transition-all"
      >
        Search (⌘K)
      </button>
    </header>
  );
}