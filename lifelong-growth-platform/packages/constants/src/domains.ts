import { KnowledgeDomain } from '@lifelong/types'

export interface DomainConfig {
  label: string       // 中文名称
  color: string       // 星域主色调
  description: string // 星域简介
  icon: string        // emoji 图标（UI 备用）
}

export const DOMAIN_CONFIG: Record<KnowledgeDomain, DomainConfig> = {
  [KnowledgeDomain.CORE]: {
    label: '核心枢纽',
    color: '#f6e05e',
    description: '跨境电商知识体系的核心，连接所有专业星域的枢纽节点',
    icon: '⭐',
  },
  [KnowledgeDomain.TRADE]: {
    label: '贸易基础星域',
    color: '#4299e1',
    description: '国际贸易理论、海关清关、Incoterms术语、外贸合同等基础知识体系',
    icon: '🌐',
  },
  [KnowledgeDomain.PLATFORM]: {
    label: '平台运营星域',
    color: '#48bb78',
    description: 'Amazon、Shopify、Temu/Shein等主流跨境平台的运营实战技能',
    icon: '🛒',
  },
  [KnowledgeDomain.MARKETING]: {
    label: '流量营销星域',
    color: '#ed8936',
    description: 'PPC广告、社交媒体、SEO、邮件营销、AIGC内容生成等流量获取技能',
    icon: '📣',
  },
  [KnowledgeDomain.SUPPLY]: {
    label: '供应链管理星域',
    color: '#9f7aea',
    description: '供应商开发、仓储物流、品质管控、库存管理等供应链核心技能',
    icon: '🚢',
  },
  [KnowledgeDomain.FINANCE]: {
    label: '金融合规星域',
    color: '#f687b3',
    description: '跨境支付结汇、税务合规（VAT/销售税）、风险控制与合规经营',
    icon: '💰',
  },
  [KnowledgeDomain.DATA]: {
    label: '数据智能星域',
    color: '#4fd1c5',
    description: '数据分析、Python数据处理、BI工具应用等数据驱动决策技能',
    icon: '📊',
  },
  [KnowledgeDomain.CROSS]: {
    label: '跨学科桥接星域',
    color: '#b794f4',
    description: '跨文化沟通、消费者心理学、商务英语、设计思维等跨学科软实力',
    icon: '🌉',
  },
}
