import api from './api'
import { LearningProgress, UpdateProgressPayload } from '@/types/learning'

export const learningService = {
  async getProgress(graphId: string): Promise<LearningProgress> {
    const res = await api.get<LearningProgress>(`/learning/progress/${graphId}`)
    return res.data
  },

  async updateProgress(graphId: string, payload: UpdateProgressPayload): Promise<void> {
    await api.patch(`/learning/progress/${graphId}`, payload)
  },
}
