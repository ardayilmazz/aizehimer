import { useState, useEffect } from 'react'
import StatCard from './StatCard'
import { storageKeys, storage } from '../../utils/storage'

function StatsGrid() {
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    medications: 0,
    notes: 0
  })

  useEffect(() => {
    // İstatistikleri hesapla
    const reminders = storage.get(storageKeys.REMINDERS) || { daily: [], weekly: [], monthly: [], yearly: [] }
    const medications = storage.get(storageKeys.MEDICATIONS) || []
    const notes = storage.get(storageKeys.NOTES) || []
    
    const today = new Date()
    const todayReminders = reminders.daily?.filter(r => {
      const reminderDate = new Date(r.date)
      return reminderDate.toDateString() === today.toDateString()
    }) || []
    
    const weekReminders = reminders.weekly?.filter(r => {
      const reminderDate = new Date(r.date)
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      return reminderDate >= weekStart
    }) || []
    
    setStats({
      today: todayReminders.length,
      week: weekReminders.length,
      medications: medications.length,
      notes: notes.length
    })
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
        label="İlaçlar"
        value={stats.medications}
        colorClass="stat-purple"
        icon={
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
          </svg>
        }
      />
      <StatCard
        label="Notlar"
        value={stats.notes}
        colorClass="stat-orange"
        icon={
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        }
      />
    </div>
  )
}

export default StatsGrid
