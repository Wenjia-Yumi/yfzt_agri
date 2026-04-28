export { UserRole } from '@lifelong/types'
export type { User, AuthTokenPayload, LoginCredentials, RegisterCredentials } from '@lifelong/types'

export interface AuthState {
  user: import('@lifelong/types').User | null
  token: string | null
  isAuthenticated: boolean
}
