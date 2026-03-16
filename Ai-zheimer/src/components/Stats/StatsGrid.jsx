import { useState, useEffect } from 'react'
import StatCard from './StatCard'
import { storageKeys, storage } from '../../utils/storage'

function StatsGrid() {
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    medications: 0,
    totalReminders: 0
  })

  useEffect(() => {
    // İstatistikleri hesapla
    const reminders = storage.get(storageKeys.REMINDERS) || { daily: [], weekly: [], monthly: [], yearly: [] }
    
    // Tüm hatırlatıcıları birleştir
    const allReminders = [
      ...(reminders.daily || []),
      ...(reminders.weekly || []),
      ...(reminders.monthly || []),
      ...(reminders.yearly || [])
    ]
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Bugün için hatırlatıcılar (tüm listelerden kontrol et)
    const todayReminders = allReminders.filter(r => {
      if (!r.date) return false
      const reminderDate = new Date(r.date)
      reminderDate.setHours(0, 0, 0, 0)
      return reminderDate.getTime() === today.getTime()
    })
    
    // Bu hafta için hatırlatıcılar
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    weekStart.setHours(0, 0, 0, 0)
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)
    
    const weekReminders = allReminders.filter(r => {
      if (!r.date) return false
      const reminderDate = new Date(r.date)
      reminderDate.setHours(0, 0, 0, 0)
      return reminderDate >= weekStart && reminderDate <= weekEnd
    })
    
    // İlaçlar (hatırlatıcılardan medicine tipini filtrele)
    const medications = allReminders.filter(r => r.titleType === 'medicine')
    
    // Toplam hatırlatıcı sayısı
    const totalReminders = allReminders.length
    
    setStats({
      today: todayReminders.length,
      week: weekReminders.length,
      medications: medications.length,
      totalReminders: totalReminders
    })
  }, [])
  
  // ReminderList'ten güncelleme için event listener ekle
  useEffect(() => {
    const calculateStats = () => {
      const reminders = storage.get(storageKeys.REMINDERS) || { daily: [], weekly: [], monthly: [], yearly: [] }
      
      const allReminders = [
        ...(reminders.daily || []),
        ...(reminders.weekly || []),
        ...(reminders.monthly || []),
        ...(reminders.yearly || [])
      ]
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const todayReminders = allReminders.filter(r => {
        if (!r.date) return false
        const reminderDate = new Date(r.date)
        reminderDate.setHours(0, 0, 0, 0)
        return reminderDate.getTime() === today.getTime()
      })
      
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      weekStart.setHours(0, 0, 0, 0)
      
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)
      
      const weekReminders = allReminders.filter(r => {
        if (!r.date) return false
        const reminderDate = new Date(r.date)
        reminderDate.setHours(0, 0, 0, 0)
        return reminderDate >= weekStart && reminderDate <= weekEnd
      })
      
      const medications = allReminders.filter(r => r.titleType === 'medicine')
      const totalReminders = allReminders.length
      
      setStats({
        today: todayReminders.length,
        week: weekReminders.length,
        medications: medications.length,
        totalReminders: totalReminders
      })
    }
    
    // Storage değişikliklerini dinle (farklı tab'ler için)
    window.addEventListener('storage', calculateStats)
    
    // Custom event için listener (aynı tab'de değişiklikler için)
    const handleReminderUpdate = () => {
      calculateStats()
    }
    
    window.addEventListener('reminderUpdated', handleReminderUpdate)
    
    // Periyodik kontrol (her 2 saniyede bir)
    const interval = setInterval(calculateStats, 2000)
    
    return () => {
      window.removeEventListener('storage', calculateStats)
      window.removeEventListener('reminderUpdated', handleReminderUpdate)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="stats-grid">
      <StatCard
        label="Bugün"
        value={stats.today}
        colorClass="stat-blue"
        icon={
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        }
      />
      <StatCard
        label="Bu Hafta"
        value={stats.week}
        colorClass="stat-green"
        icon={
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        }
      />
      <StatCard
        label="Hatırlatıcılar"
        value={stats.totalReminders}
        colorClass="stat-orange"
        icon={
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
          </svg>
        }
      />
      <StatCard
        label="İlaçlar"
        value={stats.medications}
        colorClass="stat-purple"
        icon={
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
          </svg>
        }
      />
    </div>
  )
}

export default StatsGrid
