import React from 'react'
import { useAIChat } from '@/hooks/useAIChat'
import clsx from 'clsx'

const AIFloatingButton: React.FC = () => {
  const { isChatOpen, openChat, closeChat } = useAIChat()

  return (
    <button
      onClick={isChatOpen ? closeChat : openChat}
      className={clsx(
        'fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-200',
        'flex items-center justify-center text-2xl z-50',
        'hover:scale-110 active:scale-95',
        isChatOpen
          ? 'bg-gray-700 border-2 border-gray-500'
          : 'bg-gradient-to-br from-blue-600 to-purple-600 border-2 border-blue-400',
      )}
      aria-label={isChatOpen ? '关闭 AI 对话' : '打开 AI 学习顾问'}
    >
      {isChatOpen ? '×' : '✨'}
    </button>
  )
}

export default AIFloatingButton
