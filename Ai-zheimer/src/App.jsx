import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import { storageKeys, storage } from './utils/storage'

function ProtectedRoute({ children }) {
  const currentUser = storage.get(storageKeys.CURRENT_USER) || 
                     JSON.parse(sessionStorage.getItem(storageKeys.CURRENT_USER) || 'null')
  
  return currentUser ? children : <Navigate to="/" replace />
}

function App() {
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
