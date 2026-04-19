function ChatMessage({ message }) {
  return (
    <div className="chat-message">
      <div className="chat-avatar">
        <span>{message.type === 'ai' ? 'AI' : 'KU'}</span>
      </div>
      <div className={`chat-bubble ${message.type === 'ai' ? 'chat-bubble-ai' : ''}`}>
        {message.isTyping ? (
          <p className="chat-typing" aria-live="polite">
            <span className="chat-typing-dot" />
            <span className="chat-typing-dot" />
            <span className="chat-typing-dot" />
          </p>
        ) : (
          <p>{message.text}</p>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
