import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { generateStandup, summarizeProject, getBlockers, breakdownFeature, reviewCode } from '../utils/api';
import toast from 'react-hot-toast';

const QUICK_ACTIONS = [
  { key: 'standup', icon: '📋', label: 'Generate standup', desc: 'Write today\'s standup from your board' },
  { key: 'summarize', icon: '📊', label: 'Summarise project', desc: 'Get an AI overview of progress' },
  { key: 'blockers', icon: '⚠️', label: 'What\'s blocking us?', desc: 'Find stuck tasks and suggest fixes' },
  { key: 'breakdown', icon: '⚡', label: 'Break down a feature', desc: 'Turn a description into tasks' },
  { key: 'review', icon: '🔍', label: 'Review my code', desc: 'Get a score and actionable feedback' },
];

export default function AIAssistant() {
  const { projectId } = useParams();
  const { theme } = useTheme();
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hello! I'm Kōdo AI. I can generate standups from your board, summarise your project, identify blockers, break down features into tasks, and review your code. What would you like to do?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [codeInput, setCodeInput] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('JavaScript');
  const [featureInput, setFeatureInput] = useState('');

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content, time: new Date() }]);
  };

  const handleQuickAction = async (key) => {
    setActiveFeature(key);
    if (key === 'breakdown' || key === 'review') return;
    setLoading(true);
    addMessage('user', QUICK_ACTIONS.find(a => a.key === key).label);
    try {
      let response = '';
      if (key === 'standup') {
        const res = await generateStandup({ project_id: projectId });
        response = res.data.report;
      } else if (key === 'summarize') {
        const res = await summarizeProject({ project_id: projectId });
        response = res.data.summary;
      } else if (key === 'blockers') {
        const res = await getBlockers({ project_id: projectId });
        response = res.data.blockers;
      }
      addMessage('ai', response);
    } catch (err) {
      addMessage('ai', 'Sorry, something went wrong. Please try again.');
      toast.error('AI request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBreakdown = async () => {
    if (!featureInput.trim()) {
      toast.error('Enter a feature description');
      return;
    }
    setLoading(true);
    addMessage('user', `Break down: ${featureInput}`);
    try {
      const res = await breakdownFeature({ feature: featureInput, project_id: projectId });
      const tasks = res.data.tasks;
      const formatted = `Here are ${tasks.length} tasks for "${featureInput}":\n\n${tasks.map((t, i) => `${i + 1}. **${t.title}** (${t.priority})`).join('\n')}`;
      addMessage('ai', formatted);
      setFeatureInput('');
      setActiveFeature(null);
    } catch (err) {
      addMessage('ai', 'Failed to break down the feature. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeReview = async () => {
    if (!codeInput.trim()) {
      toast.error('Paste some code to review');
      return;
    }
    setLoading(true);
    addMessage('user', `Review my ${codeLanguage} code`);
    try {
      const res = await reviewCode({ code: codeInput, language: codeLanguage });
      const r = res.data;
      const formatted = `**Code Review — ${codeLanguage}**\n\nScore: ${r.score}/10 — ${r.verdict}\n\n${r.bugs?.length > 0 ? `Bugs:\n${r.bugs.map(b => `• ${b}`).join('\n')}` : ''}\n\n${r.performance?.length > 0 ? `Performance:\n${r.performance.map(p => `• ${p}`).join('\n')}` : ''}\n\n${r.good_practices?.length > 0 ? `Good practices:\n${r.good_practices.map(g => `• ${g}`).join('\n')}` : ''}`;
      addMessage('ai', formatted);
      setCodeInput('');
      setActiveFeature(null);
    } catch (err) {
      addMessage('ai', 'Failed to review code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: theme.input,
    border: `0.5px solid ${theme.inputBorder}`,
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '13px',
    color: theme.text,
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    colorScheme: 'dark',
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 100px)', gap: '16px' }}>
      <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: theme.textMuted, marginBottom: '4px' }}>Quick actions</div>
        {QUICK_ACTIONS.map((action) => (
          <div
            key={action.key}
            onClick={() => handleQuickAction(action.key)}
            style={{
              background: activeFeature === action.key ? theme.navActive : theme.card,
              border: `0.5px solid ${activeFeature === action.key ? theme.navActiveBorder : theme.cardBorder}`,
              borderRadius: '10px', padding: '12px 14px',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { if (activeFeature !== action.key) e.currentTarget.style.borderColor = theme.accent; }}
            onMouseLeave={(e) => { if (activeFeature !== action.key) e.currentTarget.style.borderColor = theme.cardBorder; }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '16px' }}>{action.icon}</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: theme.text, marginBottom: '2px' }}>{action.label}</div>
                <div style={{ fontSize: '11px', color: theme.textMuted, lineHeight: 1.4 }}>{action.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: theme.card, border: `0.5px solid ${theme.cardBorder}`, borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: `0.5px solid ${theme.cardBorder}`, display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(108,92,231,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✦</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: theme.text }}>Kōdo AI</div>
            <div style={{ fontSize: '10px', color: '#0D9E8A', fontFamily: 'JetBrains Mono, monospace' }}>● Connected to your board</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '80%',
                background: msg.role === 'user' ? '#E8572A' : theme.bg,
                border: msg.role === 'ai' ? `0.5px solid ${theme.cardBorder}` : 'none',
                borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                padding: '12px 16px',
              }}>
                <pre style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: msg.role === 'user' ? '#fff' : theme.text, lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                  {msg.content}
                </pre>
                {msg.time && (
                  <div style={{ fontSize: '10px', color: msg.role === 'user' ? 'rgba(255,255,255,0.6)' : theme.textMuted, marginTop: '6px', fontFamily: 'JetBrains Mono, monospace' }}>
                    {msg.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '5px', padding: '8px 0' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6C5CE7', animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          )}
        </div>

        {activeFeature === 'breakdown' && (
          <div style={{ padding: '12px 16px', borderTop: `0.5px solid ${theme.cardBorder}`, flexShrink: 0 }}>
            <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '6px' }}>Describe the feature to break down</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="e.g. Build a user authentication system with JWT" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} style={{ ...inputStyle, marginBottom: 0 }} onKeyDown={(e) => { if (e.key === 'Enter') handleBreakdown(); }} />
              <button onClick={handleBreakdown} disabled={loading} style={{ background: '#6C5CE7', border: 'none', borderRadius: '8px', padding: '0 16px', color: '#fff', fontSize: '16px', cursor: 'pointer', flexShrink: 0 }}>→</button>
            </div>
          </div>
        )}

        {activeFeature === 'review' && (
          <div style={{ padding: '12px 16px', borderTop: `0.5px solid ${theme.cardBorder}`, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <select value={codeLanguage} onChange={(e) => setCodeLanguage(e.target.value)} style={{ ...inputStyle, marginBottom: 0, width: 'auto' }}>
                {['JavaScript', 'Python', 'Java', 'C++', 'Go', 'TypeScript'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <textarea placeholder="Paste your code here..." value={codeInput} onChange={(e) => setCodeInput(e.target.value)} style={{ ...inputStyle, marginBottom: 0, height: '80px', resize: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }} />
              <button onClick={handleCodeReview} disabled={loading} style={{ background: '#6C5CE7', border: 'none', borderRadius: '8px', padding: '0 16px', color: '#fff', fontSize: '16px', cursor: 'pointer', flexShrink: 0 }}>→</button>
            </div>
          </div>
        )}

        {!activeFeature && (
          <div style={{ padding: '12px 16px', borderTop: `0.5px solid ${theme.cardBorder}`, flexShrink: 0 }}>
            <div style={{ fontSize: '12px', color: theme.textMuted, textAlign: 'center' }}>
              Select a quick action from the left to get started
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }`}</style>
    </div>
  );
}