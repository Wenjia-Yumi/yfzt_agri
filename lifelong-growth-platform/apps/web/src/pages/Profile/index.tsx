import React from 'react'
import { useUserStore } from '@/stores/userStore'
import AbilityBall from '@/components/AbilityBall'
import { useLearningProgress } from '@/hooks/useLearningProgress'
import { KnowledgeDomain, NodeStatus } from '@/types/graph'

const ProfilePage: React.FC = () => {
  const { user } = useUserStore()
  const { progress } = useLearningProgress('cross-border-ecommerce')

  // 按星域统计掌握率
  const domainScores: Partial<Record<KnowledgeDomain, number>> = {}
  if (progress) {
    const masteredIds = new Set(
      progress.records
        .filter((r) => r.status === NodeStatus.MASTERED || r.status === NodeStatus.ENTERPRISE_CERTIFIED)
        .map((r) => r.nodeId),
    )
    // 简化计算：实际应从图谱节点分组统计
    Object.values(KnowledgeDomain).forEach((d) => {
      domainScores[d] = Math.round(Math.random() * 80)  // TODO: 替换为真实计算
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">👤 个人成长档案</h1>
      <div className="flex gap-8 flex-wrap">
        <div>
          <p className="text-gray-400 text-sm mb-4">综合能力雷达图</p>
          <AbilityBall scores={domainScores} size={280} />
        </div>
        <div>
          <p className="text-lg font-semibold">{user?.displayName ?? '学习者'}</p>
          <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
          {progress && (
            <div className="mt-4 space-y-2">
              <p className="text-gray-300 text-sm">总节点：{progress.totalNodes}</p>
              <p className="text-gray-300 text-sm">已掌握：{progress.masteredNodes}</p>
              <p className="text-gray-300 text-sm">完成率：{progress.completionRate}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
