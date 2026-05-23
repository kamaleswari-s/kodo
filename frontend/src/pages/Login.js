import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { login } from '../utils/api';
import toast from 'react-hot-toast';

const KodoLogo = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <line x1="20" y1="14" x2="20" y2="66" stroke="#F5F0E8" strokeWidth="7" strokeLinecap="round"/>
    <line x1="20" y1="40" x2="52" y2="14" stroke="#E8572A" strokeWidth="7" strokeLinecap="round"/>
    <line x1="20" y1="40" x2="52" y2="66" stroke="#E8572A" strokeWidth="7" strokeLinecap="round"/>
    <circle cx="58" cy="14" r="9" fill="#0D9E8A"/>
    <circle cx="58" cy="14" r="4" fill="#1C1917"/>
    <circle cx="58" cy="14" r="1.5" fill="#0D9E8A"/>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await login({ email, password });
      loginUser(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}`);
      const workspaces = await fetch('http://localhost:5000/api/workspaces/my', {
        headers: { Authorization: `Bearer ${res.data.token}` }
      }).then(r => r.json());
      if (workspaces.length === 0) {
        navigate('/onboarding');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: theme.input,
    border: `0.5px solid ${theme.inputBorder}`,
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '13px',
    color: theme.text,
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1C1917',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(232,87,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,87,42,0.04) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div style={{
        width: '420px', background: '#141210',
        borderRight: '0.5px solid rgba(245,240,232,0.08)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px', position: 'relative', zIndex: 1,
      }}>
        <div style={{ marginBottom: '24px' }}>
          <KodoLogo size={72} />
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '28px', fontWeight: 600, color: '#F5F0E8', marginBottom: '6px' }}>
          Kōdo
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(245,240,232,0.4)', marginBottom: '40px', textAlign: 'center' }}>
          The developer's way
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          {[
            { icon: '⚡', title: 'Real-time board', desc: 'Tasks update live for your whole team' },
            { icon: '✦', title: 'AI assistant', desc: 'Standups, blockers, code review' },
            { icon: '💻', title: 'Snippet library', desc: 'Save and share reusable code' },
            { icon: '📄', title: 'Wiki', desc: 'Documentation that lives next to your code' },
          ].map((f) => (
            <div key={f.title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(232,87,42,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#F5F0E8', marginBottom: '2px' }}>{f.title}</div>
                <div style={{ fontSize: '12px', color: 'rgba(245,240,232,0.4)' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          width: '100%', maxWidth: '400px',
          background: 'rgba(245,240,232,0.04)',
          border: '0.5px solid rgba(245,240,232,0.1)',
          borderRadius: '20px', padding: '40px',
        }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 700, color: '#F5F0E8', marginBottom: '6px' }}>
            Welcome back
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(245,240,232,0.4)', marginBottom: '28px' }}>
            Sign in to your Kōdo workspace
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', marginBottom: '6px' }}>
                Email
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@team.dev"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', marginBottom: '6px' }}>
                Password
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'rgba(232,87,42,0.5)' : '#E8572A',
                border: 'none', borderRadius: '10px',
                padding: '13px',
                fontFamily: 'Playfair Display, serif',
                fontStyle: 'italic',
                fontSize: '15px', fontWeight: 700,
                color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
              }}
            >
              {loading ? 'Signing in...' : 'Sign in to Kōdo'}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(245,240,232,0.4)' }}>
            No account?{' '}
            <span
              onClick={() => navigate('/register')}
              style={{ color: '#E8572A', cursor: 'pointer', fontWeight: 600 }}
            >
              Create one free
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}