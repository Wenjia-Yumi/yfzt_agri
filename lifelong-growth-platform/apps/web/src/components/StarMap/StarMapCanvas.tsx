import React, { useEffect, useRef, useCallback, memo } from 'react'
import * as d3 from 'd3'
import { GraphNode, GraphEdge, NodeStatus, KnowledgeDomain } from '@/types/graph'
import { getNodeFill, getNodeStroke, getNodeGlowColor, getNodeOpacity, getDomainColor } from '@/utils/nodeColor'

interface StarMapCanvasProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  onNodeClick: (node: GraphNode) => void
  selectedNodeId?: string | null
  width?: number
  height?: number
}

// D3 模拟运行时的节点类型（含坐标）
type SimNode = GraphNode & {
  x: number
  y: number
  vx: number
  vy: number
  fx: number | null
  fy: number | null
}

type SimEdge = {
  source: SimNode
  target: SimNode
  weight?: number
}

// 每种状态对应的 SVG glow filter id
const GLOW_FILTER_ID = (status: NodeStatus) => `glow-${status}`

const StarMapCanvas: React.FC<StarMapCanvasProps> = memo(({
  nodes,
  edges,
  onNodeClick,
  selectedNodeId,
  width = 1200,
  height = 800,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const simulationRef = useRef<d3.Simulation<SimNode, SimEdge> | null>(null)
  // 持有回调引用，避免 effect 因 onNodeClick 重建而反复触发
  const onNodeClickRef = useRef(onNodeClick)
  useEffect(() => { onNodeClickRef.current = onNodeClick }, [onNodeClick])

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return

    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)
    svg.selectAll('*').remove()

    // ── 星空背景渐变 ──────────────────────────────────────────────
    const defs = svg.append('defs')

    const bgGrad = defs.append('radialGradient').attr('id', 'bg-gradient')
    bgGrad.append('stop').attr('offset', '0%').attr('stop-color', '#0f1729')
    bgGrad.append('stop').attr('offset', '100%').attr('stop-color', '#060d1a')

    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#bg-gradient)')

    // ── 为每种节点状态定义 glow 滤镜 ─────────────────────────────
    const glowStatuses = Object.values(NodeStatus)
    for (const status of glowStatuses) {
      const color = getNodeGlowColor(status)
      if (color === 'transparent') continue

      const filter = defs.append('filter')
        .attr('id', GLOW_FILTER_ID(status))
        .attr('x', '-50%').attr('y', '-50%')
        .attr('width', '200%').attr('height', '200%')

      filter.append('feGaussianBlur')
        .attr('stdDeviation', '4')
        .attr('result', 'coloredBlur')

      const feMerge = filter.append('feMerge')
      feMerge.append('feMergeNode').attr('in', 'coloredBlur')
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic')
    }

    // 选中节点的强发光滤镜
    const selectedFilter = defs.append('filter')
      .attr('id', 'glow-selected')
      .attr('x', '-80%').attr('y', '-80%')
      .attr('width', '260%').attr('height', '260%')
    selectedFilter.append('feGaussianBlur').attr('stdDeviation', '8').attr('result', 'coloredBlur')
    const sfMerge = selectedFilter.append('feMerge')
    sfMerge.append('feMergeNode').attr('in', 'coloredBlur')
    sfMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    // ── 星空背景粒子（装饰用，静态小圆点） ─────────────────────────
    const bgGroup = svg.append('g').attr('class', 'bg-stars')
    const starCount = 120
    for (let i = 0; i < starCount; i++) {
      bgGroup.append('circle')
        .attr('cx', Math.random() * width)
        .attr('cy', Math.random() * height)
        .attr('r', Math.random() * 1.5 + 0.3)
        .attr('fill', 'white')
        .attr('opacity', Math.random() * 0.5 + 0.1)
    }

    // ── Zoom / Pan 支持 ───────────────────────────────────────────
    const container = svg.append('g').attr('class', 'zoom-container')

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 4])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        container.attr('transform', event.transform.toString())
      })

    svg.call(zoom)

    // 双击重置视图
    svg.on('dblclick.zoom', () => {
      svg.transition().duration(600).call(
        zoom.transform,
        d3.zoomIdentity.translate(0, 0).scale(1),
      )
    })

    // ── 深拷贝节点和边，供 D3 模拟使用 ──────────────────────────────
    const simNodes: SimNode[] = nodes.map((n) => ({
      ...n,
      x: n.x ?? width / 2,
      y: n.y ?? height / 2,
      vx: 0,
      vy: 0,
      fx: null,
      fy: null,
    }))

    const nodeById = new Map(simNodes.map((n) => [n.id, n]))

    const simEdges: SimEdge[] = edges
      .map((e) => {
        const src = typeof e.source === 'string' ? nodeById.get(e.source) : nodeById.get((e.source as GraphNode).id)
        const tgt = typeof e.target === 'string' ? nodeById.get(e.target) : nodeById.get((e.target as GraphNode).id)
        if (!src || !tgt) return null
        return { source: src, target: tgt, weight: e.weight }
      })
      .filter(Boolean) as SimEdge[]

    // ── D3 力导向模拟 ─────────────────────────────────────────────
    const simulation = d3.forceSimulation<SimNode>(simNodes)
      .force('link', d3.forceLink<SimNode, SimEdge>(simEdges)
        .id((d) => d.id)
        .distance((d) => {
          const w = d.weight ?? 1
          return 80 + (3 - w) * 40  // 强依赖=120px，弱关联=200px
        })
        .strength(0.7),
      )
      .force('charge', d3.forceManyBody<SimNode>()
        .strength((d) => -(d.radius ?? 20) * 18),
      )
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.05))
      .force('collision', d3.forceCollide<SimNode>()
        .radius((d) => (d.radius ?? 20) + 12)
        .strength(0.8),
      )
      // 按星域分组的向心力（让同星域节点聚在一起）
      .force('domain-x', d3.forceX<SimNode>((d) => getDomainCenterX(d.domain, width)).strength(0.06))
      .force('domain-y', d3.forceY<SimNode>((d) => getDomainCenterY(d.domain, height)).strength(0.06))
      .alphaDecay(0.028)

    simulationRef.current = simulation

    // ── 边（连线） ─────────────────────────────────────────────────
    const linksGroup = container.append('g').attr('class', 'links')

    const linkLine = linksGroup.selectAll<SVGLineElement, SimEdge>('line')
      .data(simEdges)
      .join('line')
      .attr('stroke', (d) => {
        const srcDomain = d.source.domain
        return getDomainColor(srcDomain as KnowledgeDomain) + '55'  // 半透明星域色
      })
      .attr('stroke-width', (d) => Math.sqrt(d.weight ?? 1) * 1.2)
      .attr('stroke-dasharray', (d) => (d.weight ?? 1) < 2 ? '4,3' : 'none')
      .attr('stroke-linecap', 'round')

    // ── 节点组 ─────────────────────────────────────────────────────
    const nodesGroup = container.append('g').attr('class', 'nodes')

    const nodeGroup = nodesGroup.selectAll<SVGGElement, SimNode>('g.node')
      .data(simNodes, (d) => d.id)
      .join('g')
      .attr('class', 'node')
      .style('cursor', (d) => d.status === NodeStatus.LOCKED ? 'not-allowed' : 'pointer')
      .on('click', (_event: MouseEvent, d: SimNode) => {
        onNodeClickRef.current(d)
      })
      .call(
        d3.drag<SVGGElement, SimNode>()
          .on('start', (event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>, d: SimNode) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on('drag', (event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>, d: SimNode) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on('end', (event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>, d: SimNode) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          }),
      )

    // 节点外圈光晕（仅非 LOCKED 状态）
    nodeGroup
      .filter((d) => d.status !== NodeStatus.LOCKED)
      .append('circle')
      .attr('class', 'node-halo')
      .attr('r', (d) => (d.radius ?? 20) + 6)
      .attr('fill', 'none')
      .attr('stroke', (d) => getNodeGlowColor(d.status))
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.35)

    // 节点主圆
    nodeGroup.append('circle')
      .attr('class', 'node-circle')
      .attr('r', (d) => d.radius ?? 20)
      .attr('fill', (d) => getNodeFill(d.status))
      .attr('stroke', (d) => d.id === selectedNodeId ? '#fff' : getNodeStroke(d.status))
      .attr('stroke-width', (d) => d.id === selectedNodeId ? 3 : 2)
      .attr('opacity', (d) => getNodeOpacity(d.status))
      .attr('filter', (d) => {
        if (d.id === selectedNodeId) return 'url(#glow-selected)'
        if (d.status === NodeStatus.LOCKED) return 'none'
        return `url(#${GLOW_FILTER_ID(d.status)})`
      })

    // 节点 label（主文字）
    nodeGroup.append('text')
      .attr('class', 'node-label')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('dy', (d) => d.subLabel ? '-0.6em' : '0')
      .attr('fill', (d) => d.status === NodeStatus.LOCKED ? '#4a5568' : '#e2e8f0')
      .attr('font-size', (d) => {
        const r = d.radius ?? 20
        return r >= 30 ? '13px' : r >= 24 ? '11px' : '10px'
      })
      .attr('font-weight', '500')
      .attr('pointer-events', 'none')
      .style('user-select', 'none')

    // 节点 subLabel（副文字）
    nodeGroup
      .filter((d) => !!d.subLabel)
      .append('text')
      .attr('class', 'node-sublabel')
      .text((d) => d.subLabel ?? '')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('dy', '0.85em')
      .attr('fill', (d) => d.status === NodeStatus.LOCKED ? '#2d3748' : '#718096')
      .attr('font-size', '9px')
      .attr('pointer-events', 'none')
      .style('user-select', 'none')

    // ── 模拟 tick：更新位置 ────────────────────────────────────────
    simulation.on('tick', () => {
      linkLine
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)

      nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`)
    })

    // ── 选中节点的高亮更新（不重建模拟，仅更新样式） ───────────────
    // 通过 CSS class 触发，由外部 selectedNodeId 变化驱动重渲染

    return () => {
      simulation.stop()
    }
  }, [nodes, edges, width, height])

  // 选中状态变化时，只更新描边样式，不重建模拟
  useEffect(() => {
    if (!svgRef.current) return
    d3.select(svgRef.current)
      .selectAll<SVGCircleElement, SimNode>('.node-circle')
      .attr('stroke', (d) => d.id === selectedNodeId ? '#ffffff' : getNodeStroke(d.status))
      .attr('stroke-width', (d) => d.id === selectedNodeId ? 3 : 2)
      .attr('filter', (d) => {
        if (d.id === selectedNodeId) return 'url(#glow-selected)'
        if (d.status === NodeStatus.LOCKED) return 'none'
        return `url(#${GLOW_FILTER_ID(d.status)})`
      })
  }, [selectedNodeId])

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="w-full h-full rounded-xl"
      style={{ background: 'transparent' }}
      aria-label="知识星图"
    />
  )
})

