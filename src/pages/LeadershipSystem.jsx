import { useNavigate } from 'react-router-dom';
import { plants, leadershipScores } from '../data';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const ACTIVE_IDS = ['helsinki', 'athens', 'valencia', 'warsaw', 'irvine'];

const PLANT_FLAG = Object.fromEntries(plants.map(p => [p.id, p.flag]));

const LEADERS = {
  helsinki: { name: 'Pekka Heinonen',       role: 'Plant Lead', lastOneOnOne: 'Mar 6 2026' },
  athens:   { name: 'Dimitris Kalogerakis', role: 'Plant Lead', lastOneOnOne: 'Mar 5 2026' },
  valencia: { name: 'Sofia Reig',           role: 'Plant Lead', lastOneOnOne: 'Mar 3 2026' },
  warsaw:   { name: 'Aleksandra Nowak',     role: 'Plant Lead', lastOneOnOne: 'Mar 4 2026' },
  irvine:   { name: 'James McKinley',       role: 'Plant Lead', lastOneOnOne: 'Mar 6 2026' },
};

const KPI_KEYS = ['decisionSpeed', 'ownershipLevel', 'collaboration', 'leaderMaturity'];
const KPI_SHORT = {
  decisionSpeed:  'Decision Speed',
  ownershipLevel: 'Ownership Level',
  collaboration:  'Collaboration Index',
  leaderMaturity: 'Leader Maturity',
};

// ─── FORUMS & OFFSITES DATA ───────────────────────────────────────────────────

const FORUMS = [
  { month: 'Mar 2026', status: 'completed', plants: ['helsinki', 'athens', 'valencia', 'warsaw', 'irvine'], takeaway: 'Helsinki facilitated Valencia onboarding Q&A — cross-site escalation protocol reviewed.' },
  { month: 'Apr 2026', status: 'completed', plants: ['helsinki', 'athens', 'valencia', 'warsaw'],            takeaway: 'Warsaw integration session held — Athens tooling decision resolved via cross-site alignment.' },
  { month: 'May 2026', status: 'scheduled', plants: ['helsinki', 'athens', 'valencia', 'warsaw', 'irvine'], takeaway: null },
  { month: 'Jun 2026', status: 'pending',   plants: ['helsinki', 'athens', 'valencia', 'warsaw', 'irvine', 'neuss'], takeaway: null },
  { month: 'Jul 2026', status: 'pending',   plants: [], takeaway: null },
  { month: 'Aug 2026', status: 'pending',   plants: [], takeaway: null },
  { month: 'Sep 2026', status: 'pending',   plants: [], takeaway: null },
  { month: 'Oct 2026', status: 'pending',   plants: [], takeaway: null },
  { month: 'Nov 2026', status: 'pending',   plants: [], takeaway: null },
  { month: 'Dec 2026', status: 'pending',   plants: [], takeaway: null },
];

