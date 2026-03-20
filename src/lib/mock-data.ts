export const kpiData = {
  openDeals: {
    value: 142,
    trend: 12.5,
    history: [40, 45, 55, 60, 80, 110, 142],
  },
  expectedRevenue: {
    value: 845000,
    trend: 8.2,
    history: [300000, 450000, 400000, 600000, 750000, 800000, 845000],
  },
  conversionRate: {
    value: 24.8,
    trend: -2.1,
    history: [20, 22, 25, 28, 26, 25, 24.8],
  },
  pendingActivities: {
    value: 38,
    trend: 15.0,
    history: [10, 15, 20, 25, 30, 35, 38],
  },
}

export const pipelineData = [
  { stage: 'Prospecção', deals: 45, value: 120000 },
  { stage: 'Qualificação', deals: 32, value: 250000 },
  { stage: 'Proposta', deals: 28, value: 380000 },
  { stage: 'Negociação', deals: 15, value: 450000 },
  { stage: 'Fechamento', deals: 8, value: 280000 },
]

export const revenueData = [
  { month: 'Out', revenue: 320000, target: 300000 },
  { month: 'Nov', revenue: 410000, target: 350000 },
  { month: 'Dez', revenue: 480000, target: 400000 },
  { month: 'Jan', revenue: 380000, target: 450000 },
  { month: 'Fev', revenue: 520000, target: 500000 },
  { month: 'Mar', revenue: 610000, target: 550000 },
]

export const dealsAtRisk = [
  {
    id: '1',
    company: 'TechCorp Solutions',
    dealName: 'Licenciamento Enterprise',
    value: 125000,
    daysIdle: 12,
    owner: 'Ana Silva',
    avatar: 'TS',
  },
  {
    id: '2',
    company: 'Global Industries',
    dealName: 'Consultoria de Implantação',
    value: 85000,
    daysIdle: 9,
    owner: 'Carlos Mendes',
    avatar: 'GI',
  },
  {
    id: '3',
    company: 'Inova Sistemas',
    dealName: 'Upgrade de Servidores',
    value: 45000,
    daysIdle: 15,
    owner: 'Mariana Costa',
    avatar: 'IS',
  },
  {
    id: '4',
    company: 'Alpha Finance',
    dealName: 'Auditoria de Segurança',
    value: 210000,
    daysIdle: 8,
    owner: 'Roberto Alves',
    avatar: 'AF',
  },
]

export const upcomingActivities = [
  {
    id: '1',
    time: '10:00',
    type: 'meeting',
    contact: 'João Pereira (TechCorp)',
    status: 'pending',
  },
  {
    id: '2',
    time: '11:30',
    type: 'call',
    contact: 'Maria Souza (Global Ind)',
    status: 'completed',
  },
  {
    id: '3',
    time: '14:00',
    type: 'email',
    contact: 'Pedro Santos (Inova)',
    status: 'pending',
  },
  {
    id: '4',
    time: '16:00',
    type: 'task',
    contact: 'Revisar proposta Alpha',
    status: 'pending',
  },
  {
    id: '5',
    time: '17:30',
    type: 'call',
    contact: 'Lucas Lima (Beta Corp)',
    status: 'pending',
  },
]

export const topReps = [
  {
    id: '1',
    name: 'Ana Silva',
    avatar: 'https://i.pravatar.cc/150?u=ana',
    deals: 18,
    revenue: 450000,
    progress: 95,
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    avatar: 'https://i.pravatar.cc/150?u=carlos',
    deals: 15,
    revenue: 380000,
    progress: 82,
  },
  {
    id: '3',
    name: 'Mariana Costa',
    avatar: 'https://i.pravatar.cc/150?u=mariana',
    deals: 12,
    revenue: 290000,
    progress: 65,
  },
  {
    id: '4',
    name: 'Roberto Alves',
    avatar: 'https://i.pravatar.cc/150?u=roberto',
    deals: 9,
    revenue: 210000,
    progress: 48,
  },
  {
    id: '5',
    name: 'Fernanda Lima',
    avatar: 'https://i.pravatar.cc/150?u=fernanda',
    deals: 7,
    revenue: 150000,
    progress: 35,
  },
]

export const latestProposals = [
  {
    id: '1',
    company: 'TechCorp Solutions',
    value: 125000,
    date: '2026-03-18',
    status: 'sent',
  },
  {
    id: '2',
    company: 'Global Industries',
    value: 85000,
    date: '2026-03-17',
    status: 'accepted',
  },
  {
    id: '3',
    company: 'Inova Sistemas',
    value: 45000,
    date: '2026-03-15',
    status: 'rejected',
  },
  {
    id: '4',
    company: 'Alpha Finance',
    value: 210000,
    date: '2026-03-14',
    status: 'draft',
  },
  {
    id: '5',
    company: 'Beta Corp',
    value: 65000,
    date: '2026-03-12',
    status: 'sent',
  },
]
