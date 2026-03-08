const colorMap = {
  green: '#22c55e',
  yellow: '#eab308',
  red: '#ef4444',
  gray: '#d1d5db',
};

export default function StatusDot({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: colorMap[color] || colorMap.gray,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {label && (
        <span style={{ fontSize: 12, color: '#6b7280' }}>{label}</span>
      )}
    </div>
  );
}
