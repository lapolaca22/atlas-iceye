import { useNavigate } from 'react-router-dom';
import { plants } from '../data';
import StatusDot from '../components/StatusDot';
import StatusBadge from '../components/StatusBadge';

function PlantCard({ plant }) {
  const navigate = useNavigate();
  const isNotStarted = plant.status === 'Not started';

  return (
    <div
      onClick={() => !isNotStarted && navigate(`/plant/${plant.id}`)}
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        padding: '20px 22px',
        cursor: isNotStarted ? 'default' : 'pointer',
        transition: 'box-shadow 0.15s, border-color 0.15s',
        opacity: isNotStarted ? 0.65 : 1,
      }}
      onMouseEnter={e => {
        if (!isNotStarted) {
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
          e.currentTarget.style.borderColor = '#00c2a8';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e5e7eb';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>{plant.flag}</span>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14, color: '#111827', margin: 0 }}>{plant.name}</p>
          </div>
        </div>
        <StatusBadge status={plant.status} />
      </div>

      {/* Traffic lights */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <StatusDot color={plant.leadership} label="Leadership" />
        <StatusDot color={plant.workforce} label="Workforce Readiness" />
        <StatusDot color={plant.delivery} label="Delivery" />
      </div>

      {/* Footer */}
      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 16, marginBottom: 0 }}>
        Updated {plant.lastUpdated}
      </p>
    </div>
  );
}

export default function OrgHealth() {
  return (
    <div style={{ padding: '36px 40px', maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>
          Org Health Dashboard
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 6, marginBottom: 0 }}>
          Cross-site overview · 8 plants · Mar 2026
        </p>
      </div>

      {/* Summary pills */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Operational', count: 2, color: '#22c55e', bg: '#dcfce7' },
          { label: 'Ramp-up', count: 3, color: '#a16207', bg: '#fef9c3' },
          { label: 'Not started', count: 3, color: '#6b7280', bg: '#f3f4f6' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} style={{
            background: bg, color, borderRadius: 8, padding: '8px 16px',
            fontSize: 13, fontWeight: 600, display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <span style={{
              background: color, color: '#fff', borderRadius: 10,
              fontSize: 11, fontWeight: 700, padding: '0 7px', lineHeight: '18px',
            }}>{count}</span>
            {label}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 16,
      }}>
        {plants.map(plant => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </div>
  );
}
