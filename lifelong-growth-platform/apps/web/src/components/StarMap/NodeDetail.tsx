import React from 'react'
import { GraphNode, NodeStatus } from '@/types/graph'
import { getDomainColor, getDomainLabel, getNodeStroke } from '@/utils/nodeColor'
import { NODE_STATUS_CONFIG } from '@lifelong/constants'
import Button from '@/components/Common/Button'

interface NodeDetailProps {
  node: GraphNode
  onClose: () => void
  onStartLearning?: (node: GraphNode) => void
  onMarkMastered?: (node: GraphNode) => void
}

const NodeDetail: React.FC<NodeDetailProps> = ({ node, onClose, onStartLearning, onMarkMastered }) => {
  const domainColor = getDomainColor(node.domain)
  const statusConfig = NODE_STATUS_CONFIG[node.status]

  return (
    <div className="flex flex-col h-full">
      {/* 标题栏 */}
      <div className="flex items-start justify-between p-4 border-b border-gray-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full" style={{ background: getNodeStroke(node.status) }} />
            <h2 className="text-white font-semibold text-lg">{node.label}</h2>
          </div>
          {node.subLabel && <p className="text-gray-400 text-sm">{node.subLabel}</p>}
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xl leading-none">×</button>
      </div>

      {/* 星域标签 + 状态 */}
      <div className="flex gap-2 px-4 pt-3">
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: domainColor + '22', color: domainColor }}>
          {getDomainLabel(node.domain)}
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
          {statusConfig.label}
        </span>
      </div>

      {/* 描述 */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <p className="text-gray-300 text-sm leading-relaxed">{node.description}</p>

        {/* 前置依赖 */}
        {node.prerequisites.length > 0 && (
          <div className="mt-4">
            <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">前置依赖</h3>
            <div className="flex flex-wrap gap-1">
              {node.prerequisites.map((id) => (
                <span key={id} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                  {id}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 证书 */}
        {node.certifications.length > 0 && (
          <div className="mt-4">
            <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">关联证书</h3>
            <div className="flex flex-wrap gap-1">
              {node.certifications.map((cert) => (
                <span key={cert} className="text-xs bg-yellow-900/40 text-yellow-400 px-2 py-1 rounded">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="p-4 border-t border-gray-700 flex gap-2">
        {node.status === NodeStatus.DISCOVERED && (
          <Button variant="primary" size="sm" onClick={() => onStartLearning?.(node)} className="flex-1">
            开始学习
          </Button>
        )}
        {node.status === NodeStatus.LEARNING && (
          <Button variant="success" size="sm" onClick={() => onMarkMastered?.(node)} className="flex-1">
            标记已掌握
          </Button>
        )}
        {node.status === NodeStatus.LOCKED && (
          <p className="text-gray-500 text-xs text-center flex-1 self-center">完成前置学习后解锁</p>
        )}
      </div>
    </div>
  )
}

export default NodeDetail
