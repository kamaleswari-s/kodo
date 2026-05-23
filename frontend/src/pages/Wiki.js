import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getWikiPages, getWikiPage, createWikiPage, updateWikiPage, deleteWikiPage } from '../utils/api';
import toast from 'react-hot-toast';

export default function Wiki() {
  const { projectId } = useParams();
  const { theme } = useTheme();
  const [pages, setPages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, [projectId]);

  const fetchPages = async () => {
    try {
      const res = await getWikiPages(projectId);
      setPages(res.data);
      if (res.data.length > 0) setSelected(res.data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      toast.error('Enter a page title');
      return;
    }
    try {
      const res = await createWikiPage({
        project_id: parseInt(projectId),
        title: newTitle,
        content: `# ${newTitle}\n\nStart writing here...`,
      });
      toast.success('Page created');
      setShowNew(false);
      setNewTitle('');
      await fetchPages();
      setSelected(res.data);
      setEditing(true);
      setEditForm({ title: res.data.title, content: res.data.content });
    } catch (err) {
      toast.error('Failed to create page');
    }
  };

  const handleSave = async () => {
    try {
      await updateWikiPage(selected.id, { title: editForm.title, content: editForm.content });
      toast.success('Page saved');
      setEditing(false);
      fetchPages();
    } catch (err) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this page?')) return;
    try {
      await deleteWikiPage(selected.id);
      toast.success('Page deleted');
      setSelected(null);
      fetchPages();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const inputStyle = {
    width: '100%',
    background: theme.input,
    border: `0.5px solid ${theme.inputBorder}`,
    borderRadius: '8px',
    padding: '9px 12px',
    fontSize: '13px',
    color: theme.text,
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
  };

  const renderContent = (content) => {
    if (!content) return null;
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 700, color: theme.text, marginBottom: '12px', marginTop: '8px' }}>{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 700, color: theme.text, marginBottom: '8px', marginTop: '16px' }}>{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: '15px', fontWeight: 600, color: theme.text, marginBottom: '6px', marginTop: '12px' }}>{line.slice(4)}</h3>;
      if (line.startsWith('- ')) return <li key={i} style={{ fontSize: '14px', color: theme.textSecondary, marginBottom: '4px', marginLeft: '16px' }}>{line.slice(2)}</li>;
      if (line.startsWith('```')) return null;
      if (line === '') return <div key={i} style={{ height: '10px' }} />;
      return <p key={i} style={{ fontSize: '14px', color: theme.textSecondary, lineHeight: 1.7, marginBottom: '6px' }}>{line}</p>;
    });
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 100px)', gap: '16px' }}>
      <div style={{ width: '220px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: theme.textMuted }}>Pages</div>
          <button onClick={() => setShowNew(true)} style={{ background: '#E8572A', border: 'none', borderRadius: '6px', width: '22px', height: '22px', color: '#fff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
        </div>

        {showNew && (
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Page title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ ...inputStyle, marginBottom: '6px', fontSize: '12px', padding: '7px 10px' }}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setShowNew(false); }}
            />
            <div style={{ display: 'flex', gap: '5px' }}>
              <button onClick={handleCreate} style={{ flex: 1, background: '#E8572A', border: 'none', borderRadius: '6px', padding: '5px', fontSize: '11px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Create</button>
              <button onClick={() => setShowNew(false)} style={{ background: 'transparent', border: `0.5px solid ${theme.cardBorder}`, borderRadius: '6px', padding: '5px 8px', fontSize: '11px', color: theme.textMuted, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {loading ? (
            <div style={{ color: theme.textMuted, fontSize: '12px', padding: '10px' }}>Loading...</div>
          ) : pages.length === 0 ? (
            <div style={{ color: theme.textMuted, fontSize: '12px', padding: '10px' }}>No pages yet</div>
          ) : (
            pages.map((page) => (
              <div
                key={page.id}
                onClick={() => { setSelected(page); setEditing(false); }}
                style={{
                  padding: '8px 10px', borderRadius: '8px', cursor: 'pointer',
                  background: selected?.id === page.id ? theme.navActive : 'transparent',
                  borderLeft: selected?.id === page.id ? `2px solid ${theme.navActiveBorder}` : '2px solid transparent',
                  fontSize: '12px', fontWeight: selected?.id === page.id ? 600 : 400,
                  color: selected?.id === page.id ? theme.accent : theme.textSecondary,
                }}
              >
                📄 {page.title}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ flex: 1, background: theme.card, border: `0.5px solid ${theme.cardBorder}`, borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {selected ? (
          <>
            <div style={{ padding: '14px 20px', borderBottom: `0.5px solid ${theme.cardBorder}`, display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              {editing ? (
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  style={{ ...inputStyle, fontSize: '16px', fontWeight: 600, padding: '6px 10px', marginBottom: 0 }}
                />
              ) : (
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 700, color: theme.text, flex: 1 }}>{selected.title}</div>
              )}
              <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto', flexShrink: 0 }}>
                {editing ? (
                  <>
                    <button onClick={handleSave} style={{ background: '#0D9E8A', border: 'none', borderRadius: '8px', padding: '7px 16px', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '12px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Save</button>
                    <button onClick={() => setEditing(false)} style={{ background: 'transparent', border: `0.5px solid ${theme.cardBorder}`, borderRadius: '8px', padding: '7px 12px', fontSize: '12px', color: theme.textSecondary, cursor: 'pointer' }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditing(true); setEditForm({ title: selected.title, content: selected.content || '' }); }} style={{ background: 'rgba(232,87,42,0.1)', border: '0.5px solid rgba(232,87,42,0.3)', borderRadius: '8px', padding: '7px 14px', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '12px', fontWeight: 700, color: '#E8572A', cursor: 'pointer' }}>Edit</button>
                    <button onClick={handleDelete} style={{ background: 'transparent', border: `0.5px solid ${theme.cardBorder}`, borderRadius: '8px', padding: '7px 12px', fontSize: '12px', color: theme.textMuted, cursor: 'pointer' }}>Delete</button>
                  </>
                )}
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
              {editing ? (
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  style={{ ...inputStyle, height: '100%', resize: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: 1.7 }}
                  placeholder="Write in markdown... # Heading, ## Subheading, - bullet point"
                />
              ) : (
                <div>{renderContent(selected.content)}</div>
              )}
            </div>
            <div style={{ padding: '8px 20px', borderTop: `0.5px solid ${theme.cardBorder}`, fontSize: '11px', color: theme.textMuted, flexShrink: 0, fontFamily: 'JetBrains Mono, monospace' }}>
              Last updated {new Date(selected.updated_at).toLocaleString('en-IN')} · by {selected.created_by_name}
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 700, color: theme.text, marginBottom: '6px' }}>No pages yet</div>
              <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '16px' }}>Document your architecture, decisions, and API references</div>
              <button onClick={() => setShowNew(true)} style={{ background: '#E8572A', border: 'none', borderRadius: '8px', padding: '10px 20px', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Create first page</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}