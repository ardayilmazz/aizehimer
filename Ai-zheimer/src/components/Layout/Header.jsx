import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { storageKeys, storage } from '../../utils/storage'

function Header({ showBackButton = false }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [userName, setUserName] = useState('Kullanıcı')
  const [userInitials, setUserInitials] = useState('KU')
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Kullanıcı bilgilerini yükle
    const currentUser = storage.get(storageKeys.CURRENT_USER) || 
                       JSON.parse(sessionStorage.getItem(storageKeys.CURRENT_USER) || 'null')
    
    if (currentUser) {
      setUserName(currentUser.name || 'Kullanıcı')
      const nameParts = (currentUser.name || 'Kullanıcı').split(' ')
      const initials = nameParts.map(part => part[0]).join('').toUpperCase().slice(0, 2)
      setUserInitials(initials || 'KU')
    }

    // Menü dışına tıklandığında kapat
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    storage.remove(storageKeys.CURRENT_USER)
    sessionStorage.removeItem(storageKeys.CURRENT_USER)
    navigate('/')
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <span>AI</span>
            </div>
            <h1 className="logo-text">AI-Zheimer</h1>
          </div>
          <div className="header-right">
            {showBackButton ? (
              <Link to="/dashboard" className="back-to-dashboard-btn">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span>Dashboard'a Dön</span>
              </Link>
            ) : (
              <div className={`user-menu-container ${userMenuOpen ? 'active' : ''}`} ref={menuRef}>
                <button 
                  className={`user-menu-btn ${userMenuOpen ? 'active' : ''}`}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="user-avatar">
                    <span>{userInitials}</span>
                  </div>
                  <span className="user-name">{userName}</span>
                  <svg 
                    className={`user-menu-icon ${userMenuOpen ? 'active' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div className="user-menu-dropdown">
                  <Link to="/settings" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                    <svg className="menu-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Ayarlar
                  </Link>
                  <button className="user-menu-item" onClick={handleLogout}>
                    <svg className="menu-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
