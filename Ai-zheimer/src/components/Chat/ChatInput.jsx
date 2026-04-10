import { useState } from 'react'

function ChatInput({ onSend, disabled = false }) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (disabled || !message.trim()) return
    onSend(message)
    setMessage('')
  }

  return (
    <div className="chat-input-section">
      <div className="chat-input-wrapper">
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          placeholder="Mesajınızı yazın..." 
          className="chat-input"
          disabled={disabled}
          aria-busy={disabled}
        />
        <button type="button" onClick={handleSubmit} className="send-button" disabled={disabled}>
          {disabled ? 'Bekleyin…' : 'Gönder'}
        </button>
      </div>
    </div>
  )
}

export default ChatInput
