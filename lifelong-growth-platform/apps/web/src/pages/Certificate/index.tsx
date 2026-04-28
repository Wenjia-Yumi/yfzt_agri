import React, { useEffect, useState } from 'react'
import CertBadge from '@/components/Certificate/CertBadge'
import Loading from '@/components/Common/Loading'
import { certService } from '@/services/certService'
import { Certificate } from '@/types/certificate'

const CertificatePage: React.FC = () => {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    certService.getMyCertificates().then(setCerts).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading text="加载证书..." />

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">🏆 我的证书</h1>
      {certs.length === 0 ? (
        <p className="text-gray-400">完成节点学习后可获得证书</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {certs.map((cert) => <CertBadge key={cert.id} certificate={cert} size="lg" />)}
        </div>
      )}
    </div>
  )
}

export default CertificatePage
