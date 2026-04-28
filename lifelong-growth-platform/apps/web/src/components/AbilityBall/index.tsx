import React from 'react'
import { KnowledgeDomain } from '@/types/graph'
import { DOMAIN_CONFIG } from '@lifelong/constants'

interface AbilityBallProps {
  scores: Partial<Record<KnowledgeDomain, number>>  // 0-100
  size?: number
}

// 雷达图式能力球：用 SVG 多边形展示各星域掌握程度
const AbilityBall: React.FC<AbilityBallProps> = ({ scores, size = 240 }) => {
  const domains = Object.values(KnowledgeDomain).filter((d) => d !== KnowledgeDomain.CORE)
  const cx = size / 2
  const cy = size / 2
  const maxR = size * 0.38
  const angleStep = (2 * Math.PI) / domains.length

  const getPoint = (index: number, ratio: number) => {
    const angle = index * angleStep - Math.PI / 2
    return {
      x: cx + maxR * ratio * Math.cos(angle),
      y: cy + maxR * ratio * Math.sin(angle),
    }
  }

  const gridLevels = [0.25, 0.5, 0.75, 1]

  const abilityPoints = domains.map((d, i) => getPoint(i, (scores[d] ?? 0) / 100))
  const abilityPath = abilityPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* 背景网格 */}
      {gridLevels.map((level) => {
        const pts = domains.map((_, i) => getPoint(i, level))
        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z'
        return <path key={level} d={path} fill="none" stroke="#2d3748" strokeWidth="1" />
      })}
      {/* 轴线 */}
      {domains.map((_, i) => {
        const p = getPoint(i, 1)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#2d3748" strokeWidth="1" />
      })}
      {/* 能力多边形 */}
      <path d={abilityPath} fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="2" />
      {/* 能力点 */}
      {abilityPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={DOMAIN_CONFIG[domains[i]].color} />
      ))}
      {/* 星域标签 */}
      {domains.map((d, i) => {
        const p = getPoint(i, 1.22)
        return (
          <text key={d} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill={DOMAIN_CONFIG[d].color} fontSize="9">
            {DOMAIN_CONFIG[d].label.replace('星域', '')}
          </text>
        )
      })}
    </svg>
  )
}

export default AbilityBall
