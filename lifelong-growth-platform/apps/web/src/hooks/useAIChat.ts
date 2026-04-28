import { useCallback } from 'react'
import { useAIStore } from '@/stores/aiStore'
import { aiService } from '@/services/aiService'

export function useAIChat() {
  const {
    session,
    isChatOpen,
    isStreaming,
    openChat,
    closeChat,
    addMessage,
    updateLastAssistantMessage,
    setStreaming,
    clearSession,
  } = useAIStore()

  const sendMessage = useCallback(
    async (content: string) => {
      if (isStreaming || !content.trim()) return

      addMessage('user', content)
      addMessage('assistant', '')
      setStreaming(true)

      try {
        await aiService.streamChat(
          { content, sessionId: session?.id },
          (delta) => updateLastAssistantMessage(delta),
          () => setStreaming(false),
        )
      } catch (err) {
        updateLastAssistantMessage('\n\n[发生错误，请重试]')
        setStreaming(false)
      }
    },
    [isStreaming, session?.id],
  )

  return {
    messages: session?.messages ?? [],
    isChatOpen,
    isStreaming,
    openChat,
    closeChat,
    sendMessage,
    clearSession,
  }
}
