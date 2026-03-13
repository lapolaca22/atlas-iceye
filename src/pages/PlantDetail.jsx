import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  plants, leadershipScores, leadershipObservations, workforceData,
  workforceObservations, orgHealthObservations,
} from '../data';
import StatusBadge from '../components/StatusBadge';

const KPI_LABELS = [
  { key: 'decisionSpeed', label: 'Decision Speed', subtitle: 'Time from issue identified to decision taken across sites' },
  { key: 'ownershipLevel', label: 'Ownership Level', subtitle: 'Clarity of who owns what, at plant level and cross-site' },
  { key: 'collaboration', label: 'Collaboration Index', subtitle: 'Quality and frequency of joint resolution between plant leaders' },
  { key: 'leaderMaturity', label: 'Leader Maturity', subtitle: 'Ability to operate autonomously and effectively manage direct reports' },
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

function statusDotColor(status) {
  if (status === 'green') return '#22c55e';
  if (status === 'yellow') return '#eab308';
  if (status === 'red') return '#ef4444';
  return '#9ca3af';
}

function ObservationTag({ source }) {
  const isOneOnOne = source === '1:1';
  return (
    <span style={{
      fontSize: 11, fontWeight: 600,
      background: isOneOnOne ? '#eff6ff' : '#f0fdf4',
      color: isOneOnOne ? '#1d4ed8' : '#15803d',
      padding: '2px 8px', borderRadius: 4, height: 'fit-content', whiteSpace: 'nowrap',
    }}>
      {source}
    </span>
  );
}

function FieldObservations({ observations }) {
  if (!observations || observations.length === 0) return null;
  return (
    <div style={{ marginTop: 28 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 12 }}>
        Field Observations
      </p>
      {observations.map((obs, i) => (
        <div key={i} style={{
          display: 'flex', gap: 12, padding: '10px 0',
          borderTop: i > 0 ? '1px solid #f3f4f6' : 'none',
        }}>
          <ObservationTag source={obs.source} />
          <div>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 2px' }}>{obs.date}</p>
            <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>{obs.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
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

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <span style={{ fontSize: 13, color: '#6b7280' }}>Composite Score</span>
        <span style={{
          background: cc.bg, color: cc.color,
          borderRadius: 8, padding: '3px 12px', fontSize: 13, fontWeight: 700,
        }}>
          {avg.toFixed(1)} / 5.0
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {KPI_LABELS.map(({ key, label, subtitle }) => {
          const val = scores[key];
          return (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div>
                  <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{label}</span>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0', fontStyle: 'italic' }}>{subtitle}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: scoreColor(val), marginLeft: 16, flexShrink: 0 }}>{val}</span>
              </div>
              <div style={{ position: 'relative', height: 8, background: '#f3f4f6', borderRadius: 4, marginTop: 8 }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0,
                  width: `${(val / 5) * 100}%`,
                  height: '100%', borderRadius: 4, background: scoreColor(val),
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <FieldObservations observations={leadershipObservations[plantId]} />
    </div>
  );
}

function WorkforcePanel({ plantId }) {
  const navigate = useNavigate();
  const data = workforceData[plantId];
  if (!data) return <p style={{ color: '#6b7280', fontSize: 13 }}>No data available.</p>;

  const delta = data.timeToProductivity - data.baseline;
  const rampColor = delta === 0 ? '#22c55e' : delta <= 1 ? '#eab308' : '#ef4444';
  const statusLabel = delta === 0 ? 'On track' : delta <= 1 ? 'Watch' : 'Delayed';
  const throughputPct = Math.round((data.throughputIn / data.throughputDemand) * 100);
  const throughputColor = throughputPct === 100 ? '#22c55e' : throughputPct >= 66 ? '#eab308' : '#ef4444';

  const kpis = [
    {
      label: 'Time to Productivity',
      subtitle: 'Weeks from hire to final manager sign-off on full operational readiness',
      displayValue: `${data.timeToProductivity} wks`,
      barWidth: Math.min((data.baseline / data.timeToProductivity) * 100, 100),
      barColor: rampColor,
    },
    {
      label: 'Ramp Delta',
      subtitle: 'TtP this plant vs. previous deployment — gap closing proves the framework compounds',
      displayValue: delta === 0 ? '0 wks' : delta > 0 ? `+${delta} wks` : `${delta} wks`,
      barWidth: delta === 0 ? 100 : Math.max(0, (1 - delta / 8) * 100),
      barColor: rampColor,
    },
    {
      label: 'Throughput Capacity',
      subtitle: 'Employees in onboarding vs. hiring demand — flags bottlenecks before they hit production',
      displayValue: `${data.throughputIn} / ${data.throughputDemand}`,
      barWidth: throughputPct,
      barColor: throughputColor,
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <span style={{ fontSize: 13, color: '#6b7280' }}>Status</span>
        <span style={{
          background: delta === 0 ? '#dcfce7' : delta <= 1 ? '#fef9c3' : '#fee2e2',
          color: rampColor,
          borderRadius: 8, padding: '3px 12px', fontSize: 13, fontWeight: 700,
        }}>
          {statusLabel}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {kpis.map(({ label, subtitle, displayValue, barWidth, barColor }) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <div>
                <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{label}</span>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0', fontStyle: 'italic' }}>{subtitle}</p>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: barColor, marginLeft: 16, flexShrink: 0 }}>{displayValue}</span>
            </div>
            <div style={{ position: 'relative', height: 8, background: '#f3f4f6', borderRadius: 4, marginTop: 8 }}>
              <div style={{
                position: 'absolute', top: 0, left: 0,
                width: `${barWidth}%`,
                height: '100%', borderRadius: 4, background: barColor,
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        ))}
      </div>

      <FieldObservations observations={workforceObservations[plantId]} />

      <div style={{ marginTop: 24 }}>
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
    </div>
  );
}

function OrgHealthPanel({ plant }) {
  const rows = [
    {
      label: 'Leadership Score',
      subtitle: 'Consolidated from Area 01 — cross-site view',
      status: plant.leadership,
    },
    {
      label: 'Workforce Readiness',
      subtitle: 'Consolidated from Area 02 — cross-site view',
      status: plant.workforce,
    },
    {
      label: 'Delivery Performance',
      subtitle: 'Production targets hit vs. planned — satellites on schedule, ramp milestones met',
      status: plant.delivery,
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {rows.map(({ label, subtitle, status }) => {
          const color = statusDotColor(status);
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%', background: color,
                flexShrink: 0, marginTop: 3,
              }} />
              <div>
                <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{label}</span>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0', fontStyle: 'italic' }}>{subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      <FieldObservations observations={orgHealthObservations[plant.id]} />
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
      <Panel title="Area 01 · Leadership System">
        <LeadershipKpiChart plantId={id} />
      </Panel>

      <Panel title="Area 02 · Capability Acceleration">
        <WorkforcePanel plantId={id} />
      </Panel>

      <Panel title="Area 03 · Org Health">
        <OrgHealthPanel plant={plant} />
      </Panel>
    </div>
  );
}
