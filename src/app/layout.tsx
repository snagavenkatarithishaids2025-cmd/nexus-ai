import React from 'react';
import { AppShell } from '@/components/layout/AppShell'; // Handles client state for palette
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-screen bg-[#F5F2EB] text-[#1C1917] font-body">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}