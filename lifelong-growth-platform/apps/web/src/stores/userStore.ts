import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/user'

interface UserState {
  user: User | null
  token: string | null
  isAuthenticated: boolean

  setUser: (user: User, token: string) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user, token) => set({ user, token, isAuthenticated: true }),
      clearUser: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'lgp-user' },
  ),
)
