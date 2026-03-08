const styles = {
  Operational: { background: '#dcfce7', color: '#16a34a' },
  'Ramp-up':   { background: '#fef9c3', color: '#a16207' },
  'Not started': { background: '#f3f4f6', color: '#6b7280' },
};

export default function StatusBadge({ status }) {
  const s = styles[status] || styles['Not started'];
  return (
    <span style={{
      ...s,
      fontSize: 11,
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: 20,
      letterSpacing: '0.02em',
    }}>
      {status}
    </span>
  );
}
