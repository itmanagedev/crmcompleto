import { create } from 'zustand'
import { addDays, subDays, startOfDay, isBefore, isToday, isAfter } from 'date-fns'

export type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'whatsapp' | 'note'
export type ActivityStatus = 'todo' | 'in_progress' | 'waiting' | 'done'
export type ActivityPriority = 'high' | 'medium' | 'low'

export interface Activity {
  id: string
  title: string
  description?: string
  type: ActivityType
  status: ActivityStatus
  priority: ActivityPriority
  date: string // ISO string
  duration?: number // minutes
  contactId?: string
  contactName?: string
  companyId?: string
  companyName?: string
  dealId?: string
  dealTitle?: string
  owner: string
  reminder?: string
  recurrence?: string
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Ligar para confirmar proposta',
    type: 'call',
    status: 'todo',
    priority: 'high',
    date: new Date().toISOString(),
    duration: 15,
    contactName: 'Ana Silva',
    companyName: 'TechCorp Solutions',
    owner: 'João Silva',
  },
  {
    id: '2',
    title: 'Reunião de Alinhamento',
    type: 'meeting',
    status: 'in_progress',
    priority: 'medium',
    date: addDays(new Date(), 1).toISOString(),
    duration: 60,
    contactName: 'Pedro Gomes',
    companyName: 'TechCorp Solutions',
    owner: 'João Silva',
  },
  {
    id: '3',
    title: 'Enviar contrato revisado',
    type: 'email',
    status: 'todo',
    priority: 'high',
    date: subDays(new Date(), 1).toISOString(), // Overdue
    contactName: 'Mariana Costa',
    companyName: 'InovaTech',
    owner: 'João Silva',
  },
  {
    id: '4',
    title: 'Acompanhar status do projeto',
    type: 'whatsapp',
    status: 'waiting',
    priority: 'low',
    date: new Date().toISOString(),
    contactName: 'Roberto Alves',
    companyName: 'Global Corp',
    owner: 'João Silva',
  },
]

interface ActivitiesState {
  activities: Activity[]
  isModalOpen: boolean
  editingActivity: Activity | null
  openModal: (activity?: Activity) => void
  closeModal: () => void
  addActivity: (activity: Omit<Activity, 'id'>) => void
  updateActivity: (id: string, activity: Partial<Activity>) => void
  deleteActivity: (id: string) => void
  getOverdueCount: () => number
  getTodayActivities: () => Activity[]
}

export const useActivitiesStore = create<ActivitiesState>((set, get) => ({
  activities: MOCK_ACTIVITIES,
  isModalOpen: false,
  editingActivity: null,
  
  openModal: (activity) => set({ isModalOpen: true, editingActivity: activity || null }),
  closeModal: () => set({ isModalOpen: false, editingActivity: null }),
  
  addActivity: (activity) => set((state) => ({
    activities: [...state.activities, { ...activity, id: Math.random().toString(36).substr(2, 9) }]
  })),
  
  updateActivity: (id, updatedFields) => set((state) => ({
    activities: state.activities.map(a => a.id === id ? { ...a, ...updatedFields } : a)
  })),
  
  deleteActivity: (id) => set((state) => ({
    activities: state.activities.filter(a => a.id !== id)
  })),
  
  getOverdueCount: () => {
    const { activities } = get()
    const now = new Date()
    return activities.filter(a => a.status !== 'done' && isBefore(new Date(a.date), now) && !isToday(new Date(a.date))).length
  },
  
  getTodayActivities: () => {
    const { activities } = get()
    return activities.filter(a => isToday(new Date(a.date)))
  }
}))
