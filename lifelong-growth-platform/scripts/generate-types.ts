import * as fs from 'fs'
import * as path from 'path'

// 从图谱 JSON 数据自动生成 TypeScript 常量文件
// 使用方式：pnpm gen:types

function generateNodeIdConstants(): void {
  const graphPath = path.join(__dirname, '../data/graphs/cross-border-ecommerce.json')
  const graph = JSON.parse(fs.readFileSync(graphPath, 'utf-8'))

  const lines: string[] = [
    '// 自动生成文件，请勿手动编辑',
    `// 生成时间：${new Date().toISOString()}`,
    '',
    `// 跨境电商图谱节点 ID 常量`,
    `export const NODE_IDS = {`,
  ]

  for (const node of graph.nodes) {
    const key = node.id.toUpperCase()
    lines.push(`  ${key}: '${node.id}', // ${node.label}`)
  }

  lines.push('} as const')
  lines.push('')
  lines.push('export type NodeId = typeof NODE_IDS[keyof typeof NODE_IDS]')

  const outputPath = path.join(__dirname, '../packages/constants/src/nodeIds.generated.ts')
  fs.writeFileSync(outputPath, lines.join('\n'))
  console.log(`✅ 已生成节点 ID 常量文件：${outputPath}`)
}

generateNodeIdConstants()
