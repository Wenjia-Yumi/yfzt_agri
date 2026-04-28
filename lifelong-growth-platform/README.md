# lifelong-growth-platform

终身成长平台 —— 基于知识图谱与 AI 驱动的跨境电商学习系统

## 技术栈

| 层级 | 技术 |
|------|------|
| Monorepo | pnpm workspaces |
| 前端 | React 18 + TypeScript + Vite + Zustand + D3.js + Tailwind CSS |
| 后端 | Node.js + NestJS + TypeORM + PostgreSQL + Neo4j |
| AI | Anthropic Claude API |
| 容器化 | Docker + docker-compose |

## 快速开始

### 前置条件

- Node.js >= 18
- pnpm >= 8
- Docker + Docker Compose

### 1. 克隆并安装依赖

```bash
git clone <repo-url>
cd lifelong-growth-platform
pnpm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env，填入真实的 API Key 和数据库密码
```

### 3. 启动基础设施（开发模式）

```bash
pnpm docker:dev
```

### 4. 初始化数据库并导入图谱数据

```bash
pnpm seed
```

### 5. 启动开发服务器

```bash
pnpm dev
```

- 前端：http://localhost:5173
- 后端：http://localhost:3000
- Neo4j 控制台：http://localhost:7474

## 目录结构

```
lifelong-growth-platform/
├── apps/
│   ├── web/          # React 前端
│   └── api/          # NestJS 后端
├── packages/
│   ├── types/        # 共享 TypeScript 类型
│   └── constants/    # 共享常量配置
├── data/
│   ├── graphs/       # 知识图谱 JSON 数据
│   └── seeds/        # 数据库种子数据
├── scripts/          # 工具脚本
└── docs/             # 项目文档
```

## 核心特性

- **知识星图**：基于 D3.js 力导向图，可视化知识点依赖关系
- **AI 学习顾问**：集成 Claude API，提供个性化学习路径推荐
- **学习进度追踪**：节点状态管理（锁定/学习中/已掌握/企业认证）
- **证书体系**：可验证的学习成就证书
- **多专业支持**：可扩展的知识图谱数据结构

## 文档

- [架构决策记录](./docs/architecture/ADR-001-tech-stack.md)
- [图谱数据规范](./docs/graph-schema/node-schema.md)
- [API 文档](./docs/api/)
