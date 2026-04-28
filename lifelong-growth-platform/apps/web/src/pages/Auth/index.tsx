import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/stores/userStore'
import { userService } from '@/services/userService'
import Button from '@/components/Common/Button'

const AuthPage: React.FC = () => {
  const navigate = useNavigate()
  const { setUser } = useUserStore()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = mode === 'login'
        ? await userService.login({ email, password })
        : await userService.register({ email, password, displayName })
      setUser(result.user, result.token)
      navigate('/star-map')
    } catch {
      setError(mode === 'login' ? '邮箱或密码错误' : '注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-4xl mb-2">🌌</p>
          <h1 className="text-white text-2xl font-bold">终身成长平台</h1>
          <p className="text-gray-400 text-sm mt-1">用知识星图点亮你的成长之路</p>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <div className="flex gap-2 mb-6">
            {(['login', 'register'] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm rounded-lg transition-all ${
                  mode === m ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
                }`}>
                {m === 'login' ? '登录' : '注册'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                placeholder="昵称" required
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500" />
            )}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="邮箱" required
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="密码" required
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500" />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <Button type="submit" variant="primary" size="md" loading={loading} className="w-full">
              {mode === 'login' ? '登录' : '创建账号'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
