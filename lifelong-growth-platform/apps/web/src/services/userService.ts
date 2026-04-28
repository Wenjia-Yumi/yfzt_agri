import api from './api'
import { User, LoginCredentials, RegisterCredentials } from '@/types/user'

interface AuthResponse {
  user: User
  token: string
}

export const userService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', credentials)
    return res.data
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', credentials)
    return res.data
  },

  async getProfile(): Promise<User> {
    const res = await api.get<User>('/users/me')
    return res.data
  },

  async updateProfile(data: Partial<Pick<User, 'displayName' | 'avatar'>>): Promise<User> {
    const res = await api.patch<User>('/users/me', data)
    return res.data
  },
}
