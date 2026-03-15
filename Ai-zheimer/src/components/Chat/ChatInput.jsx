import { useState } from 'react'

function ChatInput({ onSend }) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message)
      setMessage('')
    }
  }

  return (
    <div className="chat-input-section">
      <div className="chat-input-wrapper">
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
          placeholder="Mesajınızı yazın..." 
          className="chat-input"
        />
        <button onClick={handleSubmit} className="send-button">
          Gönder
        </button>
      </div>
    </div>
  )
}

export default ChatInput
