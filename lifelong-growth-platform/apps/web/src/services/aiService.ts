import api from './api'
import { SendMessagePayload, LearningPathRecommendation } from '@/types/ai'

export const aiService = {
  // 流式对话（SSE）
  async streamChat(
    payload: SendMessagePayload,
    onDelta: (delta: string) => void,
    onDone: () => void,
  ): Promise<void> {
    const response = await fetch('/api/ai/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('lgp-user') || '{}')?.state?.token || ''}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.body) throw new Error('响应体为空')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value)
      const lines = text.split('\n').filter((l) => l.startsWith('data: '))
      for (const line of lines) {
        const data = line.slice(6)
        if (data === '[DONE]') { onDone(); return }
        try {
          const chunk = JSON.parse(data)
          if (chunk.delta) onDelta(chunk.delta)
        } catch { /* 忽略解析错误 */ }
      }
    }
    onDone()
  },

  async getLearningPathRecommendation(targetNodeId: string): Promise<LearningPathRecommendation> {
    const res = await api.post<LearningPathRecommendation>('/ai/learning-path', { targetNodeId })
    return res.data
  },
}
