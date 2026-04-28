import api from './api'
import { Certificate } from '@/types/certificate'

export const certService = {
  async getMyCertificates(): Promise<Certificate[]> {
    const res = await api.get<Certificate[]>('/certificate')
    return res.data
  },

  async issueCertificate(nodeId: string): Promise<Certificate> {
    const res = await api.post<Certificate>('/certificate/issue', { nodeId })
    return res.data
  },

  async verifyCertificate(certCode: string): Promise<Certificate> {
    const res = await api.get<Certificate>(`/certificate/verify/${certCode}`)
    return res.data
  },
}
