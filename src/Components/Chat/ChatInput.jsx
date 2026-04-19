import { useState } from 'react'

function ChatInput({ onSend, chatDisabled = false, loading = false }) {
  const [message, setMessage] = useState('')
  const inputLocked = chatDisabled || loading

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputLocked || !message.trim()) return
    onSend?.(message)
    setMessage('')
  }

  const placeholder = chatDisabled
    ? 'AI asistanı şu an kullanılamıyor.'
    : 'Mesajınızı yazın...'

  const buttonLabel = loading ? 'Bekleyin…' : chatDisabled ? 'Devre dışı' : 'Gönder'

  return (
    <div className="chat-input-section">
      <div className="chat-input-wrapper">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          placeholder={placeholder}
          className="chat-input"
          disabled={inputLocked}
          readOnly={chatDisabled}
          aria-busy={loading}
        />
        <button type="button" onClick={handleSubmit} className="send-button" disabled={inputLocked}>
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}

export default ChatInput
