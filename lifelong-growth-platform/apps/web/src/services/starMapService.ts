import api from './api'
import { KnowledgeGraph, GraphNode, NodeStatus } from '@/types/graph'

export const starMapService = {
  async getGraph(graphId: string): Promise<KnowledgeGraph> {
    const res = await api.get<KnowledgeGraph>(`/graph/${graphId}`)
    return res.data
  },

  async getNodeDetail(nodeId: string): Promise<GraphNode> {
    const res = await api.get<GraphNode>(`/graph/node/${nodeId}`)
    return res.data
  },

  async updateNodeStatus(nodeId: string, status: NodeStatus): Promise<void> {
    await api.patch(`/graph/node/${nodeId}/status`, { status })
  },

  async getUserProgress(graphId: string): Promise<Record<string, NodeStatus>> {
    const res = await api.get<Record<string, NodeStatus>>(`/graph/${graphId}/progress`)
    return res.data
  },
}
