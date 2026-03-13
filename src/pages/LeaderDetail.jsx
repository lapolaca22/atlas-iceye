import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { plants, leadershipScores } from '../data';
import StatusBadge from '../components/StatusBadge';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const KPI_LABELS = [
  { key: 'decisionSpeed',  label: 'Decision Speed',     subtitle: 'Time from issue identified to decision taken across sites' },
  { key: 'ownershipLevel', label: 'Ownership Level',    subtitle: 'Clarity of who owns what, at plant level and cross-site' },
  { key: 'collaboration',  label: 'Collaboration Index', subtitle: 'Quality and frequency of joint resolution between plant leaders' },
  { key: 'leaderMaturity', label: 'Leader Maturity',    subtitle: 'Ability to operate autonomously and effectively manage direct reports' },
];

const KPI_COLORS = {
  decisionSpeed:  '#00c2a8',
  ownershipLevel: '#6366f1',
  collaboration:  '#f59e0b',
  leaderMaturity: '#22c55e',
};

// ─── LEADER DATA ──────────────────────────────────────────────────────────────

const LEADER_DATA = {
  helsinki: {
    name: 'Pekka Heinonen',
    role: 'Plant Lead — Manufacturing Operations',
    history: {
      Jan: { decisionSpeed: 4.0, ownershipLevel: 4.2, collaboration: 3.8, leaderMaturity: 4.0 },
      Feb: { decisionSpeed: 4.1, ownershipLevel: 4.3, collaboration: 3.9, leaderMaturity: 4.1 },
      Mar: { decisionSpeed: 4.2, ownershipLevel: 4.5, collaboration: 4.0, leaderMaturity: 4.3 },
    },
    observations: [
      { date: 'Mar 6',  source: 'CMO',   text: 'Pekka continues as a role model — consistent decision velocity and full team ownership clarity' },
      { date: 'Mar 1',  source: 'Forum', text: 'Led cross-site onboarding Q&A — strong facilitation and knowledge transfer to Athens and Valencia' },
      { date: 'Feb 20', source: '1:1',   text: 'Strong ownership clarity across team leads — escalation matrix working as designed' },
      { date: 'Feb 5',  source: '1:1',   text: 'Gen4 tooling decision resolved locally in under 48h — high autonomy signal' },
    ],
  },
  athens: {
    name: 'Dimitris Kalogerakis',
    role: 'Plant Lead — Manufacturing Operations',
    history: {
      Jan: { decisionSpeed: 2.8, ownershipLevel: 2.5, collaboration: 3.0, leaderMaturity: 2.2 },
      Feb: { decisionSpeed: 3.0, ownershipLevel: 2.7, collaboration: 3.2, leaderMaturity: 2.4 },
      Mar: { decisionSpeed: 3.2, ownershipLevel: 2.8, collaboration: 3.5, leaderMaturity: 2.5 },
    },
    observations: [
      { date: 'Mar 5',  source: '1:1',   text: 'HQ escalation on tooling decision unresolved after 2 weeks — decision speed is the key gap' },
      { date: 'Mar 3',  source: 'CMO',   text: 'Q2 milestone ownership gap flagged — CMO cross-site intervention scheduled for next week' },
      { date: 'Feb 28', source: 'Forum', text: 'Reactive decision pattern observed — Dimitris deferring to HQ on issues within local authority' },
      { date: 'Feb 15', source: '1:1',   text: 'Positive engagement on leadership principles — needs time translating framework into daily practice' },
    ],
  },
  valencia: {
    name: 'Sofia Reig',
    role: 'Plant Lead — Manufacturing Operations',
    history: {
      Jan: { decisionSpeed: 3.0, ownershipLevel: 2.8, collaboration: 3.2, leaderMaturity: 2.7 },
      Feb: { decisionSpeed: 3.2, ownershipLevel: 3.0, collaboration: 3.5, leaderMaturity: 2.8 },
      Mar: { decisionSpeed: 3.5, ownershipLevel: 3.1, collaboration: 3.8, leaderMaturity: 3.0 },
    },
    observations: [
      { date: 'Mar 3',  source: '1:1',   text: 'Sofia shows initiative — escalation path to HQ still unclear, needs reinforcement next session' },
      { date: 'Mar 1',  source: 'Forum', text: 'Collaboration improving — Valencia and Athens connected on shared Gen4 tooling challenge' },
      { date: 'Feb 28', source: 'CMO',   text: 'Solid quarter-over-quarter progress — ownership clarity up significantly since January' },
      { date: 'Feb 10', source: '1:1',   text: 'Q3 delivery milestone ownership confirmed with team leads — clear accountability established' },
    ],
  },
  warsaw: {
    name: 'Aleksandra Nowak',
    role: 'Plant Lead — Manufacturing Operations',
    history: {
      Jan: { decisionSpeed: 2.5, ownershipLevel: 2.5, collaboration: 2.8, leaderMaturity: 2.2 },
      Feb: { decisionSpeed: 2.8, ownershipLevel: 2.7, collaboration: 3.0, leaderMaturity: 2.5 },
      Mar: { decisionSpeed: 3.0, ownershipLevel: 2.9, collaboration: 3.2, leaderMaturity: 2.7 },
    },
    observations: [
      { date: 'Mar 6',  source: '1:1',   text: 'Escalation criteria still unclear — 2 decisions pending without an owner going into week 3' },
      { date: 'Mar 4',  source: 'CMO',   text: 'Leadership team newly formed — operating principles not yet internalized, intensive support required' },
      { date: 'Mar 3',  source: 'Forum', text: 'First cross-site forum attendance — passive participation, not yet contributing to shared problem solving' },
      { date: 'Feb 24', source: '1:1',   text: 'Aleksandra joined as Plant Lead — initial onboarding session held, framework introduced' },
    ],
  },
  irvine: {
    name: 'James McKinley',
    role: 'Plant Lead — Manufacturing Operations',
    history: {
      Jan: { decisionSpeed: 3.7, ownershipLevel: 3.9, collaboration: 3.6, leaderMaturity: 3.5 },
      Feb: { decisionSpeed: 3.8, ownershipLevel: 4.0, collaboration: 3.7, leaderMaturity: 3.6 },
      Mar: { decisionSpeed: 4.0, ownershipLevel: 4.2, collaboration: 3.9, leaderMaturity: 3.8 },
    },
    observations: [
      { date: 'Mar 6',  source: '1:1',   text: 'Strong cross-functional alignment across manufacturing and quality teams — model behavior for other plants' },
      { date: 'Mar 2',  source: 'Forum', text: 'Actively contributing to cross-site knowledge sharing — proposed Gen4 protocol improvement adopted' },
      { date: 'Feb 28', source: '1:1',   text: 'Gen4 ramp exceeding projections — delivery performance consistently on track' },
      { date: 'Feb 15', source: 'CMO',   text: 'James flagged as high-maturity leader — potential cross-site mentorship role for Warsaw team' },
    ],
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function scoreColor(v) {
  if (v >= 4) return '#22c55e';
  if (v >= 3) return '#eab308';
  return '#ef4444';
}

function compositeColor(avg) {
  if (avg >= 4) return { background: '#dcfce7', color: '#16a34a' };
  if (avg >= 3) return { background: '#fef9c3', color: '#a16207' };
  return { background: '#fee2e2', color: '#dc2626' };
}

function tagStyle(source) {
  if (source === '1:1')   return { background: '#eff6ff', color: '#1d4ed8' };
  if (source === 'CMO')   return { background: '#f5f3ff', color: '#7c3aed' };
  return                         { background: '#f0fdf4', color: '#15803d' };
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function ChevronIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function Panel({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', background: 'none', border: 'none', cursor: 'pointer',
        borderBottom: open ? '1px solid #e5e7eb' : 'none',
      }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{title}</span>
        <ChevronIcon open={open} />
      </button>
      {open && <div style={{ padding: '24px' }}>{children}</div>}
    </div>
  );
}

function KpiScorePanel({ scores }) {
  if (!scores) return <p style={{ color: '#6b7280', fontSize: 13 }}>No data available.</p>;
  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 4;
  const cc = compositeColor(avg);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <span style={{ fontSize: 13, color: '#6b7280' }}>Composite Score</span>
        <span style={{ ...cc, borderRadius: 8, padding: '3px 12px', fontSize: 13, fontWeight: 700 }}>
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
                  width: `${(val / 5) * 100}%`, height: '100%', borderRadius: 4,
                  background: scoreColor(val), transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScoreHistoryChart({ history }) {
  const chartData = Object.entries(history).map(([period, vals]) => ({ period, ...vals }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 4, right: 16, left: -16, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ fontWeight: 600, color: '#111827', marginBottom: 4 }}
          />
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 12, color: '#374151', paddingTop: 12 }} />
          {KPI_LABELS.map(({ key, label }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={label}
              stroke={KPI_COLORS[key]}
              strokeWidth={2}
              dot={{ r: 4, fill: KPI_COLORS[key] }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ObservationsPanel({ observations }) {
  return (
    <div>
      {observations.map((obs, i) => (
        <div key={i} style={{
          display: 'flex', gap: 12, padding: '10px 0',
          borderTop: i > 0 ? '1px solid #f3f4f6' : 'none',
        }}>
          <span style={{
            fontSize: 11, fontWeight: 600,
            ...tagStyle(obs.source),
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
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function LeaderDetail() {
  const { leaderId } = useParams();
  const navigate = useNavigate();

  const plant = plants.find(p => p.id === leaderId);
  const scores = leadershipScores[leaderId];
  const leader = LEADER_DATA[leaderId];

  if (!plant || !leader) {
    return <div style={{ padding: 40 }}>Leader not found.</div>;
  }

  return (
    <div style={{ padding: '36px 40px', maxWidth: 900 }}>
      {/* Back */}
      <button onClick={() => navigate('/leadership')} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#6b7280', fontSize: 13, fontWeight: 500, marginBottom: 24, padding: 0,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Leadership System
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
        <span style={{ fontSize: 32 }}>{plant.flag}</span>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{leader.name}</h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 6px' }}>{leader.role} · {plant.name}</p>
          <div style={{ marginTop: 2 }}>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
              background: plant.status === 'Operational' ? '#dcfce7' : plant.status === 'Ramp-up' ? '#fef9c3' : '#f3f4f6',
              color: plant.status === 'Operational' ? '#15803d' : plant.status === 'Ramp-up' ? '#a16207' : '#6b7280',
            }}>
              {plant.status}
            </span>
          </div>
        </div>
      </div>

      <Panel title="Area 01 · Leadership KPIs">
        <KpiScorePanel scores={scores} />
      </Panel>

      <Panel title="Score History — Jan · Feb · Mar 2026">
        <ScoreHistoryChart history={leader.history} />
      </Panel>

      <Panel title="Field Observations">
        <ObservationsPanel observations={leader.observations} />
      </Panel>
    </div>
  );
}
