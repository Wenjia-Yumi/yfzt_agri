import * as fs from 'fs'
import * as path from 'path'

// 将 cross-border-ecommerce.json 图谱数据导入 Neo4j 的种子脚本
// 使用方式：pnpm seed

interface SeedNode {
  id: string
  label: string
  domain: string
  description: string
  prerequisites: string[]
}

interface SeedEdge {
  source: string
  target: string
  weight?: number
}

export async function seedNodes(): Promise<void> {
  const graphDataPath = path.join(__dirname, '../graphs/cross-border-ecommerce.json')
  const graphData = JSON.parse(fs.readFileSync(graphDataPath, 'utf-8'))

  const nodes: SeedNode[] = graphData.nodes
  const edges: SeedEdge[] = graphData.edges

  console.log(`准备导入 ${nodes.length} 个节点，${edges.length} 条边...`)

  // 此处替换为实际的 Neo4j 驱动调用
  // const driver = neo4j.driver(process.env.NEO4J_URI, ...)
  // const session = driver.session()

  for (const node of nodes) {
    console.log(`导入节点: ${node.id} - ${node.label}`)
    // await session.run(
    //   'MERGE (n:KnowledgeNode {id: $id}) SET n += $props',
    //   { id: node.id, props: { label: node.label, domain: node.domain, description: node.description } }
    // )
  }

  for (const edge of edges) {
    console.log(`导入边: ${edge.source} -> ${edge.target}`)
    // await session.run(
    //   'MATCH (a:KnowledgeNode {id: $src}), (b:KnowledgeNode {id: $tgt}) MERGE (a)-[:PREREQUISITE_OF {weight: $w}]->(b)',
    //   { src: edge.source, tgt: edge.target, w: edge.weight ?? 1 }
    // )
  }

  console.log('节点数据导入完成。')
}
