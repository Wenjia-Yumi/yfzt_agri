import { create } from 'zustand'
import { ChatMessage, ChatSession } from '@/types/ai'
import { generateId } from '@/utils/format'

interface AIState {
  session: ChatSession | null
  isChatOpen: boolean
  isStreaming: boolean

  openChat: () => void
  closeChat: () => void
  addMessage: (role: 'user' | 'assistant', content: string) => ChatMessage
  updateLastAssistantMessage: (delta: string) => void
  setStreaming: (v: boolean) => void
  clearSession: () => void
}

function createSession(): ChatSession {
  return {
    id: generateId(),
    userId: '',
    messages: [],
    createdAt: new Date().toISOString(),
  }
}

export const useAIStore = create<AIState>((set, get) => ({
  session: null,
  isChatOpen: false,
  isStreaming: false,

  openChat: () => {
    set((state) => ({
      isChatOpen: true,
      session: state.session ?? createSession(),
    }))
  },

  closeChat: () => set({ isChatOpen: false }),

  addMessage: (role, content) => {
    const msg: ChatMessage = {
      id: generateId(),
      role,
      content,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({
      session: state.session
        ? { ...state.session, messages: [...state.session.messages, msg] }
        : { ...createSession(), messages: [msg] },
    }))
    return msg
  },

  updateLastAssistantMessage: (delta) => {
    set((state) => {
      if (!state.session) return state
      const messages = [...state.session.messages]
      const last = messages[messages.length - 1]
      if (last?.role === 'assistant') {
        messages[messages.length - 1] = { ...last, content: last.content + delta }
      }
      return { session: { ...state.session, messages } }
    })
  },

  setStreaming: (v) => set({ isStreaming: v }),

  clearSession: () => set({ session: createSession() }),
}))
