import React, { useState, useCallback } from 'react'
import StarMapCanvas from '@/components/StarMap/StarMapCanvas'
import NodeDetail from '@/components/StarMap/NodeDetail'
import FilterBar from '@/components/StarMap/FilterBar'
import AIChatPanel from '@/components/AI/AIChatPanel'
import AIFloatingButton from '@/components/AI/AIFloatingButton'
import Loading from '@/components/Common/Loading'
import { useStarMap } from '@/hooks/useStarMap'
import { GraphNode, NodeStatus } from '@/types/graph'
import { starMapService } from '@/services/starMapService'
import { calcCompletionRate } from '@/utils/graphLayout'

const StarMapPage: React.FC = () => {
  const {
    nodes,
    edges,
    filteredNodes,
    selectedNode,
    filterDomain,
    isLoading,
    error,
    selectNode,
    updateNodeStatus,
    setFilterDomain,
  } = useStarMap()

  const [canvasSize] = useState({ width: window.innerWidth - 320, height: window.innerHeight - 120 })

  const handleNodeClick = useCallback((node: GraphNode) => {
    selectNode(node)
  }, [selectNode])

  const handleStartLearning = async (node: GraphNode) => {
    await starMapService.updateNodeStatus(node.id, NodeStatus.LEARNING)
    updateNodeStatus(node.id, NodeStatus.LEARNING)
  }

  const handleMarkMastered = async (node: GraphNode) => {
    await starMapService.updateNodeStatus(node.id, NodeStatus.MASTERED)
    updateNodeStatus(node.id, NodeStatus.MASTERED)
  }

  if (isLoading) return <Loading text="加载知识星图..." />
  if (error) return <div className="flex items-center justify-center h-screen text-red-400">{error}</div>

  const completion = calcCompletionRate(nodes)

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-white font-bold text-lg">🌌 知识星图</h1>
          <span className="text-gray-400 text-sm">{nodes.length} 个知识节点</span>
          <div className="flex items-center gap-1.5">
            <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${completion}%` }} />
            </div>
            <span className="text-gray-400 text-xs">{completion}%</span>
          </div>
        </div>
        <FilterBar activeDomain={filterDomain} onDomainChange={setFilterDomain} />
      </div>

      {/* 主体区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 星图画布 */}
        <div className="flex-1 relative">
          <StarMapCanvas
            nodes={filteredNodes}
            edges={edges}
            onNodeClick={handleNodeClick}
            selectedNodeId={selectedNode?.id}
            width={canvasSize.width}
            height={canvasSize.height}
          />
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-600 text-xs pointer-events-none">
            双击重置视图 · 滚轮缩放 · 拖拽节点调整布局
          </p>
        </div>

        {/* 右侧节点详情面板 */}
        {selectedNode && (
          <div className="w-80 border-l border-gray-800 bg-gray-900/80 backdrop-blur-sm">
            <NodeDetail
              node={selectedNode}
              onClose={() => selectNode(null)}
              onStartLearning={handleStartLearning}
              onMarkMastered={handleMarkMastered}
            />
          </div>
        )}
      </div>

      <AIChatPanel />
      <AIFloatingButton />
    </div>
  )
}

export default StarMapPage
