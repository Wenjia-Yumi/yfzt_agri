import { NodeStatus, KnowledgeDomain } from '@/types/graph'
import { NODE_STATUS_CONFIG, DOMAIN_CONFIG } from '@lifelong/constants'

export function getNodeFill(status: NodeStatus): string {
  return NODE_STATUS_CONFIG[status]?.fill ?? '#1a1f2e'
}

export function getNodeStroke(status: NodeStatus): string {
  return NODE_STATUS_CONFIG[status]?.stroke ?? '#2d3748'
}

export function getNodeGlowColor(status: NodeStatus): string {
  return NODE_STATUS_CONFIG[status]?.glowColor ?? 'transparent'
}

export function getNodeOpacity(status: NodeStatus): number {
  return NODE_STATUS_CONFIG[status]?.opacity ?? 0.5
}

export function getDomainColor(domain: KnowledgeDomain): string {
  return DOMAIN_CONFIG[domain]?.color ?? '#718096'
}

export function getDomainLabel(domain: KnowledgeDomain): string {
  return DOMAIN_CONFIG[domain]?.label ?? domain
}
