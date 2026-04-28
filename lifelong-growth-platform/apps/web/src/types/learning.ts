import { NodeStatus } from '@lifelong/types'

export interface LearningRecord {
  id: string
  userId: string
  graphId: string
  nodeId: string
  status: NodeStatus
  startedAt?: string
  masteredAt?: string
  lastReviewedAt?: string
  score?: number
}

export interface LearningProgress {
  graphId: string
  totalNodes: number
  unlockedNodes: number
  learningNodes: number
  masteredNodes: number
  completionRate: number
  records: LearningRecord[]
}

export interface UpdateProgressPayload {
  nodeId: string
  status: NodeStatus
}
