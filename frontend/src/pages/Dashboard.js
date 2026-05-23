import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getProjects, getTasks, getActivity, createProject } from '../utils/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const context = useOutletContext();
  const currentWorkspace = context?.currentWorkspace;
  const [projects, setProjects] = useState([]);
  const [activity, setActivity] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentWorkspace) {
      fetchData();
    }
  }, [currentWorkspace]);

  const fetchData = async () => {
    try {
      const [projectsRes, activityRes] = await Promise.all([
        getProjects(currentWorkspace.id),
        getActivity(currentWorkspace.id),
      ]);
      setProjects(projectsRes.data);
      setActivity(activityRes.data.slice(0, 8));
      let total = 0, todo = 0, inProgress = 0, done = 0;
      for (const project of projectsRes.data) {
        const tasksRes = await getTasks(project.id);
        tasksRes.data.forEach((t) => {
          total++;
          if (t.status === 'todo') todo++;
          else if (t.status === 'in_progress') inProgress++;
          else if (t.status === 'done') done++;
        });
      }
      setStats({ total, todo, inProgress, done });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      toast.error('Enter a project name');
      return;
    }
    try {
      await createProject({
        workspace_id: currentWorkspace.id,
        name: newProjectName,
        description: newProjectDesc,
      });
      toast.success('Project created');
      setShowNewProject(false);
      setNewProjectName('');
      setNewProjectDesc('');
      fetchData();
      context?.fetchProjects(currentWorkspace.id);
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString('en-IN');
  };

  const cardStyle = {
    background: theme.card,
    border: `0.5px solid ${theme.cardBorder}`,
    borderRadius: '14px',
    padding: '18px 20px',
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
    marginBottom: '10px',
  };

  if (!currentWorkspace) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 700, color: theme.text, marginBottom: '8px' }}>No workspace yet</div>
        <div style={{ fontSize: '14px', color: theme.textSecondary, marginBottom: '24px' }}>Create or join a workspace to get started</div>
        <button onClick={() => navigate('/onboarding')} style={{ background: '#E8572A', border: 'none', borderRadius: '10px', padding: '12px 28px', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
          Get started
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 700, color: theme.text, marginBottom: '4px' }}>
            Good day, {user?.name?.split(' ')[0]}
          </div>
          <div style={{ fontSize: '13px', color: theme.textSecondary }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <button
          onClick={() => setShowNewProject(!showNewProject)}
          style={{ background: '#E8572A', border: 'none', borderRadius: '10px', padding: '10px 20px', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}
        >
          + New project
        </button>
      </div>

      {showNewProject && (
        <div style={{ ...cardStyle, marginBottom: '20px', border: `0.5px solid rgba(232,87,42,0.3)` }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: theme.text, marginBottom: '14px' }}>Create new project</div>
          <form onSubmit={handleCreateProject}>
            <input type="text" placeholder="Project name" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} style={inputStyle} autoFocus />
            <input type="text" placeholder="Description (optional)" value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)} style={inputStyle} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ background: '#E8572A', border: 'none', borderRadius: '8px', padding: '9px 20px', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Create project</button>
              <button type="button" onClick={() => setShowNewProject(false)} style={{ background: 'transparent', border: `0.5px solid ${theme.cardBorder}`, borderRadius: '8px', padding: '9px 20px', fontSize: '13px', color: theme.textSecondary, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total tasks', value: stats.total, color: '#E8572A' },
          { label: 'To do', value: stats.todo, color: '#9B9890' },
          { label: 'In progress', value: stats.inProgress, color: '#F0A500' },
          { label: 'Done', value: stats.done, color: '#0D9E8A' },
        ].map((stat) => (
          <div key={stat.label} style={cardStyle}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: theme.textMuted, marginBottom: '10px' }}>{stat.label}</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '36px', fontWeight: 700, color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0D9E8A' }} />
              <span style={{ fontSize: '10px', color: '#0D9E8A' }}>Live</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={cardStyle}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: theme.text, marginBottom: '14px' }}>Projects</div>
          {loading ? (
            <div style={{ color: theme.textMuted, fontSize: '13px' }}>Loading...</div>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '12px' }}>No projects yet</div>
              <button onClick={() => setShowNewProject(true)} style={{ background: '#E8572A', border: 'none', borderRadius: '8px', padding: '8px 16px', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '12px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
                Create first project
              </button>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/board/${project.id}`)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '6px', border: `0.5px solid ${theme.cardBorder}` }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(232,87,42,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: theme.text }}>{project.name}</div>
                  <div style={{ fontSize: '11px', color: theme.textMuted }}>{project.task_count} tasks · {project.done_count} done</div>
                </div>
                <span style={{ color: '#E8572A', fontSize: '16px' }}>→</span>
              </div>
            ))
          )}
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0D9E8A' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: theme.text }}>Live activity</span>
          </div>
          {activity.length === 0 ? (
            <div style={{ fontSize: '13px', color: theme.textMuted, textAlign: 'center', padding: '24px 0' }}>No activity yet</div>
          ) : (
            activity.map((a) => (
              <div key={a.id} style={{ display: 'flex', gap: '10px', paddingBottom: '10px', marginBottom: '10px', borderBottom: `0.5px solid ${theme.cardBorder}` }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#E8572A', color: '#fff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {a.user_name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: theme.textSecondary, lineHeight: 1.5 }}>
                    <span style={{ fontWeight: 600, color: theme.text }}>{a.user_name}</span> {a.action}
                    {a.entity_name && <span style={{ color: '#E8572A', fontWeight: 600 }}> {a.entity_name}</span>}
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: theme.textMuted, marginTop: '2px' }}>{formatTime(a.created_at)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}