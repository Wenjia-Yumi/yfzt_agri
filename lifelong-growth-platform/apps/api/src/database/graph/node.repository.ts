import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import neo4j, { Driver, Session } from 'neo4j-driver'
import { GraphNode, NodeStatus } from '@lifelong/types'

@Injectable()
export class NodeRepository implements OnModuleInit, OnModuleDestroy {
  private driver!: Driver

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    this.driver = neo4j.driver(
      this.config.get<string>('NEO4J_URI', 'bolt://localhost:7687'),
      neo4j.auth.basic(
        this.config.get<string>('NEO4J_USERNAME', 'neo4j'),
        this.config.get<string>('NEO4J_PASSWORD', 'password'),
      ),
    )
  }

  async onModuleDestroy(): Promise<void> {
    await this.driver.close()
  }

  private getSession(): Session {
    return this.driver.session()
  }

  async findAllByGraphId(graphId: string): Promise<GraphNode[]> {
    const session = this.getSession()
    try {
      const result = await session.run(
        'MATCH (n:KnowledgeNode {graphId: $graphId}) RETURN n',
        { graphId },
      )
      return result.records.map((r) => r.get('n').properties as GraphNode)
    } finally {
      await session.close()
    }
  }

  async findById(nodeId: string): Promise<GraphNode | null> {
    const session = this.getSession()
    try {
      const result = await session.run(
        'MATCH (n:KnowledgeNode {id: $nodeId}) RETURN n',
        { nodeId },
      )
      if (result.records.length === 0) return null
      return result.records[0].get('n').properties as GraphNode
    } finally {
      await session.close()
    }
  }

  async findShortestPath(startId: string, endId: string): Promise<string[]> {
    const session = this.getSession()
    try {
      const result = await session.run(
        `MATCH path = shortestPath(
          (start:KnowledgeNode {id: $startId})-[:PREREQUISITE_OF*]->(end:KnowledgeNode {id: $endId})
        )
        RETURN [node IN nodes(path) | node.id] AS pathIds`,
        { startId, endId },
      )
      if (result.records.length === 0) return []
      return result.records[0].get('pathIds') as string[]
    } finally {
      await session.close()
    }
  }
}
