import { useState, useEffect } from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import { storageKeys, storage } from '../utils/storage'

function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [userType, setUserType] = useState('patient') // 'patient' veya 'caregiver'

  useEffect(() => {
    // Mevcut tema durumunu kontrol et
    const darkMode = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(darkMode)
    
    if (darkMode) {
      document.body.classList.add('dark-mode')
    }

    // Kullanıcı tipini yükle (default: patient)
    const savedUserType = storage.get(storageKeys.USER_TYPE) || 'patient'
    setUserType(savedUserType)
    applyUserType(savedUserType)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    document.body.classList.toggle('dark-mode', newDarkMode)
    localStorage.setItem('darkMode', newDarkMode)
    
    // İkonu güncelle
    updateThemeIcon(newDarkMode)
  }

  const updateThemeIcon = (isDark) => {
    // İkon güncellemesi için gerekirse burada yapılabilir
  }

  const applyUserType = (type) => {
    if (type === 'patient') {
      document.body.classList.add('patient-mode')
      document.body.classList.remove('caregiver-mode')
    } else {
      document.body.classList.add('caregiver-mode')
      document.body.classList.remove('patient-mode')
    }
  }

  const handleUserTypeChange = (type) => {
    setUserType(type)
    storage.set(storageKeys.USER_TYPE, type)
    applyUserType(type)
  }

  return (
    <>
      <Header showBackButton={true} />
      <main className="main-container">
        <div className="settings-container">
          <h2 className="settings-title">Ayarlar</h2>
          
          <div className="settings-section">
            <h3 className="settings-section-title">Kullanıcı Tipi</h3>
            <div className="settings-item">
              <div className="settings-item-content">
                <div className="settings-item-info">
                  <h4 className="settings-item-title">Ben Kimim?</h4>
                  <p className="settings-item-description">Kullanıcı tipinizi seçin</p>
                </div>
                <div className="user-type-selector">
                  <button
                    onClick={() => handleUserTypeChange('patient')}
                    className={`user-type-btn ${userType === 'patient' ? 'active' : ''}`}
                  >
                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>Hasta</span>
                  </button>
                  <button
                    onClick={() => handleUserTypeChange('caregiver')}
                    className={`user-type-btn ${userType === 'caregiver' ? 'active' : ''}`}
                  >
                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <span>Bakıcı</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="settings-section-title">Görünüm</h3>
            <div className="settings-item">
              <div className="settings-item-content">
                <div className="settings-item-info">
                  <h4 className="settings-item-title">Koyu Mod</h4>
                  <p className="settings-item-description">Arayüzü koyu temaya geçir</p>
                </div>
                <button 
                  onClick={toggleDarkMode}
                  className="theme-toggle-switch"
                >
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isDarkMode ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Settings
