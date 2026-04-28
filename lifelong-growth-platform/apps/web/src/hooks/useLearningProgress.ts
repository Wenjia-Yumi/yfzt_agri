import { useEffect } from 'react'
import { useLearningStore } from '@/stores/learningStore'

export function useLearningProgress(graphId: string) {
  const { progress, isLoading, fetchProgress } = useLearningStore()

  useEffect(() => {
    fetchProgress(graphId)
  }, [graphId])

  return { progress, isLoading }
}
