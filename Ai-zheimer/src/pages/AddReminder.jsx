import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../Components/Layout/Header'
import Footer from '../Components/Layout/Footer'
import {
  storageKeys,
  storage,
  getRemindersBuckets,
  findReminderInBuckets,
  removeReminderFromAllBuckets
} from '../utils/storage'

/** @typedef {import('../Interfaces/reminder.js').ReminderFormFields} ReminderFormFields */

const emptyForm = () => ({
  title: '',
  titleType: '',
  description: '',
  isRecurring: false,
  recurrenceType: '',
  recurrenceCount: 1,
  date: '',
  time: '',
  photo: null,
  personName: '',
  personPhone: '',
  personEmail: '',
  location: '',
  urgency: 'green'
})

function reminderToForm(reminder) {
  const time =
    reminder.time && reminder.time.length >= 5
      ? reminder.time.substring(0, 5)
      : reminder.time || ''
  return {
    title: reminder.title ?? '',
    titleType: reminder.titleType ?? '',
    description: reminder.description ?? '',
    isRecurring: Boolean(reminder.isRecurring),
    recurrenceType: reminder.recurrenceType ?? '',
    recurrenceCount: reminder.recurrenceCount ?? 1,
    date: reminder.date ?? '',
    time,
    photo: reminder.photo ?? null,
    personName: reminder.personName ?? '',
    personPhone: reminder.personPhone ?? '',
    personEmail: reminder.personEmail ?? '',
    location: reminder.location ?? '',
    urgency: reminder.urgency === 'red' ? 'red' : 'green'
  }
}

