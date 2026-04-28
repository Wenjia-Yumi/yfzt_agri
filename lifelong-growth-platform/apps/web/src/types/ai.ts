export type MessageRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  createdAt: string
}

export interface ChatSession {
  id: string
  userId: string
  messages: ChatMessage[]
  createdAt: string
}

export interface SendMessagePayload {
  content: string
  sessionId?: string
}

export interface AIStreamChunk {
  delta: string
  done: boolean
}

export interface LearningPathRecommendation {
  targetNodeId: string
  recommendedPath: string[]
  estimatedHours: number
  reasoning: string
}
