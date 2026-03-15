function ReminderList() {
  return (
    <div className="reminders-section">
      <div className="section-header">
        <div className="section-header-content">
          <h2 className="section-title">
            <svg className="icon icon-title" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
            </svg>
            Hatırlatıcılar
          </h2>
          <button className="add-button">
            + Yeni Ekle
          </button>
        </div>
      </div>
      
      <div className="reminders-list">
        <div className="empty-state">
          <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <p className="empty-text">Henüz hatırlatıcı eklenmemiş</p>
          <p className="empty-hint">AI asistanınıza "bugün yapmam gerekenler nelerdir?" diye sorabilirsiniz</p>
        </div>
      </div>
    </div>
  )
}

export default ReminderList
