import { useState, useRef, useEffect } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { mockAlerts, alertSystemPrompt, buildAlertContext } from '../data';

const CHAT_SYSTEM_PROMPT = `You are The Eye, an organizational intelligence assistant for ICEYE's manufacturing transformation platform. You have full visibility into all plant data including Leadership Scores, Workforce Readiness, Delivery Performance, and Onboarding metrics. Answer questions concisely and specifically, referencing actual plant data when relevant.

${buildAlertContext()}`;


const SEVERITY_CONFIG = {
  critical: {
    label: 'Critical',
    icon: '🔴',
    bg: '#fee2e2',
    border: '#fca5a5',
    color: '#dc2626',
    badgeBg: '#dc2626',
  },
  watch: {
    label: 'Watch',
    icon: '🟡',
    bg: '#fef9c3',
    border: '#fde68a',
    color: '#a16207',
    badgeBg: '#a16207',
  },
  insight: {
    label: 'Insight',
    icon: '🔵',
    bg: '#eff6ff',
    border: '#bfdbfe',
    color: '#1d4ed8',
    badgeBg: '#1d4ed8',
  },
};

function AlertCard({ alert }) {
  const sc = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.insight;

  return (
    <div style={{
      background: sc.bg,
      border: `1px solid ${sc.border}`,
      borderRadius: 10,
      padding: '18px 22px',
      marginBottom: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 16 }}>{sc.icon}</span>
        <span style={{
          background: sc.badgeBg,
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: 4,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {sc.label}
        </span>
        <span style={{
          background: 'rgba(0,0,0,0.08)',
          color: '#374151',
          fontSize: 11,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 4,
        }}>
          {alert.area}
        </span>
        {alert.plant && (
          <span style={{
            background: 'rgba(0,0,0,0.06)',
            color: '#6b7280',
            fontSize: 11,
            padding: '2px 8px',
            borderRadius: 4,
          }}>
            {alert.plant}
          </span>
        )}
      </div>

      <p style={{ fontSize: 14, color: '#111827', margin: '0 0 12px', lineHeight: '1.6' }}>
        {alert.text}
      </p>

      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 8,
        padding: '10px 14px',
        background: 'rgba(255,255,255,0.6)',
        borderRadius: 6,
        border: '1px solid rgba(0,0,0,0.06)',
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: sc.color, flexShrink: 0 }}>→</span>
        <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: '1.5' }}>
          <span style={{ fontWeight: 600 }}>Suggested action: </span>
          {alert.action}
        </p>
      </div>
    </div>
  );
}

