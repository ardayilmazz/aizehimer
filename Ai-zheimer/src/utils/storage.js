// Storage Keys
export const storageKeys = {
  REMINDERS: 'aizheimer_reminders',
  MEDICATIONS: 'aizheimer_medications',
  NOTES: 'aizheimer_notes',
  USER_PROFILE: 'aizheimer_profile',
  USERS: 'aizheimer_users',
  CURRENT_USER: 'aizheimer_current_user'
};

// Local Storage helper functions
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }
};

// Test kullanıcısı oluştur (eğer yoksa)
export function createDefaultUser() {
  const users = storage.get(storageKeys.USERS) || [];
  
  if (users.length === 0) {
    const defaultUser = {
      email: 'test@aizheimer.com',
      name: 'Test Kullanıcı',
      password: '123456',
      createdAt: new Date().toISOString()
    };
    
    users.push(defaultUser);
    storage.set(storageKeys.USERS, users);
  }
}
