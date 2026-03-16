import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import AddReminder from './pages/AddReminder'
import { storageKeys, storage } from './utils/storage'

function ProtectedRoute({ children }) {
  const currentUser = storage.get(storageKeys.CURRENT_USER) || 
                     JSON.parse(sessionStorage.getItem(storageKeys.CURRENT_USER) || 'null')
  
  return currentUser ? children : <Navigate to="/" replace />
}

function App() {
  useEffect(() => {
    // Kullanıcı tipini default olarak 'patient' yapılandır
    const userType = storage.get(storageKeys.USER_TYPE)
    if (!userType) {
      storage.set(storageKeys.USER_TYPE, 'patient')
      document.body.classList.add('patient-mode')
    } else {
      if (userType === 'patient') {
        document.body.classList.add('patient-mode')
        document.body.classList.remove('caregiver-mode')
      } else {
        document.body.classList.add('caregiver-mode')
        document.body.classList.remove('patient-mode')
      }
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-reminder" 
          element={
            <ProtectedRoute>
              <AddReminder />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
