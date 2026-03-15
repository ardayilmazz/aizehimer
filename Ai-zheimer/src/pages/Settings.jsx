import { useState, useEffect } from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Mevcut tema durumunu kontrol et
    const darkMode = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(darkMode)
    
    if (darkMode) {
      document.body.classList.add('dark-mode')
    }
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

  return (
    <>
      <Header showBackButton={true} />
      <main className="main-container">
        <div className="settings-container">
          <h2 className="settings-title">Ayarlar</h2>
          
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
