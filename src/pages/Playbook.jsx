import { useState } from 'react';

function ChevronIcon({ open }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function Section({ title, badge, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
      overflow: 'hidden', marginBottom: 12,
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 24px', background: 'none', border: 'none', cursor: 'pointer',
          borderBottom: open ? '1px solid #e5e7eb' : 'none',
          textAlign: 'left',
        }}
      >
        <ChevronIcon open={open} />
        <span style={{ fontWeight: 600, fontSize: 14, color: '#111827', flex: 1 }}>{title}</span>
        {badge && (
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
            background: badge.bg, color: badge.color,
          }}>
            {badge.label}
          </span>
        )}
      </button>
      {open && <div style={{ padding: '24px' }}>{children}</div>}
    </div>
  );
}

function WeekRow({ weeks, label, items }) {
  return (
    <div style={{
      display: 'flex', gap: 16, padding: '12px 0',
      borderBottom: '1px solid #f3f4f6',
    }}>
      <div style={{
        width: 80, flexShrink: 0,
        fontSize: 12, fontWeight: 700, color: '#00c2a8',
        paddingTop: 2,
      }}>
        {weeks}
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 4px' }}>{label}</p>
        {items.map((item, i) => (
          <p key={i} style={{ fontSize: 13, color: '#6b7280', margin: '2px 0' }}>• {item}</p>
        ))}
      </div>
    </div>
  );
}

function DeltaEntry({ from, to, items }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{from}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{to}</span>
        {to.includes('planned') && (
          <span style={{ fontSize: 11, background: '#fef9c3', color: '#a16207', padding: '1px 8px', borderRadius: 10, fontWeight: 600 }}>
            Planned
          </span>
        )}
      </div>
      {items.map((item, i) => (
        <div key={i} style={{
          display: 'flex', gap: 10, padding: '8px 0',
          borderTop: i > 0 ? '1px solid #f9fafb' : 'none',
        }}>
          <span style={{
            width: 20, height: 20, background: '#f0fdf4', color: '#16a34a',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, flexShrink: 0,
          }}>
            ↑
          </span>
          <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>{item}</p>
        </div>
      ))}
    </div>
  );
}

export default function Playbook() {
  return (
    <div style={{ padding: '36px 40px', maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 8 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>
          Manufacturing Transformation Playbook
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4, marginBottom: 0 }}>
          v1.0 · Athens → Valencia → Warsaw
        </p>
      </div>

      {/* Status strip */}
      <div style={{
        display: 'flex', gap: 12, marginTop: 20, marginBottom: 28,
        padding: '14px 20px', background: '#fff', border: '1px solid #e5e7eb',
        borderRadius: 10,
      }}>
        {[
          { label: 'Athens', status: 'Deployed', color: '#22c55e', bg: '#dcfce7' },
          { label: 'Valencia', status: 'In progress', color: '#a16207', bg: '#fef9c3' },
          { label: 'Warsaw', status: 'In progress', color: '#a16207', bg: '#fef9c3' },
          { label: 'JV Sites', status: 'Q4 2026', color: '#6b7280', bg: '#f3f4f6' },
        ].map(({ label, status, color, bg }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: bg, color }}>
              {status}
            </span>
          </div>
        ))}
      </div>

      {/* Sections */}
      <Section title="1. Ramp-Up Phases — Standard Framework" defaultOpen={true}>
        <WeekRow weeks="W1–2" label="Orientation"
          items={['Safety induction & site familiarization', 'ICEYE culture and manufacturing principles', 'SAR technology basics']} />
        <WeekRow weeks="W3–4" label="Shadowing"
          items={['Assembly line shadowing (20h minimum)', 'Quality control observation', 'Cross-functional introductions']} />
        <WeekRow weeks="W5–6" label="Supervised Execution"
          items={['First independent tasks under supervision', 'Escalation paths introduced', 'Manager bi-weekly check-in begins']} />
        <WeekRow weeks="W7–8" label="Integration"
          items={['Cross-functional collaboration', 'Escalation exercise (mandatory from v1)', 'Cross-site peer connection']} />
        <WeekRow weeks="W9–12" label="Full Operational Readiness"
          items={['Independent execution at full capacity', 'Quality control certification', 'Final sign-off & operational handover']} />
      </Section>

      <Section title="2. Leadership Integration">
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>
            Shared Operating Principles
          </p>
          {[
            'Shared leadership operating principles across all plants',
            'Ownership, escalation, and project closure expectations defined',
            'Quarterly leadership offsites supporting alignment and learning',
            'Recurring cross-site execution forums between plant leaders',
            'Onboarding and integration support for new plant leadership teams',
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, padding: '7px 0',
              borderTop: i > 0 ? '1px solid #f3f4f6' : 'none',
            }}>
              <span style={{ color: '#00c2a8', fontWeight: 700, flexShrink: 0 }}>→</span>
              <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>{item}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{
            flex: 1, padding: '14px 18px', background: '#f0fdf9',
            border: '1px solid #99f6e4', borderRadius: 8,
          }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#0d9488', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Escalation Protocol
            </p>
            <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>
              Decisions resolved locally within 48h. Items unresolved after 48h escalate to Helsinki HQ via structured escalation path.
            </p>
          </div>
          <div style={{
            flex: 1, padding: '14px 18px', background: '#eff6ff',
            border: '1px solid #bfdbfe', borderRadius: 8,
          }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#1d4ed8', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Forum Cadence
            </p>
            <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>
              Monthly cross-site execution forum · Quarterly offsite with CMO · Bi-weekly manager check-ins per plant.
            </p>
          </div>
        </div>
      </Section>

      <Section title="3. Delta Log — Changes Between Deployments">
        <DeltaEntry
          from="Athens"
          to="Valencia"
          items={[
            'W4 shadowing extended to 25h (was 20h) — Athens feedback on insufficient hands-on time',
            'Explicit escalation exercise added in W7 — based on Athens forum observations',
            'Manager sign-off cadence moved to bi-weekly — reduced lag without losing quality',
          ]}
        />
        <DeltaEntry
          from="Valencia"
          to="Warsaw (planned)"
          items={[
            'W6 supervised execution to include cross-site peer shadowing with Athens/Valencia',
            'Leadership integration session added W1 — Warsaw team newly formed',
          ]}
        />
      </Section>

      <Section
        title="4. Next Deployment: Warsaw"
        badge={{ label: 'In progress', bg: '#fef9c3', color: '#a16207' }}
      >
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 16px' }}>
              Warsaw ramp-up is currently in progress. Leadership team formed March 2026.
              Estimated full ramp: Q3 2026.
            </p>
            <div style={{
              padding: '14px 18px', background: '#fef9c3',
              border: '1px solid #fde68a', borderRadius: 8, marginBottom: 12,
            }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#a16207', margin: '0 0 4px' }}>
                NEXT MILESTONE
              </p>
              <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>
                W1 leadership integration session — schedule before further hiring.
              </p>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>
              JV Deployments
            </p>
            {[
              { name: 'Neuss JV 🇩🇪', timeline: 'Q4 2026' },
              { name: 'Japan IHI JV 🇯🇵', timeline: 'Q4 2026' },
              { name: 'Space42 UAE 🇦🇪', timeline: 'Q4 2026' },
            ].map(({ name, timeline }) => (
              <div key={name} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: '1px solid #f3f4f6',
              }}>
                <span style={{ fontSize: 13, color: '#374151' }}>{name}</span>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                  background: '#f3f4f6', color: '#6b7280',
                }}>
                  {timeline}
                </span>
              </div>
            ))}
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 10 }}>
              Pending Playbook v2 — based on Warsaw learnings.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
