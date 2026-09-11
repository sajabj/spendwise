export const Loading = ({ message = 'Loading your financial data...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '280px',
        gap: '1rem'
      }}
    >
      <div className="spinner" />
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
};
