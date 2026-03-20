import { create } from 'zustand'

interface AppState {
  user: null | { name: string; role: string; avatar: string }
  setUser: (user: any) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    name: 'João Silva',
    role: 'Admin',
    avatar: 'https://github.com/shadcn.png'
  },
  setUser: (user) => set({ user }),
}))
