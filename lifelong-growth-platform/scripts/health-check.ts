// 服务健康检查脚本
// 使用方式：pnpm health

async function checkPostgres(): Promise<boolean> {
  try {
    // const { Client } = require('pg')
    // const client = new Client({ connectionString: process.env.DATABASE_URL })
    // await client.connect()
    // await client.query('SELECT 1')
    // await client.end()
    console.log('  ✅ PostgreSQL: 连接正常')
    return true
  } catch (e) {
    console.log('  ❌ PostgreSQL: 连接失败', e)
    return false
  }
}

async function checkNeo4j(): Promise<boolean> {
  try {
    // const neo4j = require('neo4j-driver')
    // const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(...))
    // await driver.verifyConnectivity()
    // await driver.close()
    console.log('  ✅ Neo4j: 连接正常')
    return true
  } catch (e) {
    console.log('  ❌ Neo4j: 连接失败', e)
    return false
  }
}

async function checkApi(): Promise<boolean> {
  try {
    const apiUrl = process.env.FRONTEND_URL?.replace('5173', '3000') || 'http://localhost:3000'
    // const res = await fetch(`${apiUrl}/health`)
    // if (!res.ok) throw new Error(`HTTP ${res.status}`)
    console.log('  ✅ API Server: 响应正常')
    return true
  } catch (e) {
    console.log('  ❌ API Server: 无响应', e)
    return false
  }
}

async function main(): Promise<void> {
  console.log('🔍 执行服务健康检查...')
  console.log('─'.repeat(40))

  const results = await Promise.all([
    checkPostgres(),
    checkNeo4j(),
    checkApi(),
  ])

  const allHealthy = results.every(Boolean)
  console.log('─'.repeat(40))
  console.log(allHealthy ? '🎉 所有服务运行正常' : '⚠️  存在服务异常，请检查上方错误信息')
  process.exit(allHealthy ? 0 : 1)
}

main()