const OFFSITES = [
  {
    quarter: 'Q2',      date: 'June 2026',      location: 'Helsinki',
    title: 'Kickoff — Leadership principles alignment',
    status: 'scheduled',
    attendees: ['helsinki', 'athens', 'valencia', 'warsaw', 'irvine'],
  },
  {
    quarter: 'Q3',      date: 'September 2026', location: 'Athens',
    title: 'Mid-year review — Ramp progress & playbook updates',
    status: 'pending',
    attendees: ['helsinki', 'athens', 'valencia', 'warsaw', 'irvine', 'neuss'],
  },
  {
    quarter: 'Q4',      date: 'December 2026',  location: 'Helsinki',
    title: 'End of year review + 2027 roadmap',
    status: 'pending',
    attendees: ['helsinki', 'athens', 'valencia', 'warsaw', 'irvine', 'neuss', 'japan', 'uae'],
  },
  {
    quarter: 'Q1 2027', date: 'March 2027',     location: 'TBD',
    title: '2027 kickoff — Global manufacturing alignment',
    status: 'pending',
    attendees: [],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function scoreColor(v) {
  if (v >= 4) return '#22c55e';
  if (v >= 3) return '#eab308';
  return '#ef4444';
}

function statusChip(status) {
  if (status === 'completed') return { label: 'Completed', bg: '#dcfce7', color: '#15803d' };
  if (status === 'scheduled') return { label: 'Scheduled', bg: '#ccfbf1', color: '#0d9488' };
  return                              { label: 'Pending',   bg: '#f3f4f6', color: '#9ca3af' };
}

function plantStatus(plant) {
  if (plant.status === 'Operational') return { bg: '#dcfce7', color: '#15803d' };
  if (plant.status === 'Ramp-up')     return { bg: '#fef9c3', color: '#a16207' };
  return                                     { bg: '#f3f4f6', color: '#6b7280' };
}

// ─── SECTION 1: LEADER CARDS ─────────────────────────────────────────────────

function LeaderCard({ plant }) {
  const navigate = useNavigate();
  const leader = LEADERS[plant.id];
  const scores = leadershipScores[plant.id];
  if (!leader || !scores) return null;

  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 4;
  const ps = plantStatus(plant);

  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
      padding: '20px', display: 'flex', flexDirection: 'column', gap: 0,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>{plant.flag}</span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>{plant.name}</p>
            <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0 0' }}>{leader.name}</p>
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20, ...ps }}>
          {plant.status}
        </span>
      </div>

      {/* Composite score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Composite</span>
        <span style={{
          fontSize: 12, fontWeight: 700,
          color: avg >= 4 ? '#16a34a' : avg >= 3 ? '#a16207' : '#dc2626',
        }}>
          {avg.toFixed(1)} / 5.0
        </span>
      </div>

      {/* Mini KPI bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
        {KPI_KEYS.map(key => {
          const val = scores[key];
          return (
            <div key={key}>
              <span style={{ fontSize: 10, color: '#9ca3af', display: 'block', marginBottom: 3 }}>{KPI_SHORT[key]}</span>
              <div style={{ position: 'relative', height: 4, background: '#f3f4f6', borderRadius: 2 }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0,
                  width: `${(val / 5) * 100}%`, height: '100%', borderRadius: 2,
                  background: scoreColor(val), transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 14, borderTop: '1px solid #f3f4f6' }}>
        <span style={{ fontSize: 11, color: '#9ca3af' }}>Last 1:1 · {leader.lastOneOnOne}</span>
        <button
          onClick={() => navigate(`/leadership/${plant.id}`)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, color: '#00c2a8', padding: 0,
          }}
        >
          View Leader Detail →
        </button>
      </div>
    </div>
  );
}

// ─── SECTION 2: NETWORK EVENTS ────────────────────────────────────────────────

function ForumRow({ forum, i }) {
  const chip = statusChip(forum.status);
  return (
    <div style={{
      padding: '12px 0',
      borderTop: i > 0 ? '1px solid #f3f4f6' : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{forum.month}</span>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>· Virtual Forum</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 8px', borderRadius: 10, background: chip.bg, color: chip.color }}>
              {chip.label}
            </span>
          </div>
          {forum.plants.length > 0 && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: forum.takeaway ? 6 : 0 }}>
              {forum.plants.map(id => (
                <span key={id} style={{
                  fontSize: 14, background: '#f9fafb', border: '1px solid #e5e7eb',
                  borderRadius: 4, padding: '1px 6px', lineHeight: 1.6,
                }}>
                  {PLANT_FLAG[id]}
                </span>
              ))}
            </div>
          )}
          {forum.takeaway && (
            <p style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic', margin: 0 }}>{forum.takeaway}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function OfsiteCard({ offsite, i }) {
  const chip = statusChip(offsite.status);
  return (
    <div style={{
      padding: '14px 16px', borderRadius: 8,
      background: i === 0 ? '#f0fdfa' : '#fafafa',
      border: `1px solid ${i === 0 ? '#99f6e4' : '#e5e7eb'}`,
      marginBottom: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20,
          background: '#ccfbf1', color: '#0d9488',
        }}>
          {offsite.quarter}
        </span>
        <span style={{ fontSize: 12, color: '#6b7280' }}>{offsite.date}</span>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '1px 8px', borderRadius: 10,
          background: chip.bg, color: chip.color, marginLeft: 'auto',
        }}>
          {chip.label}
        </span>
      </div>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: '0 0 4px' }}>{offsite.title}</p>
      <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 10px' }}>
        {offsite.location === 'TBD' ? 'Location TBD' : `📍 ${offsite.location}`}
      </p>
      {offsite.attendees.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {offsite.attendees.map(id => (
            <span key={id} style={{
              fontSize: 14, background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: 4, padding: '1px 6px', lineHeight: 1.6,
            }}>
              {PLANT_FLAG[id]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function LeadershipSystem() {
  const activePlants = plants.filter(p => ACTIVE_IDS.includes(p.id));

  return (
    <div style={{ padding: '36px 40px', maxWidth: 1000 }}>
      {/* ── Section 1: Plant Leaders ── */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Plant Leaders</h2>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 24px' }}>Active sites · Leadership KPIs · Latest 1:1 signal</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {activePlants.map(plant => (
            <LeaderCard key={plant.id} plant={plant} />
          ))}
        </div>
      </div>

      {/* ── Section 2: Network Events ── */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Forums & Offsites</h2>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 24px' }}>
          Monthly virtual forums · Quarterly presential offsites
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          {/* Left: Monthly Forums */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '20px 24px' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 4px' }}>Monthly Forums</p>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Virtual · All active plants</p>
            {FORUMS.map((forum, i) => (
              <ForumRow key={forum.month} forum={forum} i={i} />
            ))}
          </div>

          {/* Right: Quarterly Offsites */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '20px 24px' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 4px' }}>Quarterly Offsites</p>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Presential · Cross-plant leadership</p>
            {OFFSITES.map((offsite, i) => (
              <OfsiteCard key={offsite.quarter} offsite={offsite} i={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
