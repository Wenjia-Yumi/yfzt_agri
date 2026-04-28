// 用户相关类型定义

export enum UserRole {
  STUDENT = 'STUDENT',       // 学习者
  ENTERPRISE = 'ENTERPRISE', // 企业用户
  ADMIN = 'ADMIN',           // 管理员
}

export interface User {
  id: string
  email: string
  displayName: string
  avatar?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface AuthTokenPayload {
  sub: string   // userId
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  displayName: string
}
