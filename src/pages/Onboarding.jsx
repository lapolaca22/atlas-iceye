import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employees, siteComparisonData } from '../data';

const PLANTS = ['All', 'Helsinki', 'Athens', 'Valencia', 'Warsaw', 'Irvine'];

const plantIdMap = {
  Helsinki: 'helsinki',
  Athens: 'athens',
  Valencia: 'valencia',
  Warsaw: 'warsaw',
  Irvine: 'irvine',
};

function MilestoneItem({ milestone }) {
  const { week, label, status, signed, due } = milestone;

  let icon, color, detail;
  if (status === 'done') {
    icon = '✓';
    color = '#22c55e';
    detail = `signed ${signed}`;
  } else if (status === 'pending') {
    icon = '⏳';
    color = '#eab308';
    detail = `due ${due}`;
  } else {
    icon = '○';
    color = '#d1d5db';
    detail = 'pending';
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12, padding: '8px 0',
      borderTop: '1px solid #f3f4f6',
    }}>
      <span style={{
        width: 24, height: 24, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: status === 'done' ? '#dcfce7' : status === 'pending' ? '#fef9c3' : '#f3f4f6',
        fontSize: 12, flexShrink: 0,
      }}>
        {icon}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: 13, color: status === 'upcoming' ? '#9ca3af' : '#374151',
            fontWeight: status === 'done' ? 500 : 400,
          }}>
            <span style={{ fontWeight: 600, color: '#6b7280', marginRight: 6 }}>{week}</span>
            {label}
          </span>
          <span style={{ fontSize: 12, color, fontWeight: 500, whiteSpace: 'nowrap', marginLeft: 12 }}>
            {detail}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ done, total }) {
  const pct = Math.round((done / total) * 100);
  const color = pct === 100 ? '#22c55e' : pct >= 50 ? '#00c2a8' : '#eab308';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: '#6b7280' }}>{done}/{total} milestones</span>
        <span style={{ fontSize: 12, fontWeight: 600, color }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.4s' }} />
      </div>
    </div>
  );
}

function EmployeeCard({ employee }) {
  const [expanded, setExpanded] = useState(false);
  const done = employee.milestones.filter(m => m.status === 'done').length;
  const total = employee.milestones.length;
  const isComplete = done === total;

  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, marginBottom: 12,
      overflow: 'hidden',
    }}>
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          padding: '16px 20px', cursor: 'pointer', display: 'flex',
          alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{employee.name}</span>
            {isComplete && (
              <span style={{
                background: '#dcfce7', color: '#16a34a',
                fontSize: 11, fontWeight: 600, padding: '1px 8px', borderRadius: 10,
              }}>
                Fully operational
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 10px' }}>
            {employee.role} · Manager: {employee.manager}
          </p>
          <ProgressBar done={done} total={total} />
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Started</p>
          <p style={{ fontSize: 12, color: '#374151', margin: '2px 0 0', fontWeight: 500 }}>{employee.startDate}</p>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid #f3f4f6', padding: '0 20px 16px' }}>
          {employee.milestones.map((m, i) => (
            <MilestoneItem key={i} milestone={m} />
          ))}
        </div>
      )}
    </div>
  );
}

function SiteComparisonTable() {
  const statusConfig = {
    'on-track': { label: '✅ On track', color: '#16a34a', bg: '#dcfce7' },
    'watch':    { label: '⚠️ Watch', color: '#a16207', bg: '#fef9c3' },
    'delayed':  { label: '⚠️ Delayed', color: '#a16207', bg: '#fef9c3' },
    'at-risk':  { label: '🔴 At risk', color: '#dc2626', bg: '#fee2e2' },
  };

  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', marginTop: 32,
    }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>
          Site Comparison — Time to Productivity
        </h3>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f9fafb' }}>
            {['Site', 'Baseline', 'Current Avg', 'Delta', 'Status'].map(h => (
              <th key={h} style={{
                padding: '10px 20px', textAlign: 'left',
                fontSize: 12, fontWeight: 600, color: '#6b7280',
                textTransform: 'uppercase', letterSpacing: '0.05em',
                borderBottom: '1px solid #e5e7eb',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {siteComparisonData.map((row, i) => {
            const sc = statusConfig[row.status];
            return (
              <tr key={row.site} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '12px 20px', fontSize: 13, color: '#111827', fontWeight: 500 }}>
                  {row.flag} {row.site}
                </td>
                <td style={{ padding: '12px 20px', fontSize: 13, color: '#6b7280' }}>{row.baseline}</td>
                <td style={{ padding: '12px 20px', fontSize: 13, color: '#374151', fontWeight: 600 }}>{row.current}</td>
                <td style={{ padding: '12px 20px', fontSize: 13, color: row.delta === '—' ? '#9ca3af' : '#ef4444', fontWeight: 600 }}>
                  {row.delta}
                </td>
                <td style={{ padding: '12px 20px' }}>
                  <span style={{
                    ...sc, fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
                  }}>
                    {sc.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function Onboarding() {
  const { plantId } = useParams();
  const navigate = useNavigate();

  const initialFilter = plantId
    ? PLANTS.find(p => plantIdMap[p] === plantId) || 'All'
    : 'All';
  const [filter, setFilter] = useState(initialFilter);

  const filtered = filter === 'All'
    ? employees
    : employees.filter(e => e.plant === plantIdMap[filter]);

  const plantGroups = {};
  filtered.forEach(e => {
    if (!plantGroups[e.plant]) plantGroups[e.plant] = [];
    plantGroups[e.plant].push(e);
  });

  const plantNames = { helsinki: 'Helsinki 🇫🇮', athens: 'Athens 🇬🇷', valencia: 'Valencia 🇪🇸', warsaw: 'Warsaw 🇵🇱', irvine: 'Irvine 🇺🇸' };

  return (
    <div style={{ padding: '36px 40px', maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>
          Onboarding Framework
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 6, marginBottom: 0 }}>
          Individual capability acceleration · Active plants
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
        {PLANTS.map(p => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid',
              borderColor: filter === p ? '#00c2a8' : '#e5e7eb',
              background: filter === p ? '#011C22' : '#fff',
              color: filter === p ? '#00c2a8' : '#6b7280',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Employee cards by plant */}
      {Object.entries(plantGroups).map(([plantKey, emps]) => (
        <div key={plantKey} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 12 }}>
            {plantNames[plantKey]}
          </h2>
          {emps.map(emp => <EmployeeCard key={emp.id} employee={emp} />)}
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 0', color: '#9ca3af', fontSize: 14,
        }}>
          No employees in onboarding for this site.
        </div>
      )}

      {/* Site comparison table */}
      {filter === 'All' && <SiteComparisonTable />}
    </div>
  );
}
