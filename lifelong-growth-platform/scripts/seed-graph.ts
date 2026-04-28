import { seedNodes } from '../data/seeds/nodes.seed'
import { seedUsers } from '../data/seeds/users.seed'

async function main(): Promise<void> {
  console.log('🚀 开始初始化数据库种子数据...')
  console.log('─'.repeat(50))

  try {
    await seedUsers()
    console.log('✅ 用户种子数据完成')

    await seedNodes()
    console.log('✅ 图谱节点种子数据完成')

    console.log('─'.repeat(50))
    console.log('🎉 所有种子数据导入成功！')
  } catch (error) {
    console.error('❌ 种子数据导入失败：', error)
    process.exit(1)
  }
}

main()