function AddReminder() {
  const navigate = useNavigate()
  const { id: paramId } = useParams()
  const isEditMode = Boolean(paramId)

  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    if (!isEditMode) {
      setFormData(emptyForm())
      return
    }
    const buckets = getRemindersBuckets()
    const found = findReminderInBuckets(buckets, paramId)
    if (!found) {
      navigate('/dashboard', { replace: true })
      return
    }
    setFormData(reminderToForm(found.reminder))
  }, [isEditMode, paramId, navigate])

  const titleOptions = [
    { value: 'medicine', label: 'İlaç', icon: '💊' },
    { value: 'food', label: 'Yemek', icon: '🍽️' },
    { value: 'appointment', label: 'Randevu', icon: '📅' },
    { value: 'water', label: 'Su', icon: '💧' },
    { value: 'custom', label: 'Özel', icon: '✏️' }
  ]

  const locationOptions = [
    { value: 'kitchen', label: 'Mutfak' },
    { value: 'bathroom', label: 'Banyo' },
    { value: 'bedroom', label: 'Yatak Odası' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    let reminders = getRemindersBuckets()
    let reminderId
    let createdAt

    if (isEditMode) {
      const found = findReminderInBuckets(reminders, paramId)
      if (!found) {
        navigate('/dashboard', { replace: true })
        return
      }
      reminderId = found.reminder.id
      createdAt = found.reminder.createdAt
      reminders = removeReminderFromAllBuckets(reminders, reminderId)
    } else {
      reminderId = Date.now()
      createdAt = new Date().toISOString()
    }

    const newReminder = {
      id: reminderId,
      ...formData,
      createdAt
    }

    if (formData.isRecurring) {
      if (formData.recurrenceType === 'daily') {
        reminders.daily.push(newReminder)
      } else if (formData.recurrenceType === 'weekly') {
        reminders.weekly.push(newReminder)
      } else if (formData.recurrenceType === 'monthly') {
        reminders.monthly.push(newReminder)
      }
    } else {
      reminders.yearly.push(newReminder)
    }

    storage.set(storageKeys.REMINDERS, reminders)

    window.dispatchEvent(new Event('reminderUpdated'))

    navigate('/dashboard')
  }

  return (
    <>
      <Header showBackButton={true} />
      <main className="main-container">
        <div className="add-reminder-container">
          <h2 className="add-reminder-title">
            {isEditMode ? 'Hatırlatıcıyı Düzenle' : 'Yeni Hatırlatıcı Ekle'}
          </h2>
          
          <form onSubmit={handleSubmit} className="reminder-form">
            {/* Hatırlatıcı Başlığı */}
            <div className="form-section">
              <label className="form-section-label">Hatırlatıcı Başlığı</label>
              <div className="title-options-grid">
                {titleOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      handleInputChange('titleType', option.value)
                      if (option.value !== 'custom') {
                        handleInputChange('title', option.label)
                      }
                    }}
                    className={`title-option-btn ${formData.titleType === option.value ? 'active' : ''}`}
                  >
                    <span className="title-option-icon">{option.icon}</span>
                    <span className="title-option-label">{option.label}</span>
                  </button>
                ))}
              </div>
              {(formData.titleType === 'custom' || formData.titleType === '') && (
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Hatırlatıcı başlığını yazın..."
                  className="form-input"
                  required
                />
              )}
              
              {/* Açıklama Bölümü */}
              <label className="form-section-label" style={{ marginTop: '1.5rem' }}>Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="İlaç ismini veya hatırlaması gereken şeyin detayını yazın... (Örn: Aspirin 100mg, Doktor Ahmet Yılmaz ile randevu)"
                className="form-textarea"
                rows="4"
              />
            </div>

            {/* Zaman Seçici */}
            <div className="form-section">
              <label className="form-section-label">Zaman</label>
              
              {/* Tekrarlı/Tek Seferlik */}
              <div className="recurrence-toggle">
                <button
                  type="button"
                  onClick={() => handleInputChange('isRecurring', false)}
                  className={`toggle-btn ${!formData.isRecurring ? 'active' : ''}`}
                >
                  Tek Seferlik
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('isRecurring', true)}
                  className={`toggle-btn ${formData.isRecurring ? 'active' : ''}`}
                >
                  Tekrarlı
                </button>
              </div>

              {/* Tekrarlı Seçenekleri */}
              {formData.isRecurring && (
                <div className="recurrence-options">
                  <select
                    value={formData.recurrenceType}
                    onChange={(e) => handleInputChange('recurrenceType', e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">Tekrar tipi seçin</option>
                    <option value="daily">Günde</option>
                    <option value="weekly">Haftada</option>
                    <option value="monthly">Ayda</option>
                  </select>
                  {formData.recurrenceType && (
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.recurrenceCount}
                      onChange={(e) => handleInputChange('recurrenceCount', parseInt(e.target.value))}
                      className="form-input recurrence-count"
                      placeholder="Kaç kere?"
                      required
                    />
                  )}
                </div>
              )}

              {/* Tarih ve Saat */}
              <div className="datetime-group">
                <div className="datetime-item">
                  <label className="datetime-label">Tarih</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="form-input datetime-input"
                    required
                  />
                </div>
                <div className="datetime-item">
                  <label className="datetime-label">Saat</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="form-input datetime-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Fotoğraf Ekleme */}
            <div className="form-section">
              <label className="form-section-label">Fotoğraf Ekle (Neyi hatırlamalıyım?)</label>
              <div className="photo-upload-area">
                {formData.photo ? (
                  <div className="photo-preview">
                    <img src={formData.photo} alt="Preview" />
                    <button
                      type="button"
                      onClick={() => handleInputChange('photo', null)}
                      className="remove-photo-btn"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="photo-upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="photo-input"
                    />
                    <span className="photo-upload-text">📷 Fotoğraf Seç</span>
                  </label>
                )}
              </div>
            </div>

            {/* Kişi Bağlantısı - Sadece Randevu için */}
            {formData.titleType === 'appointment' && (
              <div className="form-section">
                <label className="form-section-label">Bu kiminle ilgili?</label>
                <input
                  type="text"
                  value={formData.personName}
                  onChange={(e) => handleInputChange('personName', e.target.value)}
                  placeholder="İsim Soyisim"
                  className="form-input"
                />
                <input
                  type="tel"
                  value={formData.personPhone}
                  onChange={(e) => handleInputChange('personPhone', e.target.value)}
                  placeholder="Telefon Numarası"
                  className="form-input"
                />
                <input
                  type="email"
                  value={formData.personEmail}
                  onChange={(e) => handleInputChange('personEmail', e.target.value)}
                  placeholder="E-posta"
                  className="form-input"
                />
              </div>
            )}

            {/* Konum/Oda Seçimi */}
            <div className="form-section">
              <label className="form-section-label">Konum/Oda</label>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="form-select"
              >
                <option value="">Konum seçin</option>
                {locationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Aciliyet Rengi */}
            <div className="form-section">
              <label className="form-section-label">Önem Derecesi</label>
              <div className="urgency-options">
                <button
                  type="button"
                  onClick={() => handleInputChange('urgency', 'red')}
                  className={`urgency-btn urgency-red ${formData.urgency === 'red' ? 'active' : ''}`}
                >
                  🔴 Kritik/İlaç
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('urgency', 'green')}
                  className={`urgency-btn urgency-green ${formData.urgency === 'green' ? 'active' : ''}`}
                >
                  🟢 Günlük Aktivite
                </button>
              </div>
            </div>

            {/* Form Butonları */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="form-btn form-btn-cancel"
              >
                İptal
              </button>
              <button
                type="submit"
                className="form-btn form-btn-submit"
              >
                {isEditMode ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default AddReminder
