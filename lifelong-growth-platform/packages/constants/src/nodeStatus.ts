import { NodeStatus } from '@lifelong/types'

export type AnimationType = 'none' | 'pulse' | 'rotate' | 'flicker' | 'glow'

export interface NodeStatusVisualConfig {
  fill: string        // 节点填充色
  stroke: string      // 描边颜色
  glowColor: string   // 发光特效颜色（用于 D3 filter）
  animationType: AnimationType
  opacity: number     // 节点透明度
  label: string       // 中文状态标签
}

export const NODE_STATUS_CONFIG: Record<NodeStatus, NodeStatusVisualConfig> = {
  [NodeStatus.LOCKED]: {
    fill: '#1a1f2e',
    stroke: '#2d3748',
    glowColor: 'transparent',
    animationType: 'none',
    opacity: 0.5,
    label: '锁定',
  },
  [NodeStatus.DISCOVERED]: {
    fill: '#1e3a5f',
    stroke: '#4299e1',
    glowColor: '#4299e1',
    animationType: 'pulse',
    opacity: 0.9,
    label: '已解锁',
  },
  [NodeStatus.LEARNING]: {
    fill: '#2d4a1e',
    stroke: '#68d391',
    glowColor: '#68d391',
    animationType: 'glow',
    opacity: 1,
    label: '学习中',
  },
  [NodeStatus.MASTERED]: {
    fill: '#2d3561',
    stroke: '#7f9cf5',
    glowColor: '#7f9cf5',
    animationType: 'none',
    opacity: 1,
    label: '已掌握',
  },
  [NodeStatus.ENTERPRISE_CERTIFIED]: {
    fill: '#4a2c0a',
    stroke: '#f6ad55',
    glowColor: '#f6ad55',
    animationType: 'rotate',
    opacity: 1,
    label: '企业认证',
  },
  [NodeStatus.DECAYING]: {
    fill: '#2d1b1b',
    stroke: '#fc8181',
    glowColor: '#fc8181',
    animationType: 'flicker',
    opacity: 0.75,
    label: '知识衰退',
  },
  [NodeStatus.BRIDGE]: {
    fill: '#2d1f4a',
    stroke: '#b794f4',
    glowColor: '#b794f4',
    animationType: 'pulse',
    opacity: 1,
    label: '跨学科桥接',
  },
}
