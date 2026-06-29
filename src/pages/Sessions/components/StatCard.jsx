const StatCard = ({ number, label, description, tone }) => {
  const toneStyle = {
    blue: { background: '#eff6ff', color: '#2563eb' },
    purple: { background: '#f5f3ff', color: '#7c3aed' },
    green: { background: '#ecfdf5', color: '#059669' },
    red: { background: '#fef2f2', color: '#dc2626' },
  };

  return (
    <article style={statCard}>
      <div style={statTop}>
        <span style={{ ...statIcon, ...toneStyle[tone] }}>{label.charAt(0)}</span>
      </div>
      <span style={statNumber}>{number}</span>
      <h3 style={statLabel}>{label}</h3>
      <p style={statDescription}>{description}</p>
    </article>
  );
};

const statCard = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '22px',
  padding: '22px',
  minHeight: '185px',
  boxShadow: '0 14px 30px rgba(15, 23, 42, 0.05)',
};

const statTop = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '18px',
};

const statIcon = {
  width: '42px',
  height: '42px',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '900',
};

const statNumber = {
  display: 'block',
  fontSize: '32px',
  lineHeight: '1',
  fontWeight: '900',
  color: '#111827',
  letterSpacing: '-1px',
};

const statLabel = {
  margin: '12px 0 6px',
  fontSize: '16px',
  color: '#111827',
};

const statDescription = {
  margin: 0,
  fontSize: '14px',
  lineHeight: '1.45',
  color: '#6b7280',
};

export default StatCard;