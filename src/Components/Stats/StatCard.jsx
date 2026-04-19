function StatCard({ label, value, icon, colorClass }) {
  const iconColorClass = colorClass.replace('stat-', '')
  
  return (
    <div className="stat-card">
      <div className="stat-content">
        <div className="stat-info">
          <p className="stat-label">{label}</p>
          <p className={`stat-value ${colorClass}`}>{value}</p>
        </div>
        <div className={`stat-icon stat-icon-${iconColorClass}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default StatCard
