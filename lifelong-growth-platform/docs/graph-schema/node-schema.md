# 知识图谱数据结构规范

## 概述

本文档定义了 lifelong-growth-platform 中知识图谱（KnowledgeGraph）的数据结构规范，适用于：
- 新建专业知识图谱 JSON 文件（`data/graphs/*.json`）
- 后端 API 的请求/响应格式
- 前端组件的 props 类型定义

---

## 顶层结构

```typescript
interface KnowledgeGraph {
  id: string                       // 图谱唯一标识符
  name: string                     // 图谱显示名称
  version: string                  // 版本号（SemVer）
  description: string              // 图谱简介
  createdAt: string                // ISO 8601 日期
  updatedAt: string                // ISO 8601 日期
  nodes: GraphNode[]               // 节点列表
  edges: GraphEdge[]               // 边列表
  metadata: KnowledgeGraphMetadata // 元数据
}
```

---

## 节点（GraphNode）字段规范

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | ✅ | 全图唯一标识，小写字母+下划线，**一旦发布不可修改** |
| `label` | `string` | ✅ | 节点显示名称，2-8字 |
| `subLabel` | `string \| undefined` | ❌ | 节点副标签，4-10字，显示在节点图标下方 |
| `domain` | `KnowledgeDomain` | ✅ | 所属知识星域，见下方枚举 |
| `status` | `NodeStatus` | ✅ | 节点学习状态（存入用户进度表，图谱 JSON 中存初始状态） |
| `description` | `string` | ✅ | 知识点详细描述，建议100-500字，是AI顾问的知识库 |
| `prerequisites` | `string[]` | ✅ | 前置节点 ID 数组（直接依赖），根节点填 `[]` |
| `certifications` | `string[]` | ✅ | 关联证书 ID 数组，暂无填 `[]` |
| `x` | `number` | ❌ | 初始布局X坐标，D3会自动调整 |
| `y` | `number` | ❌ | 初始布局Y坐标，D3会自动调整 |
| `radius` | `number` | ❌ | 节点圆形半径（px），默认20，核心节点建议36 |

### NodeStatus 枚举

| 状态值 | 含义 | 视觉表现 |
|--------|------|----------|
| `LOCKED` | 锁定，前置条件未满足 | 暗灰色，透明度50% |
| `DISCOVERED` | 已解锁，可以开始学习 | 蓝色发光脉冲动画 |
| `LEARNING` | 学习中，正在进行 | 绿色发光持续动画 |
| `MASTERED` | 已掌握，完成学习 | 紫色稳定光晕 |
| `ENTERPRISE_CERTIFIED` | 企业认证，获得企业背书 | 金色旋转光环 |
| `DECAYING` | 知识衰退，长期未复习 | 红色闪烁警告 |
| `BRIDGE` | 跨学科桥接节点 | 紫罗兰色脉冲 |

### KnowledgeDomain 枚举

| 值 | 星域名称 | 颜色 |
|----|----------|------|
| `CORE` | 核心枢纽 | `#f6e05e` |
| `TRADE` | 贸易基础星域 | `#4299e1` |
| `PLATFORM` | 平台运营星域 | `#48bb78` |
| `MARKETING` | 流量营销星域 | `#ed8936` |
| `SUPPLY` | 供应链管理星域 | `#9f7aea` |
| `FINANCE` | 金融合规星域 | `#f687b3` |
| `DATA` | 数据智能星域 | `#4fd1c5` |
| `CROSS` | 跨学科桥接星域 | `#b794f4` |

---

## 边（GraphEdge）字段规范

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `source` | `string` | ✅ | 前置节点 ID（边的起点，表示"需要先学习此节点"） |
| `target` | `string` | ✅ | 依赖节点 ID（边的终点，表示"学完 source 才能解锁此节点"） |
| `weight` | `number` | ❌ | 依赖强度 1-3：3=强依赖，2=中等依赖，1=弱关联，默认1 |

> **注意**：edges 中的方向 `source → target` 表示**前置依赖关系**，即 source 是 target 的前置条件。这与 D3 力导向图中的箭头方向一致。

---

## 元数据（KnowledgeGraphMetadata）

| 字段 | 类型 | 说明 |
|------|------|------|
| `totalNodes` | `number` | 节点总数 |
| `totalEdges` | `number` | 边总数 |
| `domains` | `KnowledgeDomain[]` | 包含的星域列表 |
| `difficulty` | `'beginner' \| 'intermediate' \| 'advanced'` | 整体难度 |
| `estimatedHours` | `number` | 完成全部学习的预估小时数 |
| `targetAudience` | `string` | 目标学习者描述 |

---

## Neo4j 图数据库存储结构

```cypher
// 节点标签：KnowledgeNode
// 节点属性：id, label, domain, description, graphId, radius

// 关系类型：PREREQUISITE_OF
// 关系属性：weight

// 查询示例：获取某图谱的所有节点
MATCH (n:KnowledgeNode {graphId: 'cross-border-ecommerce'}) RETURN n

// 查询示例：获取到某节点的最短学习路径
MATCH path = shortestPath(
  (start:KnowledgeNode {id: 'core'})-[:PREREQUISITE_OF*]->(end:KnowledgeNode {id: 'python_data'})
)
RETURN [node in nodes(path) | node.id] AS learningPath
```

---

## 用户学习进度存储（PostgreSQL）

用户的节点学习状态**不存在图谱 JSON 中**，而是存储在 PostgreSQL 的 `learning_records` 表：

```sql
CREATE TABLE learning_records (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  graph_id    VARCHAR(100) NOT NULL,
  node_id     VARCHAR(100) NOT NULL,
  status      VARCHAR(30) NOT NULL,    -- NodeStatus 枚举值
  started_at  TIMESTAMP,
  mastered_at TIMESTAMP,
  last_reviewed_at TIMESTAMP,
  score       SMALLINT,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, graph_id, node_id)
);
```
