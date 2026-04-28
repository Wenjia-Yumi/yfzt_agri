import { create } from 'zustand'
import { GraphNode, GraphEdge, KnowledgeDomain, NodeStatus } from '@/types/graph'
import { starMapService } from '@/services/starMapService'

interface StarMapState {
  nodes: GraphNode[]
  edges: GraphEdge[]
  selectedNode: GraphNode | null
  filterDomain: KnowledgeDomain | null
  isLoading: boolean
  error: string | null

  // actions
  fetchGraph: (graphId: string) => Promise<void>
  selectNode: (node: GraphNode | null) => void
  updateNodeStatus: (nodeId: string, status: NodeStatus) => void
  setFilterDomain: (domain: KnowledgeDomain | null) => void
  getFilteredNodes: () => GraphNode[]
}

export const useStarMapStore = create<StarMapState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  filterDomain: null,
  isLoading: false,
  error: null,

  fetchGraph: async (graphId: string) => {
    set({ isLoading: true, error: null })
    try {
      const graph = await starMapService.getGraph(graphId)
      set({ nodes: graph.nodes, edges: graph.edges, isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  selectNode: (node) => set({ selectedNode: node }),

  updateNodeStatus: (nodeId, status) => {
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, status } : n)),
      selectedNode:
        state.selectedNode?.id === nodeId
          ? { ...state.selectedNode, status }
          : state.selectedNode,
    }))
  },

  setFilterDomain: (domain) => set({ filterDomain: domain }),

  getFilteredNodes: () => {
    const { nodes, filterDomain } = get()
    if (!filterDomain) return nodes
    return nodes.filter((n) => n.domain === filterDomain)
  },
}))
