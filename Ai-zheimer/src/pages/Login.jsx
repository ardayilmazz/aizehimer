import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { storageKeys, storage, createDefaultUser } from '../utils/storage'

function Login() {
  useEffect(() => {
    // Test kullanıcısını oluştur
    createDefaultUser()
  }, [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      alert('Lütfen tüm alanları doldurun.')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert('Lütfen geçerli bir e-posta adresi girin.')
      return
    }
    
    const users = storage.get(storageKeys.USERS) || []
    const user = users.find(u => u.email === email && u.password === password)
    
    if (user) {
      const userData = {
        email: user.email,
        name: user.name
      }
      
      if (rememberMe) {
        storage.set(storageKeys.CURRENT_USER, userData)
      } else {
        sessionStorage.setItem(storageKeys.CURRENT_USER, JSON.stringify(userData))
      }
      
      navigate('/dashboard')
    } else {
      alert('E-posta veya şifre hatalı. Lütfen tekrar deneyin.')
    }
  }

  const handleRegister = () => {
    const email = prompt('E-posta adresinizi girin:')
    if (!email) return
    
    const name = prompt('Adınızı girin:')
    if (!name) return
    
    const password = prompt('Şifrenizi girin:')
    if (!password) return
    
    const users = storage.get(storageKeys.USERS) || []
    
    if (users.find(u => u.email === email)) {
      alert('Bu e-posta adresi zaten kayıtlı.')
      return
    }
    
    const newUser = {
      email: email,
      name: name,
      password: password,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    storage.set(storageKeys.USERS, users)
    
    alert('Kayıt başarılı! Giriş yapabilirsiniz.')
    setEmail(email)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon-large">
            <span>AI</span>
          </div>
          <h1 className="login-title">AI-Zheimer</h1>
          <p className="login-subtitle">Akıllı Hatırlatıcı Asistan</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
              </svg>
              E-posta
            </label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input" 
              placeholder="ornek@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Şifre
            </label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input" 
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                id="rememberMe" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-text">Beni hatırla</span>
            </label>
            <a href="#" className="forgot-password">Şifremi unuttum</a>
          </div>

          <button type="submit" className="login-button">
            Giriş Yap
          </button>
        </form>

        <div className="divider">
          <span>veya</span>
        </div>

        <div className="register-section">
          <p className="register-text">Hesabınız yok mu?</p>
          <button type="button" onClick={handleRegister} className="register-button">
            Kayıt Ol
          </button>
        </div>
      </div>

      <footer className="login-footer">
        <p className="footer-text">
          © 2025 AI-Zheimer - Akıllı Hatırlatıcı Asistan | Staj Projesi
        </p>
      </footer>
    </div>
  )
}

export default Login
