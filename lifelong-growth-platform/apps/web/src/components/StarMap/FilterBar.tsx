import React from 'react'
import { KnowledgeDomain } from '@/types/graph'
import { DOMAIN_CONFIG } from '@lifelong/constants'
import clsx from 'clsx'

interface FilterBarProps {
  activeDomain: KnowledgeDomain | null
  onDomainChange: (domain: KnowledgeDomain | null) => void
}

const FilterBar: React.FC<FilterBarProps> = ({ activeDomain, onDomainChange }) => {
  const domains = Object.entries(DOMAIN_CONFIG).filter(([d]) => d !== 'CORE')

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onDomainChange(null)}
        className={clsx(
          'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
          activeDomain === null
            ? 'bg-white text-gray-900'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200',
        )}
      >
        全部星域
      </button>
      {domains.map(([domain, config]) => (
        <button
          key={domain}
          onClick={() => onDomainChange(domain as KnowledgeDomain)}
          className={clsx(
            'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
            activeDomain === domain ? 'text-gray-900' : 'bg-gray-800 text-gray-400 hover:bg-gray-700',
          )}
          style={activeDomain === domain ? { background: config.color } : undefined}
        >
          {config.icon} {config.label}
        </button>
      ))}
    </div>
  )
}

export default FilterBar
