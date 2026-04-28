// 前端知识图谱类型（从 @lifelong/types 扩展）
export { NodeStatus, KnowledgeDomain } from '@lifelong/types'
export type {
  GraphNode,
  GraphEdge,
  KnowledgeGraph,
  KnowledgeGraphMetadata,
  UserNodeProgress,
} from '@lifelong/types'

// 前端专属扩展类型

export interface GraphFilter {
  domain?: import('@lifelong/types').KnowledgeDomain
  status?: import('@lifelong/types').NodeStatus
  searchKeyword?: string
}

export interface D3SimNode extends import('@lifelong/types').GraphNode {
  x: number
  y: number
  vx: number
  vy: number
  fx: number | null
  fy: number | null
  index: number
}

export interface D3SimEdge {
  source: D3SimNode
  target: D3SimNode
  weight?: number
  index?: number
}
