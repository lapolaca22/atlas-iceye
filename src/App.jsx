import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { mockAlerts } from './data';
import OrgHealth from './pages/OrgHealth';
import PlantDetail from './pages/PlantDetail';
import LeadershipSystem from './pages/LeadershipSystem';
import LeaderDetail from './pages/LeaderDetail';
import Onboarding from './pages/Onboarding';
import Inputs from './pages/Inputs';
import Playbook from './pages/Playbook';
import AIAlerts from './pages/AIAlerts';

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  );
}
function NetworkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2"/>
      <circle cx="5" cy="19" r="2"/>
      <circle cx="19" cy="19" r="2"/>
      <line x1="12" y1="7" x2="12" y2="13"/>
      <line x1="12" y1="13" x2="5.5" y2="17.5"/>
      <line x1="12" y1="13" x2="18.5" y2="17.5"/>
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}
function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

const NAV = [
  { to: '/',            label: 'Org Health Dashboard',  Icon: GridIcon },
  { to: '/leadership',  label: 'Leadership System',     Icon: NetworkIcon },
  { to: '/onboarding',  label: 'Workforce Readiness',   Icon: UsersIcon },
  { to: '/playbook',    label: 'Playbook',               Icon: BookIcon },
  { to: '/inputs',      label: 'Field Inputs',           Icon: EditIcon },
  { to: '/alerts',      label: 'AI Alerts',              Icon: BellIcon, badge: true },
];

function Sidebar() {
  return (
    <aside
      style={{ width: 240, minWidth: 240, background: '#011C22' }}
      className="h-screen flex flex-col fixed left-0 top-0 z-30"
    >
      <div className="px-6 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <span style={{ color: '#00c2a8', fontWeight: 700, fontSize: 22, letterSpacing: '-0.5px' }}>
          The Eye
        </span>
        <p style={{ color: '#475569', fontSize: 11, marginTop: 3 }}>ICEYE Manufacturing Ops</p>
      </div>

      <nav className="flex-1 px-3 py-4" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ to, label, Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 12px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              color: isActive ? '#00c2a8' : '#94a3b8',
              background: isActive ? 'rgba(0,194,168,0.1)' : 'transparent',
              textDecoration: 'none',
              transition: 'background 0.15s, color 0.15s',
            })}
          >
            <Icon />
            <span style={{ flex: 1 }}>{label}</span>
            {badge && (
              <span style={{
                background: '#ef4444',
                color: '#fff',
                borderRadius: 10,
                fontSize: 10,
                fontWeight: 700,
                padding: '1px 6px',
                minWidth: 18,
                textAlign: 'center',
              }}>
                {mockAlerts.length}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ color: '#374151', fontSize: 11 }}>v1.0 · Mar 2026</p>
      </div>
    </aside>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar />
        <main style={{ marginLeft: 240, background: '#f4f7f6', flex: 1, overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<OrgHealth />} />
            <Route path="/plant/:id" element={<PlantDetail />} />
            <Route path="/leadership" element={<LeadershipSystem />} />
            <Route path="/leadership/:leaderId" element={<LeaderDetail />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/onboarding/:plantId" element={<Onboarding />} />
            <Route path="/inputs" element={<Inputs />} />
            <Route path="/playbook" element={<Playbook />} />
            <Route path="/alerts" element={<AIAlerts />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
