import { useEffect } from 'react'
import { useStarMapStore } from '@/stores/starMapStore'

const DEFAULT_GRAPH_ID = 'cross-border-ecommerce'

export function useStarMap(graphId: string = DEFAULT_GRAPH_ID) {
  const {
    nodes,
    edges,
    selectedNode,
    filterDomain,
    isLoading,
    error,
    fetchGraph,
    selectNode,
    updateNodeStatus,
    setFilterDomain,
    getFilteredNodes,
  } = useStarMapStore()

  useEffect(() => {
    fetchGraph(graphId)
  }, [graphId])

  return {
    nodes,
    edges,
    filteredNodes: getFilteredNodes(),
    selectedNode,
    filterDomain,
    isLoading,
    error,
    selectNode,
    updateNodeStatus,
    setFilterDomain,
  }
}
