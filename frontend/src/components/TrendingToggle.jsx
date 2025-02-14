function TrendingToggle({ timeWindow, onToggle }) {
  return (
    <div className="trending-toggle">
      <span className={timeWindow === 'day' ? 'active' : ''}>Today</span>
      <label className="switch">
        <input
          type="checkbox"
          checked={timeWindow === 'week'}
          onChange={onToggle}
        />
        <span className="slider round"></span>
      </label>
      <span className={timeWindow === 'week' ? 'active' : ''}>This Week</span>
    </div>
  );
}

export default TrendingToggle; 