import { Injectable } from '@nestjs/common'
import { NodeRepository } from './node.repository'
import { GraphEdge } from '@lifelong/types'

@Injectable()
export class EdgeRepository {
  constructor(private readonly nodeRepo: NodeRepository) {}

  async findAllByGraphId(graphId: string): Promise<GraphEdge[]> {
    // 通过 Neo4j 查询图谱中所有 PREREQUISITE_OF 关系
    // 具体 Cypher：MATCH (a)-[r:PREREQUISITE_OF]->(b) WHERE a.graphId = $graphId RETURN a.id, b.id, r.weight
    const session = (this.nodeRepo as any).getSession?.()
    if (!session) return []
    try {
      const result = await session.run(
        'MATCH (a:KnowledgeNode {graphId: $graphId})-[r:PREREQUISITE_OF]->(b:KnowledgeNode) RETURN a.id AS source, b.id AS target, r.weight AS weight',
        { graphId },
      )
      return result.records.map((rec: any) => ({
        source: rec.get('source') as string,
        target: rec.get('target') as string,
        weight: rec.get('weight') as number | undefined,
      }))
    } finally {
      await session.close()
    }
  }
}
