import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  deadline: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  deadline: string;
  progress: number; // Calculated dynamically
  health: 'STABLE' | 'WARNING' | 'CRITICAL';
}

export interface Activity {
  id: string;
  text: string;
  timestamp: string;
  type: 'task' | 'project' | 'workflow' | 'system';
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string; status?: string; icon?: string; description?: string; [key: string]: any };
  selected?: boolean;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

interface NexusState {
  tasks: Task[];
  projects: Project[];
  activities: Activity[];
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  productivityScore: number;
  
  // Tasks Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  
  // Projects Actions
  addProject: (project: Omit<Project, 'id' | 'progress' | 'health'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Workflow Actions
  setNodes: (nodes: WorkflowNode[] | ((nodes: WorkflowNode[]) => WorkflowNode[])) => void;
  setEdges: (edges: WorkflowEdge[] | ((edges: WorkflowEdge[]) => WorkflowEdge[])) => void;
  loadWorkflowPreset: (presetName: string) => void;
  
  // Activity Actions
  addActivity: (text: string, type: Activity['type']) => void;
  
  // Recalculations
  recalculateMetrics: () => void;
}

const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Aether Core',
    description: 'Next-gen distributed ingestion engine using modern streams.',
    priority: 'HIGH',
    status: 'ACTIVE',
    deadline: '2026-09-15',
    progress: 50,
    health: 'STABLE'
  },
  {
    id: 'proj-2',
    name: 'Helios UI',
    description: 'Dynamic telemetry dashboard featuring responsive glassmorphic cards.',
    priority: 'URGENT',
    status: 'ACTIVE',
    deadline: '2026-08-25',
    progress: 60,
    health: 'WARNING'
  },
  {
    id: 'proj-3',
    name: 'Krypton Auth',
    description: 'Biometric and passwordless single-sign-on microservice.',
    priority: 'MEDIUM',
    status: 'ACTIVE',
    deadline: '2026-10-01',
    progress: 100,
    health: 'STABLE'
  }
];

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Optimize partition indexing',
    description: 'Speed up retrieval rates inside the ingestion cache layer.',
    projectId: 'proj-1',
    priority: 'HIGH',
    status: 'DONE',
    deadline: '2026-08-12',
    createdAt: '2026-08-01'
  },
  {
    id: 'task-2',
    title: 'Refactor state stream hook',
    description: 'Migrate React context state managers to reactive state hooks.',
    projectId: 'proj-1',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    deadline: '2026-08-18',
    createdAt: '2026-08-02'
  },
  {
    id: 'task-3',
    title: 'Design glassmorphic control hub',
    description: 'Add translucent shadows and CSS blur animations to panel grids.',
    projectId: 'proj-2',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    deadline: '2026-08-14',
    createdAt: '2026-08-03'
  },
  {
    id: 'task-4',
    title: 'Implement WebAuthn credentials registration',
    description: 'Store public keys in PostgreSQL security metadata schema.',
    projectId: 'proj-3',
    priority: 'HIGH',
    status: 'DONE',
    deadline: '2026-08-08',
    createdAt: '2026-08-04'
  },
  {
    id: 'task-5',
    title: 'Create connection hook for node canvas',
    description: 'Render SVG Bezier curves with animated dashes inside flow builder.',
    projectId: 'proj-2',
    priority: 'MEDIUM',
    status: 'DONE',
    deadline: '2026-08-05',
    createdAt: '2026-08-05'
  },
  {
    id: 'task-6',
    title: 'Test cross-domain auth tokens',
    description: 'Ensure cookie policies permit secure sub-domain validation.',
    projectId: 'proj-3',
    priority: 'MEDIUM',
    status: 'DONE',
    deadline: '2026-08-10',
    createdAt: '2026-08-06'
  }
];

const initialActivities: Activity[] = [
  { id: 'act-1', text: 'Completed task: "Test cross-domain auth tokens"', timestamp: '2026-08-10T11:20:00Z', type: 'task' },
  { id: 'act-2', text: 'Workflow builder preset "Slack Alert" loaded', timestamp: '2026-08-10T10:45:00Z', type: 'workflow' },
  { id: 'act-3', text: 'Project "Helios UI" priority updated to URGENT', timestamp: '2026-08-09T16:30:00Z', type: 'project' },
  { id: 'act-4', text: 'Created new task "Optimize partition indexing"', timestamp: '2026-08-08T09:15:00Z', type: 'task' }
];

