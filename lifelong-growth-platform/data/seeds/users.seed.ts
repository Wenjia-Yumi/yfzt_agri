// 开发环境测试用户数据种子

export interface SeedUser {
  email: string
  displayName: string
  role: 'STUDENT' | 'ENTERPRISE' | 'ADMIN'
  password: string
}

export const SEED_USERS: SeedUser[] = [
  {
    email: 'admin@lifelong.dev',
    displayName: '系统管理员',
    role: 'ADMIN',
    password: 'Admin@123456',
  },
  {
    email: 'student@lifelong.dev',
    displayName: '测试学习者',
    role: 'STUDENT',
    password: 'Student@123456',
  },
  {
    email: 'enterprise@lifelong.dev',
    displayName: '测试企业用户',
    role: 'ENTERPRISE',
    password: 'Enterprise@123456',
  },
]

export async function seedUsers(): Promise<void> {
  console.log(`准备导入 ${SEED_USERS.length} 个测试用户...`)
  for (const user of SEED_USERS) {
    console.log(`导入用户: ${user.email} (${user.role})`)
    // 实际写入数据库逻辑由 scripts/seed-graph.ts 调用
  }
  console.log('用户数据导入完成。')
}
