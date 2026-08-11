'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/shared/CommandPalette';

export function AppShell({ children }: { children: React.ReactNode }) {
    const [paletteOpen, setPaletteOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setPaletteOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-[#F5F2EB] text-[#1C1917] font-body flex flex-col">
            {/* Sticky Top Header with Logo, Motto, Nav Links */}
            <Header onOpenPalette={() => setPaletteOpen(true)} />

            {/* Main Landing & Section Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Command Palette */}
            <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
        </div>
    );
}