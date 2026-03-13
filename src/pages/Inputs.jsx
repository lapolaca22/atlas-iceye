import { useState } from 'react';
import { plants } from '../data';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const PLANT_OPTIONS = plants.map(p => ({ value: p.id, label: `${p.flag} ${p.name}` }));

const AREA_OPTIONS = [
  { value: 'area01', label: 'Area 01 · Leadership System' },
  { value: 'area02', label: 'Area 02 · Capability Acceleration' },
  { value: 'area03', label: 'Area 03 · Org Health' },
];

const TABS = ['My 1:1s', 'Employee Feedback', 'CMO Notes'];

// ─── MOCK RECENT SUBMISSIONS ─────────────────────────────────────────────────

const oneOnOneMock = [
  { date: 'Mar 12', plant: '🇬🇷 Athens', area: 'Area 01', score: 3, observation: 'Decision loop still unclear at team lead level — two escalations unresolved after 5 days.' },
  { date: 'Mar 10', plant: '🇵🇱 Warsaw', area: 'Area 01', score: 2, observation: 'Leader maturity low — reactive patterns observed in back-to-back sessions.' },
  { date: 'Mar 8',  plant: '🇫🇮 Helsinki', area: 'Area 02', score: 5, observation: 'W8 milestone signed off ahead of schedule — strongest cohort to date.' },
  { date: 'Mar 6',  plant: '🇪🇸 Valencia', area: 'Area 03', score: 4, observation: 'Cross-area alignment improving after Q1 joint session.' },
];

const feedbackMock = [
  { date: 'Mar 11', plant: '🇬🇷 Athens',  area: 'Area 02', anonymous: true,  name: null,       observation: 'Onboarding W4 module unclear — shadowing instructions ambiguous.' },
  { date: 'Mar 9',  plant: '🇵🇱 Warsaw',  area: 'Area 02', anonymous: true,  name: null,       observation: 'Tooling access took 3 days to resolve, blocked W2 progress.' },
  { date: 'Mar 7',  plant: '🇪🇸 Valencia', area: 'Area 01', anonymous: false, name: 'Carlos M.', observation: 'Manager escalation path well defined — good clarity on who decides what.' },
];

const cmoMock = [
  { date: 'Mar 12', plant: '🇬🇷 Athens',   area: 'Area 03', priority: 5, observation: 'Delivery milestone at risk — needs CMO visibility before Q2 review.' },
  { date: 'Mar 10', plant: '🇵🇱 Warsaw',   area: 'Area 01', priority: 4, observation: 'Leadership integration session must happen before further hiring.' },
  { date: 'Mar 8',  plant: '🇫🇮 Helsinki', area: 'Area 02', priority: 2, observation: 'Framework performing well — consider documenting as v1 validated.' },
  { date: 'Mar 5',  plant: '🇪🇸 Valencia', area: 'Area 03', priority: 3, observation: 'Delivery on watch — no breach but schedule tightening into Q2.' },
];

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────

const truncate = (str, n = 32) => str.length > n ? str.slice(0, n) + '...' : str;

const labelStyle = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color: '#6b7280',
  marginBottom: 6,
};

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid #e5e7eb',
  borderRadius: 6,
  fontSize: 13,
  color: '#111827',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const fieldWrap = { marginBottom: 20 };