export default function AIAlerts() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_ANTHROPIC_API_KEY || '');
  const [showKeyInput, setShowKeyInput] = useState(!import.meta.env.VITE_ANTHROPIC_API_KEY);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  async function sendMessage() {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    if (!apiKey.trim()) {
      setError('Please enter your Anthropic API key to use the chat.');
      return;
    }

    const userMsg = { role: 'user', content: text };
    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    setChatInput('');
    setChatLoading(true);

    try {
      const client = new Anthropic({ apiKey: apiKey.trim(), dangerouslyAllowBrowser: true });
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: CHAT_SYSTEM_PROMPT,
        messages: updated,
      });
      const reply = response.content.find(b => b.type === 'text')?.text || '';
      setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${err.message || 'Failed to get response.'}`,
      }]);
    } finally {
      setChatLoading(false);
    }
  }

  async function refreshAlerts() {
    if (!apiKey.trim()) {
      setError('Please enter your Anthropic API key.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const client = new Anthropic({
        apiKey: apiKey.trim(),
        dangerouslyAllowBrowser: true,
      });

      const response = await client.messages.create({
        model: 'claude-sonnet-4-0',
        max_tokens: 1000,
        system: alertSystemPrompt,
        messages: [
          {
            role: 'user',
            content: `Here is the current plant data for analysis:\n\n${buildAlertContext()}\n\nPlease identify the 3 most critical risks, 2 watch items, and 1 cross-site insight. Return JSON array only.`,
          },
        ],
      });

      const textBlock = response.content.find(b => b.type === 'text');
      if (!textBlock) throw new Error('No text response received.');

      // Extract JSON from response
      const raw = textBlock.text.trim();
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('Could not parse JSON from response.');

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate and sanitize
      const newAlerts = parsed.map((item, i) => ({
        id: item.id || `ai-${i}`,
        severity: ['critical', 'watch', 'insight'].includes(item.severity) ? item.severity : 'insight',
        area: item.area || 'Cross-site',
        plant: item.plant || null,
        text: item.text || '',
        action: item.action || '',
      }));

      setAlerts(newAlerts);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      if (err instanceof Anthropic.AuthenticationError) {
        setError('Invalid API key. Please check your Anthropic API key.');
      } else if (err instanceof Anthropic.RateLimitError) {
        setError('Rate limited. Please wait a moment and try again.');
      } else if (err instanceof Anthropic.APIError) {
        setError(`API error: ${err.message}`);
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  const critical = alerts.filter(a => a.severity === 'critical');
  const watch = alerts.filter(a => a.severity === 'watch');
  const insight = alerts.filter(a => a.severity === 'insight');

  return (
    <div style={{ padding: '36px 40px', maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>
            AI Alerts
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginTop: 6, marginBottom: 0 }}>
            Organizational intelligence · Powered by Claude
            {lastRefreshed && (
              <span style={{ marginLeft: 10, color: '#9ca3af', fontSize: 12 }}>
                Last refreshed {lastRefreshed}
              </span>
            )}
          </p>
        </div>

        <button
          onClick={refreshAlerts}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 8,
            background: loading ? '#9ca3af' : '#011C22',
            color: loading ? '#fff' : '#00c2a8',
            fontSize: 13, fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
        >
          {loading ? (
            <>
              <span style={{
                width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff', borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.8s linear infinite',
              }} />
              Analyzing...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Refresh Alerts
            </>
          )}
        </button>
      </div>

      {/* API Key input */}
      {showKeyInput && (
        <div style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
          padding: '20px 24px', marginBottom: 24,
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 4px' }}>
            Anthropic API Key
          </p>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 12px' }}>
            Required to generate AI alerts. Or set <code style={{ background: '#f3f4f6', padding: '1px 4px', borderRadius: 3 }}>VITE_ANTHROPIC_API_KEY</code> in your .env file.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 6,
                border: '1px solid #d1d5db', fontSize: 13, outline: 'none',
                fontFamily: 'monospace',
              }}
            />
            <button
              onClick={() => setShowKeyInput(false)}
              disabled={!apiKey.trim()}
              style={{
                padding: '8px 16px', borderRadius: 6,
                background: apiKey.trim() ? '#011C22' : '#e5e7eb',
                color: apiKey.trim() ? '#00c2a8' : '#9ca3af',
                fontSize: 13, fontWeight: 600, border: 'none', cursor: apiKey.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8,
          padding: '12px 16px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 14 }}>⚠️</span>
          <p style={{ fontSize: 13, color: '#dc2626', margin: 0 }}>{error}</p>
          <button
            onClick={() => setError(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 16 }}
          >
            ×
          </button>
        </div>
      )}

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Critical', count: critical.length, color: '#dc2626', bg: '#fee2e2' },
          { label: 'Watch', count: watch.length, color: '#a16207', bg: '#fef9c3' },
          { label: 'Insight', count: insight.length, color: '#1d4ed8', bg: '#eff6ff' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} style={{
            background: bg, color, borderRadius: 8, padding: '8px 16px',
            fontSize: 13, fontWeight: 600, display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <span style={{
              background: color, color: '#fff', borderRadius: 10,
              fontSize: 11, fontWeight: 700, padding: '0 7px', lineHeight: '18px',
            }}>
              {count}
            </span>
            {label}
          </div>
        ))}
      </div>

      {/* Alerts by severity */}
      {critical.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            🔴 Critical
          </p>
          {critical.map(a => <AlertCard key={a.id} alert={a} />)}
        </div>
      )}

      {watch.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#a16207', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            🟡 Watch
          </p>
          {watch.map(a => <AlertCard key={a.id} alert={a} />)}
        </div>
      )}

      {insight.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            🔵 Insight
          </p>
          {insight.map(a => <AlertCard key={a.id} alert={a} />)}
        </div>
      )}

      {/* Divider */}
      <div style={{ borderTop: '2px solid #e5e7eb', margin: '8px 0 28px' }} />

      {/* Chat section */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 16 }}>💬</span>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Ask The Eye</h2>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>Chat with your plant data</span>
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column',
          height: 480, borderRadius: 12, overflow: 'hidden',
          border: '1px solid #d1d5db',
        }}>
          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: '20px 20px 12px',
            background: '#011C22',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            {chatMessages.length === 0 && (
              <div style={{
                display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 8,
              }}>
                <span style={{ fontSize: 28 }}>🛰️</span>
                <p style={{ fontSize: 13, color: '#4b7a72', margin: 0, textAlign: 'center' }}>
                  Ask about any plant, leadership score,<br />onboarding status, or delivery risk.
                </p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: '#00c2a8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, flexShrink: 0, marginRight: 8, marginTop: 2,
                  }}>
                    A
                  </div>
                )}
                <div style={{
                  maxWidth: '72%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: msg.role === 'user' ? '#00c2a8' : '#0d3540',
                  color: msg.role === 'user' ? '#011C22' : '#e2f4f1',
                  fontSize: 13, lineHeight: '1.6',
                  fontWeight: msg.role === 'user' ? 600 : 400,
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#00c2a8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, flexShrink: 0,
                }}>
                  A
                </div>
                <div style={{
                  padding: '10px 16px', borderRadius: '12px 12px 12px 2px',
                  background: '#0d3540', display: 'flex', gap: 5, alignItems: 'center',
                }}>
                  {[0, 1, 2].map(d => (
                    <span key={d} style={{
                      width: 6, height: 6, borderRadius: '50%', background: '#00c2a8',
                      display: 'inline-block',
                      animation: `pulse 1.2s ease-in-out ${d * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div style={{
            display: 'flex', gap: 0,
            background: '#022a34',
            borderTop: '1px solid #0d3540',
            padding: '12px 14px',
          }}>
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask about plant data, risks, onboarding..."
              style={{
                flex: 1, background: '#0d3540', border: '1px solid #1a4a56',
                borderRadius: '8px 0 0 8px', padding: '10px 14px',
                fontSize: 13, color: '#e2f4f1', outline: 'none',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={chatLoading || !chatInput.trim()}
              style={{
                padding: '10px 18px',
                borderRadius: '0 8px 8px 0',
                background: chatLoading || !chatInput.trim() ? '#1a4a56' : '#00c2a8',
                color: chatLoading || !chatInput.trim() ? '#4b7a72' : '#011C22',
                fontWeight: 700, fontSize: 13, border: 'none',
                cursor: chatLoading || !chatInput.trim() ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* CSS for spinner + pulse */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
