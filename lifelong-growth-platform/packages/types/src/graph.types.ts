// 知识图谱核心类型定义

export enum NodeStatus {
  LOCKED = 'LOCKED',                           // 锁定：前置条件未满足
  DISCOVERED = 'DISCOVERED',                   // 已解锁：可以开始学习
  LEARNING = 'LEARNING',                       // 学习中：正在进行
  MASTERED = 'MASTERED',                       // 已掌握：完成学习
  ENTERPRISE_CERTIFIED = 'ENTERPRISE_CERTIFIED', // 企业认证：已获得企业背书
  DECAYING = 'DECAYING',                       // 衰退中：长期未复习，知识遗忘风险
  BRIDGE = 'BRIDGE',                           // 桥接节点：跨学科连接点
}

export enum KnowledgeDomain {
  TRADE = 'TRADE',           // 贸易基础星域
  PLATFORM = 'PLATFORM',     // 平台运营星域
  MARKETING = 'MARKETING',   // 流量营销星域
  SUPPLY = 'SUPPLY',         // 供应链管理星域
  FINANCE = 'FINANCE',       // 金融合规星域
  DATA = 'DATA',             // 数据智能星域
  CROSS = 'CROSS',           // 跨学科桥接星域
  CORE = 'CORE',             // 核心枢纽（特殊标记）
}

export interface GraphNode {
  id: string
  label: string
  description: string
  domain: KnowledgeDomain
  status: NodeStatus
  x?: number
  y?: number
  radius?: number
  prerequisites: string[]
  certifications: string[]
  subLabel?: string
  // 力导向图运行时属性（D3 内部使用）
  fx?: number | null
  fy?: number | null
  vx?: number
  vy?: number
  index?: number
}

export interface GraphEdge {
  source: string | GraphNode
  target: string | GraphNode
  weight?: number
}

export interface KnowledgeGraphMetadata {
  totalNodes: number
  totalEdges: number
  domains: KnowledgeDomain[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedHours: number
  targetAudience: string
}

export interface KnowledgeGraph {
  id: string
  name: string
  version: string
  description: string
  nodes: GraphNode[]
  edges: GraphEdge[]
  metadata: KnowledgeGraphMetadata
}

export interface UserNodeProgress {
  nodeId: string
  userId: string
  status: NodeStatus
  startedAt?: Date
  masteredAt?: Date
  lastReviewedAt?: Date
  score?: number
}
