import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { NodeRepository } from '../../database/graph/node.repository'
import { EdgeRepository } from '../../database/graph/edge.repository'
import { LearningRecordEntity } from '../../database/entities/learning-record.entity'
import { GraphNode, GraphEdge, KnowledgeGraph, NodeStatus } from '@lifelong/types'

// 支持的图谱 ID 白名单（V1.0 硬编码，后续从数据库读取）
const VALID_GRAPH_IDS = ['cross-border-ecommerce']

@Injectable()
export class GraphService {
  constructor(
    private readonly nodeRepo: NodeRepository,
    private readonly edgeRepo: EdgeRepository,
    @InjectRepository(LearningRecordEntity)
    private readonly learningRepo: Repository<LearningRecordEntity>,
  ) {}

  /**
   * 获取指定专业知识图谱（含用户学习状态叠加）
   * @param graphId 图谱 ID，如 'cross-border-ecommerce'
   * @param userId  当前登录用户 ID，用于叠加个性化节点状态
   */
  async getGraphByDomain(graphId: string, userId?: string): Promise<KnowledgeGraph> {
    if (!VALID_GRAPH_IDS.includes(graphId)) {
      throw new NotFoundException(`图谱 '${graphId}' 不存在`)
    }

    // 从 Neo4j 获取节点和边
    const [nodes, edges] = await Promise.all([
      this.nodeRepo.findAllByGraphId(graphId),
      this.edgeRepo.findAllByGraphId(graphId),
    ])

    // 如果传入了用户 ID，将数据库中的学习状态覆盖到节点的 status 字段
    if (userId) {
      const records = await this.learningRepo.find({
        where: { userId, graphId },
        select: ['nodeId', 'status'],
      })
      const statusMap = new Map(records.map((r) => [r.nodeId, r.status]))

      for (const node of nodes) {
        const userStatus = statusMap.get(node.id)
        if (userStatus) node.status = userStatus
      }
    }

    return {
      id: graphId,
      name: '跨境电商知识星图',
      version: '1.0.0',
      description: '跨境电商全领域知识体系',
      nodes,
      edges,
      metadata: {
        totalNodes: nodes.length,
        totalEdges: edges.length,
        domains: [...new Set(nodes.map((n) => n.domain))],
        difficulty: 'intermediate',
        estimatedHours: 480,
        targetAudience: '跨境电商从业者',
      },
    }
  }

  /**
   * 获取单个节点详情
   * @param nodeId 节点 ID
   */
  async getNodeDetail(nodeId: string): Promise<GraphNode> {
    const node = await this.nodeRepo.findById(nodeId)
    if (!node) throw new NotFoundException(`节点 '${nodeId}' 不存在`)
    return node
  }

  /**
   * 更新用户对某个节点的学习状态
   * @param userId  用户 ID
   * @param nodeId  节点 ID
   * @param status  目标状态
   *
   * 业务规则：
   * - LOCKED 节点无法直接设置为 MASTERED，必须先经过 DISCOVERED → LEARNING → MASTERED
   * - 只有当所有 prerequisites 节点都为 MASTERED 时，才允许解锁（状态变为 DISCOVERED）
   */
  async updateNodeStatus(
    userId: string,
    nodeId: string,
    status: NodeStatus,
    graphId = 'cross-border-ecommerce',
  ): Promise<LearningRecordEntity> {
    // 校验节点存在
    const node = await this.nodeRepo.findById(nodeId)
    if (!node) throw new NotFoundException(`节点 '${nodeId}' 不存在`)

    // 若设置为 LEARNING，检查前置节点是否已掌握
    if (status === NodeStatus.LEARNING && node.prerequisites.length > 0) {
      const prereqRecords = await this.learningRepo.find({
        where: node.prerequisites.map((id) => ({ userId, nodeId: id, graphId })),
      })
      const masteredSet = new Set(
        prereqRecords
          .filter((r) => r.status === NodeStatus.MASTERED || r.status === NodeStatus.ENTERPRISE_CERTIFIED)
          .map((r) => r.nodeId),
      )
      const unmet = node.prerequisites.filter((id) => !masteredSet.has(id))
      if (unmet.length > 0) {
        throw new BadRequestException(`请先完成前置节点：${unmet.join(', ')}`)
      }
    }

    // upsert 学习记录
    let record = await this.learningRepo.findOne({ where: { userId, nodeId, graphId } })

    if (!record) {
      record = this.learningRepo.create({ userId, nodeId, graphId, status })
    } else {
      record.status = status
    }

    // 自动填充时间戳
    if (status === NodeStatus.LEARNING && !record.startedAt) {
      record.startedAt = new Date()
    }
    if (status === NodeStatus.MASTERED && !record.masteredAt) {
      record.masteredAt = new Date()
    }
    record.lastReviewedAt = new Date()

    await this.learningRepo.save(record)

    // 解锁后续节点（将满足前置条件的子节点从 LOCKED 改为 DISCOVERED）
    if (status === NodeStatus.MASTERED) {
      await this.unlockDependentNodes(userId, nodeId, graphId)
    }

    return record
  }

