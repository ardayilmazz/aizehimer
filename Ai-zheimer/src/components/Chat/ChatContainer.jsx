import { useState } from 'react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

function ChatContainer() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: 'Merhaba! Ben AI-Zheimer asistanınızım. Size nasıl yardımcı olabilirim? İlaçlarınızı, hatırlatmalarınızı ve notlarınızı ekleyebilirsiniz.'
    }
  ])

  const handleSendMessage = (text) => {
    if (!text.trim()) return
    
    // Kullanıcı mesajını ekle
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text.trim()
    }
    
    setMessages(prev => [...prev, userMessage])
    
    // AI yanıtı simüle et (ileride Gemini API ile değiştirilecek)
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Mesajınızı aldım. Bu özellik yakında aktif olacak!'
      }
      setMessages(prev => [...prev, aiMessage])
    }, 500)
  }

  return (
    <div className="chat-section">
      <div className="section-header">
        <h2 className="section-title">
          <svg className="icon icon-title" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          AI Asistan
        </h2>
      </div>
      
      <div className="chat-container">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      
      <ChatInput onSend={handleSendMessage} />
    </div>
  )
}

export default ChatContainer
