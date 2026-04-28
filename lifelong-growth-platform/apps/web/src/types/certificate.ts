export interface Certificate {
  id: string
  userId: string
  nodeId: string
  graphId: string
  certCode: string
  issuedAt: string
  expiresAt?: string
  issuerName: string
  recipientName: string
  metadata?: Record<string, unknown>
}

export interface CertBadgeProps {
  certificate: Certificate
  size?: 'sm' | 'md' | 'lg'
  showDetail?: boolean
}
