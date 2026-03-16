// AI-Zheimer App - JavaScript

// Local Storage yapısı için hazırlık
const storageKeys = {
    REMINDERS: 'aizheimer_reminders',
    MEDICATIONS: 'aizheimer_medications',
    NOTES: 'aizheimer_notes',
    USER_PROFILE: 'aizheimer_profile',
    USERS: 'aizheimer_users',
    CURRENT_USER: 'aizheimer_current_user'
};

// Varsayılan test kullanıcısı oluştur
function createDefaultUser() {
    const users = JSON.parse(localStorage.getItem(storageKeys.USERS) || '[]');
    
    // Eğer hiç kullanıcı yoksa varsayılan kullanıcı oluştur
    if (users.length === 0) {
        const defaultUser = {
            email: 'test@aizheimer.com',
            name: 'Test Kullanıcı',
            password: '123456',
            createdAt: new Date().toISOString()
        };
        
        users.push(defaultUser);
        localStorage.setItem(storageKeys.USERS, JSON.stringify(users));
        
        console.log('Varsayılan kullanıcı oluşturuldu:');
        console.log('E-posta: test@aizheimer.com');
        console.log('Şifre: 123456');
    }
}

// Temel fonksiyonlar
function initApp() {
    console.log('AI-Zheimer uygulaması başlatılıyor...');
    
    // Varsayılan kullanıcıyı oluştur
    createDefaultUser();
    
    // Giriş sayfası kontrolü
    const loginForm = document.getElementById('loginForm');
    const registerBtn = document.getElementById('registerBtn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', handleRegister);
    }
    
    // Dashboard sayfası kontrolü
    if (window.location.pathname.includes('dashboard')) {
        checkAuth();
        initDashboard();
    }
    
    // Ayarlar sayfası kontrolü
    if (window.location.pathname.includes('settings')) {
        checkAuth();
        initSettings();
    }
}

// Dashboard başlatma
function initDashboard() {
    // Kullanıcı bilgilerini göster
    displayUserInfo();
    
    // Kullanıcı menüsü
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const container = userMenuBtn.closest('.user-menu-container');
            container.classList.toggle('active');
        });
    }
    
    // Menü dışına tıklandığında kapat
    document.addEventListener('click', (e) => {
        const container = document.querySelector('.user-menu-container');
        if (container && !container.contains(e.target)) {
            container.classList.remove('active');
        }
    });
    
    // Çıkış yap butonu
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Ayarlar sayfası başlatma
function initSettings() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        // Mevcut tema durumunu kontrol et
        const isDarkMode = document.body.classList.contains('dark-mode');
        updateThemeToggleIcon(themeToggle, isDarkMode);
        
        themeToggle.addEventListener('click', () => {
            toggleDarkMode();
            const isDark = document.body.classList.contains('dark-mode');
            updateThemeToggleIcon(themeToggle, isDark);
        });
    }
}

// Kullanıcı bilgilerini göster
function displayUserInfo() {
    const currentUser = localStorage.getItem(storageKeys.CURRENT_USER) || 
                       sessionStorage.getItem(storageKeys.CURRENT_USER);
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        const userNameEl = document.getElementById('userName');
        const userInitialsEl = document.getElementById('userInitials');
        
        if (userNameEl) {
            userNameEl.textContent = user.name || 'Kullanıcı';
        }
        
        if (userInitialsEl) {
            // İsim ve soyisim baş harflerini al
            const nameParts = (user.name || 'Kullanıcı').split(' ');
            const initials = nameParts.map(part => part[0]).join('').toUpperCase().slice(0, 2);
            userInitialsEl.textContent = initials || 'KU';
        }
    }
}

// Çıkış yap
function handleLogout() {
    // Kullanıcı oturumunu temizle
    localStorage.removeItem(storageKeys.CURRENT_USER);
    sessionStorage.removeItem(storageKeys.CURRENT_USER);
    
    // Giriş sayfasına yönlendir
    window.location.href = 'index.html';
}

// Koyu mod toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Tema toggle ikonunu güncelle
function updateThemeToggleIcon(button, isDarkMode) {
    const icon = button.querySelector('.icon');
    if (icon) {
        if (isDarkMode) {
            // Güneş ikonu (koyu moddan çıkış)
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
        } else {
            // Ay ikonu (koyu moda geçiş)
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>';
        }
    }
}

// Sayfa yüklendiğinde koyu mod kontrolü
function checkDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
}

// Giriş işlemi
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Basit validasyon
    if (!email || !password) {
        alert('Lütfen tüm alanları doldurun.');
        return;
    }
    
    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Lütfen geçerli bir e-posta adresi girin.');
        return;
    }
    
    // Local Storage'dan kullanıcıları kontrol et
    const users = JSON.parse(localStorage.getItem(storageKeys.USERS) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Giriş başarılı
        // Kullanıcı bilgisini sakla
        if (rememberMe) {
            localStorage.setItem(storageKeys.CURRENT_USER, JSON.stringify({
                email: user.email,
                name: user.name
            }));
        } else {
            sessionStorage.setItem(storageKeys.CURRENT_USER, JSON.stringify({
                email: user.email,
                name: user.name
            }));
        }
        
        // Dashboard'a yönlendir
        window.location.href = 'dashboard.html';
    } else {
        // Giriş başarısız
        alert('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
    }
}

// Kayıt işlemi
function handleRegister() {
    // Şimdilik basit bir alert göster
    // İleride kayıt sayfasına yönlendirilebilir
    const email = prompt('E-posta adresinizi girin:');
    if (!email) return;
    
    const name = prompt('Adınızı girin:');
    if (!name) return;
    
    const password = prompt('Şifrenizi girin:');
    if (!password) return;
    
    // Kullanıcıları al
    const users = JSON.parse(localStorage.getItem(storageKeys.USERS) || '[]');
    
    // Email kontrolü
    if (users.find(u => u.email === email)) {
        alert('Bu e-posta adresi zaten kayıtlı.');
        return;
    }
    
    // Yeni kullanıcı ekle
    const newUser = {
        email: email,
        name: name,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem(storageKeys.USERS, JSON.stringify(users));
    
    alert('Kayıt başarılı! Giriş yapabilirsiniz.');
    
    // Form alanlarını doldur
    document.getElementById('email').value = email;
    document.getElementById('password').focus();
}

// Yetkilendirme kontrolü
function checkAuth() {
    const currentUser = localStorage.getItem(storageKeys.CURRENT_USER) || 
                       sessionStorage.getItem(storageKeys.CURRENT_USER);
    
    if (!currentUser) {
        // Giriş yapılmamış, giriş sayfasına yönlendir
        window.location.href = 'index.html';
    }
}

// Sayfa yüklendiğinde çalışacak
document.addEventListener('DOMContentLoaded', () => {
    checkDarkMode();
    initApp();
});