import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import {
  plants, leadershipScores, leadershipObservations, workforceData,
} from '../data';
import StatusBadge from '../components/StatusBadge';

const KPI_LABELS = [
  { key: 'decisionSpeed', label: 'Decision Speed' },
  { key: 'ownershipLevel', label: 'Ownership Level' },
  { key: 'collaboration', label: 'Collaboration' },
  { key: 'leaderMaturity', label: 'Leader Maturity' },
];

function scoreColor(v) {
  if (v >= 4) return '#22c55e';
  if (v >= 3) return '#eab308';
  return '#ef4444';
}

function compositeColor(avg) {
  if (avg >= 4) return { bg: '#dcfce7', color: '#16a34a' };
  if (avg >= 3) return { bg: '#fef9c3', color: '#a16207' };
  return { bg: '#fee2e2', color: '#dc2626' };
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function Panel({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', marginBottom: 20,
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', background: 'none', border: 'none', cursor: 'pointer',
          borderBottom: open ? '1px solid #e5e7eb' : 'none',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{title}</span>
        <ChevronIcon open={open} />
      </button>
      {open && <div style={{ padding: '24px' }}>{children}</div>}
    </div>
  );
}

function LeadershipKpiChart({ plantId }) {
  const scores = leadershipScores[plantId];
  if (!scores) return <p style={{ color: '#6b7280', fontSize: 13 }}>No data available.</p>;

  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 4;
  const cc = compositeColor(avg);

  const chartData = KPI_LABELS.map(({ key, label }) => ({
    name: label,
    value: scores[key],
  }));

  return (
    <div>
      {/* Composite badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <span style={{ fontSize: 13, color: '#6b7280' }}>Composite Score</span>
        <span style={{
          ...cc,
          borderRadius: 8,
          padding: '3px 12px',
          fontSize: 13,
          fontWeight: 700,
        }}>
          {avg.toFixed(1)} / 5.0
        </span>
      </div>

      {/* Bar charts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {KPI_LABELS.map(({ key, label }) => {
          const val = scores[key];
          return (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: scoreColor(val) }}>{val}</span>
              </div>
              <div style={{ position: 'relative', height: 8, background: '#f3f4f6', borderRadius: 4 }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0,
                  width: `${(val / 5) * 100}%`,
                  height: '100%',
                  borderRadius: 4,
                  background: scoreColor(val),
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Observations */}
      <div style={{ marginTop: 28 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 12 }}>
          Field Observations
        </p>
        {(leadershipObservations[plantId] || []).map((obs, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, padding: '10px 0',
            borderTop: i > 0 ? '1px solid #f3f4f6' : 'none',
          }}>
            <span style={{
              fontSize: 11, fontWeight: 600,
              background: obs.source === '1:1' ? '#eff6ff' : '#f0fdf4',
              color: obs.source === '1:1' ? '#1d4ed8' : '#15803d',
              padding: '2px 8px', borderRadius: 4, height: 'fit-content', whiteSpace: 'nowrap',
            }}>
              {obs.source}
            </span>
            <div>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 2px' }}>{obs.date}</p>
              <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>{obs.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkforcePanel({ plantId }) {
  const navigate = useNavigate();
  const data = workforceData[plantId];
  if (!data) return <p style={{ color: '#6b7280', fontSize: 13 }}>No data available.</p>;

  const delta = data.timeToProductivity - data.baseline;
  const statusColor = delta === 0 ? '#22c55e' : delta <= 1 ? '#eab308' : '#ef4444';
  const statusLabel = delta === 0 ? 'On track' : delta <= 1 ? 'Watch' : 'Delayed';

  const throughputPct = Math.round((data.throughputIn / data.throughputDemand) * 100);

  return (
    <div>
      {/* Composite */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <span style={{ fontSize: 13, color: '#6b7280' }}>Status</span>
        <span style={{
          background: delta === 0 ? '#dcfce7' : delta <= 1 ? '#fef9c3' : '#fee2e2',
          color: statusColor,
          borderRadius: 8, padding: '3px 12px', fontSize: 13, fontWeight: 700,
        }}>
          {statusLabel}
        </span>
      </div>

      {/* KPIs */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 28 }}>
        {/* Time to Productivity */}
        <div style={{
          flex: 1, padding: '16px 20px', background: '#f9fafb',
          borderRadius: 8, border: '1px solid #e5e7eb',
        }}>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Time to Productivity
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{data.timeToProductivity}</span>
            <span style={{ fontSize: 14, color: '#6b7280' }}>wks</span>
            {delta !== 0 && (
              <span style={{ fontSize: 13, fontWeight: 600, color: statusColor }}>
                {delta > 0 ? `+${delta}` : delta} vs baseline
              </span>
            )}
          </div>
          <div style={{ marginTop: 12, position: 'relative', height: 8, background: '#e5e7eb', borderRadius: 4 }}>
            <div style={{
              position: 'absolute', top: 0, left: 0,
              width: `${Math.min((data.baseline / data.timeToProductivity) * 100, 100)}%`,
              height: '100%', borderRadius: 4, background: '#d1d5db',
            }} />
            <div style={{
              position: 'absolute', top: 0, left: 0,
              width: `${Math.min((data.baseline / (data.timeToProductivity + 4)) * 100, 100)}%`,
              height: '100%', borderRadius: 4, background: '#00c2a8',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>Helsinki baseline: {data.baseline} wks</span>
            <span style={{ fontSize: 11, color: statusColor }}>Current: {data.timeToProductivity} wks</span>
          </div>
        </div>

        {/* Throughput */}
        <div style={{
          flex: 1, padding: '16px 20px', background: '#f9fafb',
          borderRadius: 8, border: '1px solid #e5e7eb',
        }}>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Throughput Capacity
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{data.throughputIn}</span>
            <span style={{ fontSize: 16, color: '#9ca3af' }}>/ {data.throughputDemand}</span>
            <span style={{ fontSize: 13, color: '#6b7280', marginLeft: 4 }}>in onboarding</span>
          </div>
          <div style={{ marginTop: 12, position: 'relative', height: 8, background: '#e5e7eb', borderRadius: 4 }}>
            <div style={{
              position: 'absolute', top: 0, left: 0,
              width: `${throughputPct}%`,
              height: '100%', borderRadius: 4,
              background: throughputPct === 100 ? '#22c55e' : throughputPct >= 66 ? '#eab308' : '#ef4444',
            }} />
          </div>
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{throughputPct}% capacity utilized</p>
        </div>
      </div>

      <button
        onClick={() => navigate(`/onboarding/${plantId}`)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 6,
          background: '#011C22', color: '#00c2a8',
          fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
        }}
      >
        View Onboarding Detail →
      </button>
    </div>
  );
}

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const plant = plants.find(p => p.id === id);

  if (!plant) return <div style={{ padding: 40 }}>Plant not found.</div>;

  return (
    <div style={{ padding: '36px 40px', maxWidth: 900 }}>
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#6b7280', fontSize: 13, fontWeight: 500, marginBottom: 24, padding: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Dashboard
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
        <span style={{ fontSize: 32 }}>{plant.flag}</span>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>{plant.name}</h1>
          <div style={{ marginTop: 6 }}>
            <StatusBadge status={plant.status} />
          </div>
        </div>
      </div>

      {/* Panels */}
      <Panel title="Panel A — Leadership Score (Area 01)">
        <LeadershipKpiChart plantId={id} />
      </Panel>

      <Panel title="Panel B — Workforce Readiness (Area 02)">
        <WorkforcePanel plantId={id} />
      </Panel>
    </div>
  );
}
