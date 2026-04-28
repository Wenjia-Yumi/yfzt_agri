import React from 'react'
import { Certificate } from '@/types/certificate'
import { formatDate } from '@/utils/format'
import clsx from 'clsx'

interface CertBadgeProps {
  certificate: Certificate
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES = {
  sm: 'w-16 h-16 text-xs',
  md: 'w-24 h-24 text-sm',
  lg: 'w-32 h-32 text-base',
}

const CertBadge: React.FC<CertBadgeProps> = ({ certificate, size = 'md' }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={clsx(
          'rounded-full border-4 border-yellow-500 bg-gradient-to-br from-yellow-900/60 to-yellow-600/20',
          'flex items-center justify-center shadow-lg',
          'shadow-yellow-500/30',
          SIZE_CLASSES[size],
        )}
      >
        <span className="text-yellow-400 text-3xl">🏆</span>
      </div>
      <div className="text-center">
        <p className="text-white text-xs font-medium">{certificate.certCode}</p>
        <p className="text-gray-400 text-xs">{formatDate(certificate.issuedAt)}</p>
      </div>
    </div>
  )
}

export default CertBadge
