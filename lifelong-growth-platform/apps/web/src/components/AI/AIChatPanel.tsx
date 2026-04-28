import React, { useRef, useEffect, useState } from 'react'
import { useAIChat } from '@/hooks/useAIChat'
import Button from '@/components/Common/Button'

const AIChatPanel: React.FC = () => {
  const { messages, isChatOpen, isStreaming, closeChat, sendMessage, clearSession } = useAIChat()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || isStreaming) return
    sendMessage(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isChatOpen) return null

  return (
    <div className="fixed bottom-24 right-6 w-80 h-[500px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col z-40">
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white text-sm font-medium">终身成长学习顾问</span>
        </div>
        <div className="flex gap-2">
          <button onClick={clearSession} className="text-gray-500 hover:text-gray-300 text-xs">清空</button>
          <button onClick={closeChat} className="text-gray-500 hover:text-gray-300 text-lg leading-none">×</button>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-8">
            <p className="text-2xl mb-2">✨</p>
            <p>你好！我是你的学习顾问</p>
            <p className="text-xs mt-1">问我任何关于跨境电商知识图谱的问题</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] text-xs leading-relaxed px-3 py-2 rounded-xl ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-800 text-gray-200 rounded-bl-sm'
              }`}
            >
              {msg.content}
              {msg.role === 'assistant' && isStreaming && msg.content === '' && (
                <span className="inline-block w-1.5 h-3 bg-gray-400 animate-pulse ml-0.5" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区 */}
      <div className="p-3 border-t border-gray-700 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入问题，Enter 发送..."
          rows={1}
          className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500"
        />
        <Button variant="primary" size="sm" onClick={handleSend} loading={isStreaming} disabled={!input.trim()}>
          发送
        </Button>
      </div>
    </div>
  )
}

export default AIChatPanel
