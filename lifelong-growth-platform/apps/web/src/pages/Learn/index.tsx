import React from 'react'
import { useParams } from 'react-router-dom'
import { useStarMap } from '@/hooks/useStarMap'
import Loading from '@/components/Common/Loading'

const LearnPage: React.FC = () => {
  const { nodeId } = useParams<{ nodeId?: string }>()
  const { nodes, isLoading } = useStarMap()

  if (isLoading) return <Loading text="加载学习内容..." />

  const node = nodeId ? nodes.find((n) => n.id === nodeId) : null

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">📚 学习中心</h1>
      {node ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">{node.label}</h2>
          <p className="text-gray-300 leading-relaxed">{node.description}</p>
        </div>
      ) : (
        <p className="text-gray-400">请从知识星图选择一个节点开始学习</p>
      )}
    </div>
  )
}

export default LearnPage
