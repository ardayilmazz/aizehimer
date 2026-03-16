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
      return
    }

    // Kullanıcı tipini uygula
    const userType = storage.get(storageKeys.USER_TYPE) || 'patient'
    if (userType === 'patient') {
      document.body.classList.add('patient-mode')
      document.body.classList.remove('caregiver-mode')
    } else {
      document.body.classList.add('caregiver-mode')
      document.body.classList.remove('patient-mode')
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
      </main>
      <Footer />
    </>
  )
}

export default Dashboard
