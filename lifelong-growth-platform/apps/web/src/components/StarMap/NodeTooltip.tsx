import React from 'react'
import { GraphNode } from '@/types/graph'
import { getDomainColor, getDomainLabel, getNodeStroke } from '@/utils/nodeColor'
import { NODE_STATUS_CONFIG } from '@lifelong/constants'

interface NodeTooltipProps {
  node: GraphNode
  x: number
  y: number
}

const NodeTooltip: React.FC<NodeTooltipProps> = ({ node, x, y }) => {
  const statusConfig = NODE_STATUS_CONFIG[node.status]

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{ left: x + 16, top: y - 8 }}
    >
      <div className="bg-gray-900 border rounded-lg p-3 shadow-xl max-w-xs"
        style={{ borderColor: getDomainColor(node.domain) + '66' }}>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: getNodeStroke(node.status) }}
          />
          <span className="text-white text-sm font-medium">{node.label}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-1.5 py-0.5 rounded"
            style={{ background: getDomainColor(node.domain) + '33', color: getDomainColor(node.domain) }}>
            {getDomainLabel(node.domain)}
          </span>
          <span className="text-xs text-gray-400">{statusConfig.label}</span>
        </div>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{node.description}</p>
      </div>
    </div>
  )
}

export default NodeTooltip