const presetWorkflows: Record<string, { nodes: WorkflowNode[], edges: WorkflowEdge[] }> = {
  automation: {
    nodes: [
      { id: '1', type: 'triggerNode', position: { x: 50, y: 150 }, data: { label: 'New Task Created', icon: 'PlusCircle', description: 'Triggers when a task enters TODO state' } },
      { id: '2', type: 'aiNode', position: { x: 280, y: 150 }, data: { label: 'AI Priority Analysis', icon: 'BrainCircuit', description: 'Classifies task intent & details' } },
      { id: '3', type: 'conditionNode', position: { x: 520, y: 120 }, data: { label: 'Priority is HIGH?', icon: 'GitBranch', description: 'Checks if urgency class is HIGH' } },
      { id: '4', type: 'actionNode', position: { x: 780, y: 50 }, data: { label: 'Add to Focus List', icon: 'Zap', description: 'Moves task into today\'s agenda' } },
      { id: '5', type: 'notificationNode', position: { x: 1020, y: 150 }, data: { label: 'Send Push Notification', icon: 'Bell', description: 'Dispatches Slack and web alert' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e2-3', source: '2', target: '3', animated: true },
      { id: 'e3-4', source: '3', target: '4', animated: true },
      { id: 'e4-5', source: '4', target: '5', animated: true }
    ]
  },
  aiRouter: {
    nodes: [
      { id: '1', type: 'triggerNode', position: { x: 50, y: 150 }, data: { label: 'GitHub Commit Hook', icon: 'Github', description: 'Triggers on code push to main branch' } },
      { id: '2', type: 'aiNode', position: { x: 280, y: 150 }, data: { label: 'AI Code Reviewer', icon: 'BrainCircuit', description: 'Evaluates changes for bugs & safety' } },
      { id: '3', type: 'conditionNode', position: { x: 520, y: 120 }, data: { label: 'No security issues?', icon: 'ShieldAlert', description: 'Checks security flags' } },
      { id: '4', type: 'actionNode', position: { x: 780, y: 50 }, data: { label: 'Trigger Vercel Deploy', icon: 'ArrowUpRight', description: 'Initiates target deployment' } },
      { id: '5', type: 'notificationNode', position: { x: 780, y: 250 }, data: { label: 'Slack Warning Alert', icon: 'Slack', description: 'Notifies developer team' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e2-3', source: '2', target: '3', animated: true },
      { id: 'e3-4', source: '3', target: '4', animated: true },
      { id: 'e3-5', source: '3', target: '5', animated: true }
    ]
  }
};

export const useNexusStore = create<NexusState>((set, get) => ({
  tasks: initialTasks,
  projects: initialProjects,
  activities: initialActivities,
  nodes: presetWorkflows.automation.nodes,
  edges: presetWorkflows.automation.edges,
  productivityScore: 78,

  addTask: (taskData) => {
    const id = `task-${Date.now()}`;
    const newTask: Task = {
      ...taskData,
      id,
      createdAt: new Date().toISOString()
    };
    set((state) => ({
      tasks: [newTask, ...state.tasks]
    }));
    get().addActivity(`Created task: "${newTask.title}"`, 'task');
    get().recalculateMetrics();
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
    }));
    get().recalculateMetrics();
  },

  deleteTask: (id) => {
    const task = get().tasks.find((t) => t.id === id);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id)
    }));
    if (task) {
      get().addActivity(`Deleted task: "${task.title}"`, 'task');
    }
    get().recalculateMetrics();
  },

  toggleTaskCompletion: (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    }));

    const activityText = newStatus === 'DONE' 
      ? `Completed task: "${task.title}"`
      : `Reopened task: "${task.title}"`;
    get().addActivity(activityText, 'task');
    get().recalculateMetrics();
  },

  addProject: (projectData) => {
    const id = `proj-${Date.now()}`;
    const newProject: Project = {
      ...projectData,
      id,
      progress: 0,
      health: 'STABLE'
    };
    set((state) => ({
      projects: [...state.projects, newProject]
    }));
    get().addActivity(`Created project: "${newProject.name}"`, 'project');
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p))
    }));
  },

  deleteProject: (id) => {
    const project = get().projects.find((p) => p.id === id);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      tasks: state.tasks.filter((t) => t.projectId !== id)
    }));
    if (project) {
      get().addActivity(`Archived project: "${project.name}"`, 'project');
    }
    get().recalculateMetrics();
  },

  setNodes: (newNodes) => {
    set((state) => ({
      nodes: typeof newNodes === 'function' ? newNodes(state.nodes) : newNodes
    }));
  },

  setEdges: (newEdges) => {
    set((state) => ({
      edges: typeof newEdges === 'function' ? newEdges(state.edges) : newEdges
    }));
  },

  loadWorkflowPreset: (presetName) => {
    const preset = presetWorkflows[presetName];
    if (preset) {
      set({
        nodes: preset.nodes,
        edges: preset.edges
      });
      get().addActivity(`Loaded workflow preset: "${presetName}"`, 'workflow');
    }
  },

  addActivity: (text, type) => {
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      text,
      timestamp: new Date().toISOString(),
      type
    };
    set((state) => ({
      activities: [newActivity, ...state.activities.slice(0, 19)] // Keep latest 20
    }));
  },

  recalculateMetrics: () => {
    const { tasks, projects } = get();
    
    // 1. Recalculate Project progress and health
    const updatedProjects = projects.map((proj) => {
      const projTasks = tasks.filter((t) => t.projectId === proj.id);
      if (projTasks.length === 0) {
        return { ...proj, progress: 0, health: 'STABLE' as const };
      }
      const completedCount = projTasks.filter((t) => t.status === 'DONE').length;
      const progress = Math.round((completedCount / projTasks.length) * 100);
      
      // Determine health
      // If there are overdue or urgent task items pending, warn the user
      const hasUrgentTodo = projTasks.some((t) => t.priority === 'URGENT' && t.status !== 'DONE');
      const health = hasUrgentTodo ? ('WARNING' as const) : ('STABLE' as const);

      return { ...proj, progress, health };
    });

    // 2. Recalculate Productivity Score
    // Formula: (Done Tasks / Total Tasks) * 80 + (High/Urgent Done weight) * 20
    const totalTasks = tasks.length;
    let newScore = 75; // Default fallback base
    if (totalTasks > 0) {
      const doneTasks = tasks.filter((t) => t.status === 'DONE');
      const baseRatio = doneTasks.length / totalTasks;
      
      const urgentHighTasks = tasks.filter((t) => t.priority === 'HIGH' || t.priority === 'URGENT');
      const urgentHighDone = urgentHighTasks.filter((t) => t.status === 'DONE');
      const weightRatio = urgentHighTasks.length > 0 ? (urgentHighDone.length / urgentHighTasks.length) : baseRatio;

      newScore = Math.round((baseRatio * 75) + (weightRatio * 25));
      newScore = Math.max(10, Math.min(newScore, 100)); // Constraint between 10 and 100
    }

    set({
      projects: updatedProjects,
      productivityScore: newScore
    });
  }
}));
