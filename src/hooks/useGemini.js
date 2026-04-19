import { useState, useCallback } from 'react'
import { generateChatReply, mapGeminiError } from '../services/geminiApi.js'

export function useGemini() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const clearError = useCallback(() => setError(null), [])

  const sendChatMessage = useCallback(async (messages) => {
    setError(null)
    setLoading(true)
    try {
      const text = await generateChatReply({ messages })
      return text
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error('[Gemini]', e)
      }
      const msg = mapGeminiError(e)
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, clearError, sendChatMessage }
}
