import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { register, login } from '../utils/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      const res = await login({ email: form.email, password: form.password });
      loginUser(res.data.user, res.data.token);
      toast.success(`Welcome to Kōdo, ${res.data.user.name}`);
      navigate('/onboarding');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(245,240,232,0.05)',
    border: '0.5px solid rgba(245,240,232,0.15)',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '13px',
    color: '#F5F0E8',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#1C1917',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(232,87,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,87,42,0.04) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />
      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(245,240,232,0.04)',
        border: '0.5px solid rgba(245,240,232,0.1)',
        borderRadius: '20px', padding: '40px',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '24px', fontWeight: 600, color: '#F5F0E8', marginBottom: '4px' }}>Kōdo</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: 700, color: '#F5F0E8', marginBottom: '6px' }}>Create your account</div>
          <div style={{ fontSize: '13px', color: 'rgba(245,240,232,0.4)' }}>Start building with your team today</div>
        </div>

        <form onSubmit={handleRegister}>
          {[
            { label: 'Full name', key: 'name', type: 'text', placeholder: 'e.g. Kamaleswari S' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'you@team.dev' },
            { label: 'Password', key: 'password', type: 'password', placeholder: 'Min. 6 characters' },
          ].map((field) => (
            <div key={field.key} style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', marginBottom: '6px' }}>
                {field.label}
              </div>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                style={inputStyle}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'rgba(232,87,42,0.5)' : '#E8572A',
              border: 'none', borderRadius: '10px', padding: '13px',
              fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
              fontSize: '15px', fontWeight: 700,
              color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '16px', marginTop: '8px',
            }}
          >
            {loading ? 'Creating account...' : 'Create my account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(245,240,232,0.4)' }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: '#E8572A', cursor: 'pointer', fontWeight: 600 }}
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
}