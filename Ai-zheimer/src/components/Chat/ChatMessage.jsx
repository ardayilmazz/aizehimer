function ChatMessage({ message }) {
  return (
    <div className="chat-message">
      <div className="chat-avatar">
        <span>{message.type === 'ai' ? 'AI' : 'KU'}</span>
      </div>
      <div className={`chat-bubble ${message.type === 'ai' ? 'chat-bubble-ai' : ''}`}>
        <p>{message.text}</p>
      </div>
    </div>
  )
}

export default ChatMessage