  /**
   * 获取用户在某图谱上的完整学习进度
   * @param userId  用户 ID
   * @param graphId 图谱 ID
   */
  async getUserGraphProgress(
    userId: string,
    graphId = 'cross-border-ecommerce',
  ): Promise<{
    totalNodes: number
    masteredNodes: number
    learningNodes: number
    completionRate: number
    records: LearningRecordEntity[]
  }> {
    const [allNodes, records] = await Promise.all([
      this.nodeRepo.findAllByGraphId(graphId),
      this.learningRepo.find({ where: { userId, graphId } }),
    ])

    const masteredNodes = records.filter(
      (r) => r.status === NodeStatus.MASTERED || r.status === NodeStatus.ENTERPRISE_CERTIFIED,
    ).length
    const learningNodes = records.filter((r) => r.status === NodeStatus.LEARNING).length

    return {
      totalNodes: allNodes.length,
      masteredNodes,
      learningNodes,
      completionRate: allNodes.length > 0 ? Math.round((masteredNodes / allNodes.length) * 100) : 0,
      records,
    }
  }

  /**
   * 获取 AI 推荐的学习路径（预留接口，由 AIService 实际调用）
   * 此方法负责查询图数据并将结果传递给 AI 生成建议
   * @param userId        用户 ID
   * @param targetNodeId  目标节点 ID
   * @returns 推荐学习路径的节点 ID 数组（从当前进度出发的最优路径）
   */
  async getRecommendedPath(userId: string, targetNodeId: string): Promise<string[]> {
    // 1. 获取用户当前掌握的节点列表
    const masteredRecords = await this.learningRepo.find({
      where: { userId, status: NodeStatus.MASTERED },
      select: ['nodeId'],
    })
    const masteredIds = new Set(masteredRecords.map((r) => r.nodeId))

    // 2. 如果目标节点已掌握，直接返回空路径
    if (masteredIds.has(targetNodeId)) return []

    // 3. 在图中找到从"最近已掌握节点"到目标节点的最短路径
    // 简化策略：从核心节点（core）开始查找
    const startNodeId = masteredIds.size > 0
      ? [...masteredIds][masteredIds.size - 1]
      : 'core'

    const fullPath = await this.nodeRepo.findShortestPath(startNodeId, targetNodeId)

    // 4. 过滤掉已掌握的节点，返回待学习路径
    return fullPath.filter((id) => !masteredIds.has(id))
  }

  // ── 内部方法：解锁满足前置条件的节点 ───────────────────────────
  private async unlockDependentNodes(
    userId: string,
    masteredNodeId: string,
    graphId: string,
  ): Promise<void> {
    // 查找所有以 masteredNodeId 为前置依赖的节点
    // 此处通过遍历所有节点判断，生产环境建议用 Neo4j 反向查询：
    // MATCH (n:KnowledgeNode)-[:PREREQUISITE_OF]->(target) WHERE n.id = $id RETURN target
    const allNodes = await this.nodeRepo.findAllByGraphId(graphId)
    const dependents = allNodes.filter((n) => n.prerequisites.includes(masteredNodeId))

    for (const dep of dependents) {
      // 检查该节点的所有前置依赖是否均已掌握
      const prereqRecords = await this.learningRepo.find({
        where: dep.prerequisites.map((id) => ({ userId, nodeId: id, graphId })),
      })
      const masteredPrereqIds = new Set(
        prereqRecords
          .filter((r) => r.status === NodeStatus.MASTERED || r.status === NodeStatus.ENTERPRISE_CERTIFIED)
          .map((r) => r.nodeId),
      )
      const allPrereqsMet = dep.prerequisites.every((id) => masteredPrereqIds.has(id))

      if (allPrereqsMet) {
        // 将 LOCKED 节点升级为 DISCOVERED
        const existing = await this.learningRepo.findOne({ where: { userId, nodeId: dep.id, graphId } })
        if (!existing || existing.status === NodeStatus.LOCKED) {
          await this.learningRepo.save(
            this.learningRepo.create({ userId, nodeId: dep.id, graphId, status: NodeStatus.DISCOVERED }),
          )
        }
      }
    }
  }
}
