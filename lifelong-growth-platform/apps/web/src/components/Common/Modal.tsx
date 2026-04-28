import React, { useEffect } from 'react'
import clsx from 'clsx'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={clsx('relative w-full bg-gray-900 border border-gray-700 rounded-xl shadow-2xl', SIZE_CLASSES[size])}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xl leading-none">×</button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export default Modal
