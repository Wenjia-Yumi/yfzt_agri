import { create } from 'zustand'
import { LearningProgress, LearningRecord } from '@/types/learning'
import { learningService } from '@/services/learningService'

interface LearningState {
  progress: LearningProgress | null
  isLoading: boolean

  fetchProgress: (graphId: string) => Promise<void>
  updateRecord: (record: LearningRecord) => void
}

export const useLearningStore = create<LearningState>((set) => ({
  progress: null,
  isLoading: false,

  fetchProgress: async (graphId: string) => {
    set({ isLoading: true })
    try {
      const progress = await learningService.getProgress(graphId)
      set({ progress, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  updateRecord: (record) => {
    set((state) => {
      if (!state.progress) return state
      const records = state.progress.records.map((r) =>
        r.nodeId === record.nodeId ? record : r,
      )
      return { progress: { ...state.progress, records } }
    })
  },
}))
