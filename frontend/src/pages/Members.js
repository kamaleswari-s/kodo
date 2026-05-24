import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getWorkspaceMembers } from '../utils/api';
import toast from 'react-hot-toast';

export default function Members() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const context = useOutletContext();
  const currentWorkspace = context?.currentWorkspace;
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    if (currentWorkspace) fetchMembers();
  }, [currentWorkspace]);

  const fetchMembers = async () => {
    try {
      const res = await getWorkspaceMembers(currentWorkspace.id);
      setMembers(res.data);
    } catch (err) {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentWorkspace.invite_code);
    setCopied(true);
    toast.success('Invite code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/register?invite=${currentWorkspace.invite_code}`;
    navigator.clipboard.writeText(link);
    toast.success('Invite link copied to clipboard');
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case 'owner': return { bg: 'rgba(232,87,42,0.15)', color: '#E8572A' };
      case 'admin': return { bg: 'rgba(108,92,231,0.15)', color: '#6C5CE7' };
      case 'member': return { bg: 'rgba(13,158,138,0.15)', color: '#0D9E8A' };
      case 'viewer': return { bg: 'rgba(155,152,144,0.15)', color: '#9B9890' };
      default: return { bg: 'rgba(155,152,144,0.15)', color: '#9B9890' };
    }
  };

  const avatarColors = ['#E8572A', '#0D9E8A', '#6C5CE7', '#F0A500', '#9B7FA6', '#1B2A4A'];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 700, color: theme.text, marginBottom: '4px' }}>
            Team members
          </div>
          <div style={{ fontSize: '13px', color: theme.textSecondary }}>
            {members.length} member{members.length !== 1 ? 's' : ''} in {currentWorkspace?.name}
          </div>
        </div>
        <button
          onClick={() => setShowInvite(!showInvite)}
          style={{ background: '#E8572A', border: 'none', borderRadius: '10px', padding: '10px 20px', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}
        >
          + Invite teammate
        </button>
      </div>

      {showInvite && (
        <div style={{ background: theme.card, border: `0.5px solid rgba(232,87,42,0.3)`, borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: 700, color: theme.text, marginBottom: '6px' }}>
            Invite your teammates
          </div>
          <div style={{ fontSize: '13px', color: theme.textSecondary, marginBottom: '20px' }}>
            Share the invite code or link with your teammates. They sign up and enter the code to join your workspace instantly.
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: theme.textMuted, marginBottom: '8px' }}>
              Invite code
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '28px', fontWeight: 700, color: '#E8572A', letterSpacing: '0.15em', background: theme.bg, border: `0.5px solid ${theme.cardBorder}`, borderRadius: '10px', padding: '12px 20px', flex: 1, textAlign: 'center' }}>
                {currentWorkspace?.invite_code}
              </div>
              <button
                onClick={handleCopyCode}
                style={{ background: copied ? 'rgba(13,158,138,0.15)' : 'rgba(232,87,42,0.1)', border: `0.5px solid ${copied ? 'rgba(13,158,138,0.3)' : 'rgba(232,87,42,0.3)'}`, borderRadius: '10px', padding: '12px 20px', fontSize: '13px', fontWeight: 600, color: copied ? '#0D9E8A' : '#E8572A', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {copied ? '✓ Copied' : 'Copy code'}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: theme.textMuted, marginBottom: '8px' }}>
              Or share a direct link
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: theme.textMuted, background: theme.bg, border: `0.5px solid ${theme.cardBorder}`, borderRadius: '10px', padding: '10px 14px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {window.location.origin}/register?invite={currentWorkspace?.invite_code}
              </div>
              <button
                onClick={handleCopyLink}
                style={{ background: 'rgba(108,92,231,0.1)', border: '0.5px solid rgba(108,92,231,0.3)', borderRadius: '10px', padding: '10px 16px', fontSize: '12px', fontWeight: 600, color: '#6C5CE7', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Copy link
              </button>
            </div>
          </div>

          <div style={{ background: 'rgba(13,158,138,0.08)', border: '0.5px solid rgba(13,158,138,0.2)', borderRadius: '10px', padding: '12px 16px' }}>
            <div style={{ fontSize: '12px', color: '#0D9E8A', fontWeight: 600, marginBottom: '4px' }}>How it works</div>
            <div style={{ fontSize: '12px', color: theme.textSecondary, lineHeight: 1.6 }}>
              1. Share the code or link with your teammate<br />
              2. They go to Kōdo and click "Create account"<br />
              3. After signing up they click "Join with an invite code"<br />
              4. They enter the code and join your workspace instantly
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: theme.textMuted }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {members.map((member, index) => {
            const roleStyle = getRoleStyle(member.role);
            const avatarColor = avatarColors[index % avatarColors.length];
            const isCurrentUser = member.id === user?.id;
            return (
              <div
                key={member.id}
                style={{ background: theme.card, border: `0.5px solid ${theme.cardBorder}`, borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: avatarColor, color: '#fff', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {member.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: theme.text }}>{member.name}</span>
                    {isCurrentUser && (
                      <span style={{ fontSize: '10px', background: 'rgba(245,240,232,0.1)', color: theme.textMuted, padding: '1px 6px', borderRadius: '10px' }}>you</span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: theme.textMuted }}>{member.email}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ background: roleStyle.bg, color: roleStyle.color, fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '20px', textTransform: 'capitalize' }}>
                    {member.role}
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: theme.textMuted, fontFamily: 'JetBrains Mono, monospace' }}>
                      Joined {new Date(member.joined_at).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && members.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', background: theme.card, border: `0.5px solid ${theme.cardBorder}`, borderRadius: '14px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>👥</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 700, color: theme.text, marginBottom: '6px' }}>No teammates yet</div>
          <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '16px' }}>Share your invite code to bring your team into Kōdo</div>
          <button onClick={() => setShowInvite(true)} style={{ background: '#E8572A', border: 'none', borderRadius: '8px', padding: '10px 20px', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
            Invite teammates
          </button>
        </div>
      )}
    </div>
  );
}