import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import Settings from './Pages/Settings'
import AddReminder from './Pages/AddReminder'
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
        <Route 
          path="/edit-reminder/:id" 
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
