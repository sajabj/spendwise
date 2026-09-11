export const SummaryCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = '#6366f1',
  isCurrency = true
}) => {
  const formattedValue = isCurrency
    ? typeof value === 'number'
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
      : value
    : value;

  return (
    <div className="card summary-card">
      <div className="summary-content">
        <span className="summary-label">{title}</span>
        <span className="summary-value">{formattedValue}</span>
        {subtitle && <span className="summary-subtitle">{subtitle}</span>}
      </div>
      <div
        className="summary-icon-box"
        style={{
          backgroundColor: `${color}1a`, // 10% opacity
          color: color,
          border: `1px solid ${color}33` // 20% opacity
        }}
      >
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
};
