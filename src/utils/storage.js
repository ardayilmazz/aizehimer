/** @typedef {import('../Interfaces/reminder.js').RemindersByBucket} RemindersByBucket */
/** @typedef {import('../Interfaces/reminder.js').Reminder} Reminder */

// Storage Keys
export const storageKeys = {
  REMINDERS: 'aizheimer_reminders',
  MEDICATIONS: 'aizheimer_medications',
  NOTES: 'aizheimer_notes',
  USER_PROFILE: 'aizheimer_profile',
  USERS: 'aizheimer_users',
  CURRENT_USER: 'aizheimer_current_user',
  USER_TYPE: 'aizheimer_user_type' // 'patient' veya 'caregiver'
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

const REMINDER_BUCKETS = ['daily', 'weekly', 'monthly', 'yearly'];

/** @returns {RemindersByBucket} */
export function getRemindersBuckets() {
  return storage.get(storageKeys.REMINDERS) || {
    daily: [],
    weekly: [],
    monthly: [],
    yearly: []
  };
}

/** @param {RemindersByBucket} reminders @returns {{ bucket: string, index: number, reminder: Reminder } | null} */
export function findReminderInBuckets(reminders, id) {
  const target = Number(id);
  if (Number.isNaN(target)) return null;
  for (const bucket of REMINDER_BUCKETS) {
    const index = reminders[bucket].findIndex((r) => Number(r.id) === target);
    if (index !== -1) {
      return { bucket, index, reminder: reminders[bucket][index] };
    }
  }
  return null;
}

/** @param {RemindersByBucket} reminders @returns {RemindersByBucket} */
export function removeReminderFromAllBuckets(reminders, id) {
  const target = Number(id);
  return {
    daily: reminders.daily.filter((r) => Number(r.id) !== target),
    weekly: reminders.weekly.filter((r) => Number(r.id) !== target),
    monthly: reminders.monthly.filter((r) => Number(r.id) !== target),
    yearly: reminders.yearly.filter((r) => Number(r.id) !== target)
  };
}

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
