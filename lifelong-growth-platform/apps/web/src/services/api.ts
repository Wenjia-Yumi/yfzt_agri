import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截：自动注入 JWT Token
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('lgp-user')
  if (stored) {
    const { state } = JSON.parse(stored)
    if (state?.token) {
      config.headers.Authorization = `Bearer ${state.token}`
    }
  }
  return config
})

// 响应拦截：401 自动跳转登录
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lgp-user')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  },
)

export default api
