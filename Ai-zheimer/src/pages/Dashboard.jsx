import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import StatsGrid from '../components/Stats/StatsGrid'
import ChatContainer from '../components/Chat/ChatContainer'
import ReminderList from '../components/Reminders/ReminderList'
import { storageKeys, storage } from '../utils/storage'

function Dashboard() {
  const navigate = useNavigate()

  useEffect(() => {
    // Kullanıcı giriş kontrolü
    const currentUser = storage.get(storageKeys.CURRENT_USER) || 
                       JSON.parse(sessionStorage.getItem(storageKeys.CURRENT_USER) || 'null')
    
    if (!currentUser) {
      navigate('/')
    }
  }, [navigate])

  return (
    <>
      <Header />
      <main className="main-container">
        <StatsGrid />
        
        <div className="two-column-layout">
          <ChatContainer />
          <ReminderList />
        </div>

        <div className="quick-actions">
          <h2 className="quick-actions-title">Hızlı İşlemler</h2>
          <div className="quick-actions-grid">
            <button className="quick-action-btn quick-action-blue">
              <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
              <p className="quick-action-text">İlaç Ekle</p>
            </button>
            
            <button className="quick-action-btn quick-action-green">
              <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
              <p className="quick-action-text">Hatırlatıcı</p>
            </button>
            
            <button className="quick-action-btn quick-action-purple">
              <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p className="quick-action-text">Not Ekle</p>
            </button>
            
            <button className="quick-action-btn quick-action-orange">
              <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p className="quick-action-text">Takvim</p>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Dashboard
