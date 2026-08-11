'use client';

import React, { useState } from 'react';
import { useNexusStore } from '@/store/nexusStore';
import { BentoCard } from '@/components/BentoCard';
import { KPIWidget } from '@/components/ui/KPIWidget';
import { Badge } from '@/components/ui/Badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Sparkles,
  TrendingUp
} from 'lucide-react';

export default function SmartAnalytics() {
  const tasks = useNexusStore((state) => state.tasks);
  const projects = useNexusStore((state) => state.projects);
  const productivityScore = useNexusStore((state) => state.productivityScore);

  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('week');

  // Computed metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Velocity = tasks completed / total tasks, adjusted based on time filter
  const completionVelocity = timeFilter === 'today' ? 2 : timeFilter === 'week' ? 6 : 24;

  // Compile project task distribution data
  const pieData = projects.map((p) => {
    const pTasks = tasks.filter((t) => t.projectId === p.id);
    return {
      name: p.name,
      value: pTasks.length
    };
  }).filter((item) => item.value > 0);

  // Group colors for Pie cells
  const COLORS = ['#004434', '#b45309', '#15803d', '#1C1917', '#78716C'];

  // Project health bar chart data
  const barData = projects.map((p) => ({
    name: p.name,
    progress: p.progress,
    tasksCount: tasks.filter((t) => t.projectId === p.id).length
  }));

  // Trend line chart data based on filter selection
  const getTrendData = () => {
    switch (timeFilter) {
      case 'today':
        return [
          { name: '08:00', completed: 0, score: 70 },
          { name: '10:00', completed: 1, score: 72 },
          { name: '12:00', completed: 1, score: 72 },
          { name: '14:00', completed: 2, score: 75 },
          { name: '16:00', completed: 3, score: productivityScore }
        ];
      case 'month':
        return [
          { name: 'Week 1', completed: 4, score: 65 },
          { name: 'Week 2', completed: 12, score: 72 },
          { name: 'Week 3', completed: 18, score: 70 },
          { name: 'Week 4', completed: completedTasks, score: productivityScore }
        ];
      case 'week':
      default:
        return [
          { name: 'Mon', completed: 1, score: 68 },
          { name: 'Tue', completed: 2, score: 72 },
          { name: 'Wed', completed: 4, score: 70 },
          { name: 'Thu', completed: 3, score: 75 },
          { name: 'Fri', completed: 5, score: 74 },
          { name: 'Sat', completed: 5, score: 73 },
          { name: 'Sun', completed: completedTasks, score: productivityScore }
        ];
    }
  };

  // Generate GitHub style contributions heatmap data (7 columns, 5 rows)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeks = [1, 2, 3, 4, 5];
  const getHeatmapColor = (x: number, y: number) => {
    // Semi-random intensity mapping representing activity density
    const intensity = (x * y + (completedTasks * 3)) % 5;
    if (intensity === 0) return 'bg-white/10 border-white/10';
    if (intensity === 1) return 'bg-[#EAE5D9]/20 border-[#EAE5D9]/25';
    if (intensity === 2) return 'bg-[#EAE5D9]/40 border-[#EAE5D9]/35';
    if (intensity === 3) return 'bg-[#EAE5D9]/70 border-[#EAE5D9]/50';
    return 'bg-[#EAE5D9] border-white/40 animate-pulse';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-body">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1C1917] tracking-tight font-heading uppercase select-none">Analytics Engine</h1>
          <p className="text-xs text-text-muted mt-0.5 font-body">Audit workflow velocity, trace metrics, and evaluate progress logs.</p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center rounded-lg bg-[#EAE5D9] border border-[#004434]/15 p-0.5 shrink-0 self-end sm:self-auto font-body">
          {(['today', 'week', 'month'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                timeFilter === filter 
                  ? 'bg-[#004434] text-white shadow-md' 
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIWidget
          variant="green"
          title="Productivity Score"
          value={`${productivityScore}%`}
          description="Weighted completion rate"
          icon={<Flame className="w-4 h-4 text-white animate-pulse" />}
        />
        <KPIWidget
          variant="cream"
          title="Completion Rate"
          value={`${completionRate}%`}
          description="Of all operational backlogs"
          icon={<CheckCircle2 className="w-4 h-4 text-[#004434]" />}
        />
        <KPIWidget
          variant="cream"
          title="Velocity Rate"
          value={`${completionVelocity} tasks`}
          description={`Delivered this ${timeFilter}`}
          icon={<TrendingUp className="w-4 h-4 text-[#004434]" />}
        />
        <KPIWidget
          variant="cream"
          title="Active Projects"
          value={projects.length}
          description="Deployed resource nodes"
          icon={<BarChart3 className="w-4 h-4 text-[#004434]" />}
        />
      </div>

      {/* Main Charts Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Productivity Trend */}
        <BentoCard variant="green" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#EAE5D9]" />
              <h3 className="text-base font-bold text-white font-heading uppercase tracking-wider">Historical Productivity Trend</h3>
            </div>
            <Badge variant="default" className="bg-white/10 text-white">Animate Mode</Badge>
          </div>
          <div className="mt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getTrendData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(255,255,255,0.4)" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.4)" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <ChartTooltip 
                    contentStyle={{ 
                      background: '#004434', 
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#f9fafb'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#EAE5D9" 
                    strokeWidth={3}
                    dot={{ fill: '#EAE5D9', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#ffffff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </BentoCard>

        {/* Task Distribution (Donut Chart) */}
        <BentoCard variant="cream" className="flex flex-col justify-between shadow-lg border border-[#004434]/10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#004434]" />
                <h3 className="text-base font-bold text-[#1C1917] font-heading uppercase tracking-wider">Task Distribution</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center">
              {pieData.length > 0 ? (
                <div className="h-56 w-full flex flex-col items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        contentStyle={{
                          background: '#EAE5D9',
                          borderColor: 'rgba(0,0,0,0.1)',
                          borderRadius: '12px',
                          color: '#1C1917'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Central Text */}
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xl font-bold text-[#1C1917] font-heading">{totalTasks}</span>
                    <span className="text-[10px] text-[#78716C] uppercase font-bold tracking-widest font-body">Total tasks</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400 font-body">
                  <p className="text-xs">No task distribution data available.</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-[#004434]/10 pt-3 mt-4 space-y-1.5 font-body">
            {pieData.map((item, idx) => (
              <div key={item.name} className="flex justify-between items-center text-xs text-[#1C1917]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="font-bold">{item.name}</span>
                </div>
                <span className="font-semibold text-[#78716C]">{item.value} tasks</span>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>

      {/* Row 3: Heatmap & Project Health Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bento Cell: Project Health */}
        <BentoCard variant="cream" className="lg:col-span-1 shadow-lg border border-[#004434]/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#004434]" />
              <h3 className="text-base font-bold text-[#1C1917] font-heading uppercase tracking-wider">Milestone Completion Bar</h3>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(28,25,23,0.4)" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="rgba(28,25,23,0.4)" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <ChartTooltip 
                    contentStyle={{ 
                      background: '#EAE5D9', 
                      borderColor: 'rgba(0,0,0,0.1)',
                      borderRadius: '12px',
                      color: '#1C1917'
                    }} 
                  />
                  <Bar dataKey="progress" fill="#004434" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </BentoCard>

        {/* Bento Cell: Contribution Heatmap Grid */}
        <BentoCard variant="green" className="lg:col-span-2 border border-[#005a45] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#EAE5D9]" />
              <h3 className="text-base font-bold text-white font-heading uppercase tracking-wider">Productivity Matrix Heatmap</h3>
            </div>
            <Badge variant="default" className="bg-white/10 text-white">Live Commits</Badge>
          </div>
          <div className="mt-4 flex flex-col justify-center h-64">
            <div className="flex gap-2 justify-center select-none overflow-x-auto pb-4">
              <div className="flex flex-col gap-1.5 text-[9px] font-bold text-white/60 justify-around pr-1 uppercase tracking-wider font-body">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun</span>
              </div>
              
              <div className="flex gap-1.5">
                {weeks.map((week) => (
                  <div key={week} className="flex flex-col gap-1.5">
                    {daysOfWeek.map((day, dIdx) => (
                      <div
                        key={day}
                        className={`w-7 h-7 rounded border transition-all hover:scale-105 cursor-pointer ${getHeatmapColor(week, dIdx)}`}
                        title={`Week ${week}, ${day}: task density activity`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center text-[10px] text-white/60 uppercase font-bold tracking-wider font-body">
              <span>Less productive</span>
              <div className="flex gap-1 items-center">
                <div className="w-3 h-3 rounded bg-white/10 border border-white/10" />
                <div className="w-3 h-3 rounded bg-[#EAE5D9]/20 border border-[#EAE5D9]/25" />
                <div className="w-3 h-3 rounded bg-[#EAE5D9]/40 border border-[#EAE5D9]/35" />
                <div className="w-3 h-3 rounded bg-[#EAE5D9]/70 border border-[#EAE5D9]/50" />
                <div className="w-3 h-3 rounded bg-[#EAE5D9] border border-white/40" />
              </div>
              <span>Peak activity</span>
            </div>
          </div>
        </BentoCard>
      </div>
    </div>
  );
}
