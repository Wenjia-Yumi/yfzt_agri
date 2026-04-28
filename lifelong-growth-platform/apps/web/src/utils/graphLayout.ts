import { GraphNode, KnowledgeDomain } from '@/types/graph'

// 星域中心坐标（用于力导向图初始布局的参考锚点）
const DOMAIN_CENTER: Record<KnowledgeDomain, { x: number; y: number }> = {
  [KnowledgeDomain.CORE]: { x: 600, y: 400 },
  [KnowledgeDomain.TRADE]: { x: 250, y: 280 },
  [KnowledgeDomain.PLATFORM]: { x: 800, y: 250 },
  [KnowledgeDomain.MARKETING]: { x: 950, y: 420 },
  [KnowledgeDomain.SUPPLY]: { x: 380, y: 620 },
  [KnowledgeDomain.FINANCE]: { x: 130, y: 480 },
  [KnowledgeDomain.DATA]: { x: 760, y: 700 },
  [KnowledgeDomain.CROSS]: { x: 530, y: 150 },
}

export function getDomainCenter(domain: KnowledgeDomain): { x: number; y: number } {
  return DOMAIN_CENTER[domain] ?? { x: 600, y: 400 }
}

// 计算图谱节点完成率
export function calcCompletionRate(nodes: GraphNode[]): number {
  if (nodes.length === 0) return 0
  const done = nodes.filter(
    (n) => n.status === 'MASTERED' || n.status === 'ENTERPRISE_CERTIFIED',
  ).length
  return Math.round((done / nodes.length) * 100)
}

// 判断节点是否可以被解锁（所有前置节点已掌握）
export function canUnlockNode(node: GraphNode, allNodes: GraphNode[]): boolean {
  if (node.prerequisites.length === 0) return true
  const nodeMap = new Map(allNodes.map((n) => [n.id, n]))
  return node.prerequisites.every((prereqId) => {
    const prereq = nodeMap.get(prereqId)
    return prereq && (prereq.status === 'MASTERED' || prereq.status === 'ENTERPRISE_CERTIFIED')
  })
}