function Field({ label, children }) {
  return (
    <div style={fieldWrap}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function SelectField({ label, value, onChange, options, placeholder = 'Select…' }) {
  return (
    <Field label={label}>
      <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}

function ScoreSelector({ value, onChange, label = 'Score' }) {
  return (
    <Field label={label}>
      <div style={{ display: 'flex', gap: 8 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            style={{
              width: 38, height: 38, borderRadius: 6,
              border: `1.5px solid ${value === n ? '#00c2a8' : '#e5e7eb'}`,
              background: value === n ? '#00c2a8' : '#fff',
              color: value === n ? '#fff' : '#374151',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </Field>
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <button
        type="button"
        onClick={() => onChange(!value)}
        style={{
          width: 42, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: value ? '#00c2a8' : '#d1d5db',
          position: 'relative', transition: 'background 0.2s', flexShrink: 0,
          padding: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: 4, left: value ? 22 : 4,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s',
        }} />
      </button>
      <span style={{ fontSize: 13, color: '#374151' }}>{label}</span>
    </div>
  );
}

function SubmitButton({ label }) {
  return (
    <button
      type="submit"
      style={{
        padding: '10px 20px', borderRadius: 6,
        background: '#00c2a8', color: '#fff',
        fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
        letterSpacing: '0.02em',
      }}
    >
      {label}
    </button>
  );
}

// ─── RECENT SUBMISSIONS TABLE ─────────────────────────────────────────────────

function SubmissionsTable({ rows, showScore = false, scoreLabel = 'Score' }) {
  return (
    <div style={{ marginTop: 32 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
        Recent Submissions
      </p>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: showScore ? '80px 1fr 120px 60px 1fr' : '80px 1fr 120px 1fr',
          gap: 0,
          background: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          padding: '8px 16px',
        }}>
          {['Date', 'Plant', 'Area', ...(showScore ? [scoreLabel] : []), 'Observation'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>
        {rows.map((row, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: showScore ? '80px 1fr 120px 60px 1fr' : '80px 1fr 120px 1fr',
            gap: 0,
            padding: '10px 16px',
            background: i % 2 === 0 ? '#fff' : '#fafafa',
            borderBottom: i < rows.length - 1 ? '1px solid #f3f4f6' : 'none',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>{row.date}</span>
            <span style={{ fontSize: 12, color: '#374151' }}>{row.plant}</span>
            <span style={{ fontSize: 12, color: '#6b7280' }}>{row.area}</span>
            {showScore && (
              <span style={{
                fontSize: 12, fontWeight: 700,
                color: row.score >= 4 || row.priority >= 4 ? '#16a34a'
                  : row.score >= 3 || row.priority >= 3 ? '#a16207'
                  : '#dc2626',
              }}>
                {row.score ?? row.priority}
              </span>
            )}
            <span style={{ fontSize: 12, color: '#374151' }}>{truncate(row.observation)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TAB FORMS ────────────────────────────────────────────────────────────────

function OneOnOneForm() {
  const [form, setForm] = useState({ plant: '', date: '', area: '', kpi: '', score: null, observation: '' });
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = e => {
    e.preventDefault();
    console.log('[1:1 Observation]', form);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 0 }}>
          <SelectField label="Plant" value={form.plant} onChange={set('plant')} options={PLANT_OPTIONS} />
          <Field label="Date">
            <input type="date" value={form.date} onChange={e => set('date')(e.target.value)} style={inputStyle} />
          </Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <SelectField label="Area" value={form.area} onChange={set('area')} options={AREA_OPTIONS} />
          <Field label="KPI Observed">
            <input
              type="text" value={form.kpi} onChange={e => set('kpi')(e.target.value)}
              placeholder="e.g. Decision Speed"
              style={inputStyle}
            />
          </Field>
        </div>
        <ScoreSelector value={form.score} onChange={set('score')} label="Score" />
        <Field label="Observation">
          <textarea
            value={form.observation}
            onChange={e => set('observation')(e.target.value)}
            placeholder="What did you observe? Be specific — this feeds the dashboard."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </Field>
        <SubmitButton label="Save Observation" />
      </form>
      <SubmissionsTable rows={oneOnOneMock} showScore scoreLabel="Score" />
    </div>
  );
}

function EmployeeFeedbackForm() {
  const [form, setForm] = useState({ plant: '', area: '', anonymous: true, name: '', observation: '' });
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = e => {
    e.preventDefault();
    console.log('[Employee Feedback]', form);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Toggle value={form.anonymous} onChange={set('anonymous')} label="Anonymous submission" />
        {!form.anonymous && (
          <Field label="Name">
            <input
              type="text" value={form.name} onChange={e => set('name')(e.target.value)}
              placeholder="Full name"
              style={inputStyle}
            />
          </Field>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <SelectField label="Plant" value={form.plant} onChange={set('plant')} options={PLANT_OPTIONS} />
          <SelectField label="Area" value={form.area} onChange={set('area')} options={AREA_OPTIONS} />
        </div>
        <Field label="Observation">
          <textarea
            value={form.observation}
            onChange={e => set('observation')(e.target.value)}
            placeholder="What did you observe? Be specific — this feeds the dashboard."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </Field>
        <SubmitButton label="Submit Feedback" />
      </form>
      <SubmissionsTable rows={feedbackMock.map(r => ({
        ...r,
        plant: r.anonymous ? r.plant + ' · Anon' : `${r.plant} · ${r.name}`,
      }))} />
    </div>
  );
}

function CmoNotesForm() {
  const [form, setForm] = useState({ plant: '', date: '', area: '', kpi: '', priority: null, observation: '' });
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = e => {
    e.preventDefault();
    console.log('[CMO Note]', form);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <SelectField label="Plant" value={form.plant} onChange={set('plant')} options={PLANT_OPTIONS} />
          <Field label="Date">
            <input type="date" value={form.date} onChange={e => set('date')(e.target.value)} style={inputStyle} />
          </Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <SelectField label="Area" value={form.area} onChange={set('area')} options={AREA_OPTIONS} />
          <Field label="KPI Observed">
            <input
              type="text" value={form.kpi} onChange={e => set('kpi')(e.target.value)}
              placeholder="e.g. Delivery Performance"
              style={inputStyle}
            />
          </Field>
        </div>
        <ScoreSelector value={form.priority} onChange={set('priority')} label="Priority Level (1–5)" />
        <Field label="CMO Observation">
          <textarea
            value={form.observation}
            onChange={e => set('observation')(e.target.value)}
            placeholder="What did you observe? Be specific — this feeds the dashboard."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </Field>
        <SubmitButton label="Save CMO Note" />
      </form>
      <SubmissionsTable rows={cmoMock} showScore scoreLabel="Priority" />
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Inputs() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ padding: '36px 40px', maxWidth: 900 }}>
      {/* Header */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
        Field Inputs
      </h1>
      <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 32px', letterSpacing: '0.04em' }}>
        Structured observations · Curated · Traceable
      </p>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e5e7eb', marginBottom: 28 }}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              padding: '10px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === i ? '2px solid #00c2a8' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: activeTab === i ? 600 : 500,
              color: activeTab === i ? '#00c2a8' : '#6b7280',
              transition: 'color 0.15s',
              marginBottom: -1,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Form panel */}
      <div style={{
        background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '28px 28px',
      }}>
        {activeTab === 0 && <OneOnOneForm />}
        {activeTab === 1 && <EmployeeFeedbackForm />}
        {activeTab === 2 && <CmoNotesForm />}
      </div>
    </div>
  );
}
