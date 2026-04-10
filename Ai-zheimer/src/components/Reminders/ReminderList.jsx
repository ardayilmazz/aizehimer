import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { storageKeys, storage } from '../../utils/storage'

function ReminderList() {
  const navigate = useNavigate()
  const [reminders, setReminders] = useState([])
  const [selectedReminder, setSelectedReminder] = useState(null)
  const [userType, setUserType] = useState('patient')

  useEffect(() => {
    loadReminders()
    // Kullanıcı tipini kontrol et
    const savedUserType = storage.get(storageKeys.USER_TYPE) || 'patient'
    setUserType(savedUserType)
    
    // Stats güncellemesi için event dispatch et
    window.dispatchEvent(new Event('reminderUpdated'))
  }, [])

  const loadReminders = () => {
    const remindersData = storage.get(storageKeys.REMINDERS) || { 
      daily: [], 
      weekly: [], 
      monthly: [], 
      yearly: [] 
    }
    
    // Tüm hatırlatıcıları birleştir
    const allReminders = [
      ...remindersData.daily,
      ...remindersData.weekly,
      ...remindersData.monthly,
      ...remindersData.yearly
    ]
    
    // Tarihe göre sırala (en yakın tarih önce)
    allReminders.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return dateA - dateB
    })
    
    setReminders(allReminders)
  }

  const getTitleIcon = (titleType) => {
    const icons = {
      medicine: '💊',
      food: '🍽️',
      appointment: '📅',
      water: '💧',
      custom: '✏️'
    }
    return icons[titleType] || '📌'
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Bugün'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Yarın'
    } else {
      return date.toLocaleDateString('tr-TR', { 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      })
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    return timeString.substring(0, 5) // HH:MM formatı
  }

  const getRecurrenceText = (reminder) => {
    if (!reminder.isRecurring) return 'Tek seferlik'
    
    const types = {
      daily: 'Günde',
      weekly: 'Haftada',
      monthly: 'Ayda'
    }
    
    return `${types[reminder.recurrenceType] || ''} ${reminder.recurrenceCount} kere`
  }

  const getLocationText = (location) => {
    const locations = {
      kitchen: 'Mutfak',
      bathroom: 'Banyo',
      bedroom: 'Yatak Odası'
    }
    return locations[location] || ''
  }

  const handleCardClick = (reminder) => {
    // Hem hasta hem bakıcı modu için modal açılır
    setSelectedReminder(reminder)
  }

  const closeModal = () => {
    setSelectedReminder(null)
  }

  const handleEditReminder = (e, reminderId) => {
    e.stopPropagation()
    navigate(`/edit-reminder/${reminderId}`)
  }

  const handleDeleteReminder = (e, reminderId) => {
    e.stopPropagation() // Card'a tıklama eventini durdur
    
    if (window.confirm('Bu hatırlatıcıyı silmek istediğinize emin misiniz?')) {
      const remindersData = storage.get(storageKeys.REMINDERS) || { 
        daily: [], 
        weekly: [], 
        monthly: [], 
        yearly: [] 
      }
      
      // Tüm listelerden bu ID'ye sahip hatırlatıcıyı kaldır
      remindersData.daily = remindersData.daily.filter(r => r.id !== reminderId)
      remindersData.weekly = remindersData.weekly.filter(r => r.id !== reminderId)
      remindersData.monthly = remindersData.monthly.filter(r => r.id !== reminderId)
      remindersData.yearly = remindersData.yearly.filter(r => r.id !== reminderId)
      
      storage.set(storageKeys.REMINDERS, remindersData)
      
      // Listeyi yeniden yükle
      loadReminders()
      
      // Stats güncellemesi için event dispatch et
      window.dispatchEvent(new Event('reminderUpdated'))
      
      // Eğer silinen hatırlatıcı modal'da açıksa kapat
      if (selectedReminder && selectedReminder.id === reminderId) {
        setSelectedReminder(null)
      }
    }
  }

  const isPatientMode = userType === 'patient'

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
          <button 
            className="add-button"
            onClick={() => navigate('/add-reminder')}
          >
            + Yeni Ekle
          </button>
        </div>
      </div>
      
      <div className="reminders-list">
        {reminders.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <p className="empty-text">Henüz hatırlatıcı eklenmemiş</p>
            <p className="empty-hint">AI asistanınıza "bugün yapmam gerekenler nelerdir?" diye sorabilirsiniz</p>
          </div>
        ) : (
          reminders.map(reminder => (
            <div 
              key={reminder.id} 
              className={`reminder-card reminder-urgency-${reminder.urgency} ${isPatientMode ? 'patient-mode-card' : 'caregiver-mode-card'}`}
              onClick={() => handleCardClick(reminder)}
              style={{ cursor: 'pointer' }}
            >
              <div className="reminder-card-compact">
                <div className="reminder-compact-left">
                  <div className="reminder-compact-icon">
                    <span>{getTitleIcon(reminder.titleType)}</span>
                  </div>
                  <div className="reminder-compact-content">
                    <h3 className="reminder-compact-title">{reminder.title}</h3>
                    {reminder.description && (
                      <p className="reminder-compact-description">{reminder.description}</p>
                    )}
                  </div>
                </div>
                <div className="reminder-compact-right">
                  <div className="reminder-compact-date">{formatDate(reminder.date)}</div>
                  <div className="reminder-card-actions">
                    <button
                      type="button"
                      className="reminder-edit-btn"
                      onClick={(e) => handleEditReminder(e, reminder.id)}
                      title="Hatırlatıcıyı Düzenle"
                    >
                      <svg className="edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      type="button"
                      className="reminder-delete-btn"
                      onClick={(e) => handleDeleteReminder(e, reminder.id)}
                      title="Hatırlatıcıyı Sil"
                    >
                      <svg className="delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detay Modal - Hem Hasta Hem Bakıcı Modu için */}
      {selectedReminder && (
        <div className="reminder-modal-overlay" onClick={closeModal}>
          <div className={`reminder-modal ${isPatientMode ? 'patient-mode-modal' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="reminder-modal-header">
              <h2 className="reminder-modal-title">
                <span className="reminder-modal-title-icon">{getTitleIcon(selectedReminder.titleType)}</span>
                {selectedReminder.title}
              </h2>
              <button className="reminder-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            
            <div className="reminder-modal-body">
              {selectedReminder.description && (
                <div className="reminder-modal-section">
                  <h3 className="reminder-modal-section-title">Açıklama</h3>
                  <p className="reminder-modal-text">{selectedReminder.description}</p>
                </div>
              )}
              
              <div className="reminder-modal-section">
                <h3 className="reminder-modal-section-title">Zaman Bilgileri</h3>
                <div className="reminder-modal-info-grid">
                  <div className="reminder-modal-info-item">
                    <span className="reminder-modal-info-label">📅 Tarih:</span>
                    <span className="reminder-modal-info-value">{formatDate(selectedReminder.date)}</span>
                  </div>
                  <div className="reminder-modal-info-item">
                    <span className="reminder-modal-info-label">🕐 Saat:</span>
                    <span className="reminder-modal-info-value">{formatTime(selectedReminder.time)}</span>
                  </div>
                  <div className="reminder-modal-info-item">
                    <span className="reminder-modal-info-label">🔄 Tekrar:</span>
                    <span className="reminder-modal-info-value">{getRecurrenceText(selectedReminder)}</span>
                  </div>
                </div>
              </div>

              {selectedReminder.location && (
                <div className="reminder-modal-section">
                  <h3 className="reminder-modal-section-title">Konum</h3>
                  <p className="reminder-modal-text">{getLocationText(selectedReminder.location)}</p>
                </div>
              )}

              {selectedReminder.personName && (
                <div className="reminder-modal-section">
                  <h3 className="reminder-modal-section-title">Kişi Bilgileri</h3>
                  <div className="reminder-modal-info-grid">
                    <div className="reminder-modal-info-item">
                      <span className="reminder-modal-info-label">👤 İsim:</span>
                      <span className="reminder-modal-info-value">{selectedReminder.personName}</span>
                    </div>
                    {selectedReminder.personPhone && (
                      <div className="reminder-modal-info-item">
                        <span className="reminder-modal-info-label">📞 Telefon:</span>
                        <span className="reminder-modal-info-value">{selectedReminder.personPhone}</span>
                      </div>
                    )}
                    {selectedReminder.personEmail && (
                      <div className="reminder-modal-info-item">
                        <span className="reminder-modal-info-label">📧 E-posta:</span>
                        <span className="reminder-modal-info-value">{selectedReminder.personEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedReminder.photo && (
                <div className="reminder-modal-section">
                  <h3 className="reminder-modal-section-title">Fotoğraf</h3>
                  <div className="reminder-modal-photo">
                    <img src={selectedReminder.photo} alt="Reminder" />
                  </div>
                </div>
              )}

              <div className="reminder-modal-section">
                <div className={`reminder-modal-urgency-badge urgency-${selectedReminder.urgency}`}>
                  <span>{selectedReminder.urgency === 'red' ? '🔴' : '🟢'}</span>
                  <span>{selectedReminder.urgency === 'red' ? 'Kritik/İlaç' : 'Günlük Aktivite'}</span>
                </div>
              </div>
            </div>

            <div className="reminder-modal-footer">
              <button
                type="button"
                className="reminder-modal-edit-btn"
                onClick={() => {
                  const id = selectedReminder.id
                  closeModal()
                  navigate(`/edit-reminder/${id}`)
                }}
              >
                Düzenle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReminderList
