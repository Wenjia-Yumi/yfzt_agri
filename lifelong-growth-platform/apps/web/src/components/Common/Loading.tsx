import React from 'react'

interface LoadingProps {
  text?: string
  fullScreen?: boolean
}

const Loading: React.FC<LoadingProps> = ({ text = '加载中...', fullScreen = true }) => {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/30" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
      </div>
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return <div className="flex items-center justify-center p-8">{content}</div>
}

export default Loading