StarMapCanvas.displayName = 'StarMapCanvas'

export default StarMapCanvas

// ── 各星域的向心力锚点坐标 ────────────────────────────────────
function getDomainCenterX(domain: KnowledgeDomain | string, w: number): number {
  const map: Partial<Record<KnowledgeDomain, number>> = {
    [KnowledgeDomain.CORE]: 0.5,
    [KnowledgeDomain.TRADE]: 0.22,
    [KnowledgeDomain.PLATFORM]: 0.68,
    [KnowledgeDomain.MARKETING]: 0.82,
    [KnowledgeDomain.SUPPLY]: 0.32,
    [KnowledgeDomain.FINANCE]: 0.12,
    [KnowledgeDomain.DATA]: 0.65,
    [KnowledgeDomain.CROSS]: 0.46,
  }
  return w * (map[domain as KnowledgeDomain] ?? 0.5)
}

function getDomainCenterY(domain: KnowledgeDomain | string, h: number): number {
  const map: Partial<Record<KnowledgeDomain, number>> = {
    [KnowledgeDomain.CORE]: 0.5,
    [KnowledgeDomain.TRADE]: 0.35,
    [KnowledgeDomain.PLATFORM]: 0.3,
    [KnowledgeDomain.MARKETING]: 0.5,
    [KnowledgeDomain.SUPPLY]: 0.72,
    [KnowledgeDomain.FINANCE]: 0.6,
    [KnowledgeDomain.DATA]: 0.82,
    [KnowledgeDomain.CROSS]: 0.18,
  }
  return h * (map[domain as KnowledgeDomain] ?? 0.5)
}
