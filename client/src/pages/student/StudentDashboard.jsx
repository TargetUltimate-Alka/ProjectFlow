import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { EvidenceList } from '../../components/EvidenceList';
import {
  FolderGit2,
  CheckSquare,
  Award,
  Github,
  RefreshCw,
  GitCommit,
  GitPullRequest,
  Users,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';

export function StudentDashboard({ onNavigate }) {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [githubStatus, setGithubStatus] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjects();
      if (projects.length > 0) {
        const activeProj = projects[0];
        setProject(activeProj);

        const [tData, mData, ghData, actData] = await Promise.all([
          api.getTasks(activeProj.id).catch(() => []),
          api.getMilestones(activeProj.id).catch(() => []),
          api.getGitHubStatus(activeProj.id).catch(() => null),
          api.getGitHubActivity(activeProj.id).catch(() => [])
        ]);

        setTasks(tData);
        setMilestones(mData);
        setGithubStatus(ghData);
        setActivity(actData);
      }
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleSyncNow = async () => {
    if (!project) return;
    try {
      setSyncing(true);
      await api.syncGitHub(project.id);
      await loadDashboardData();
    } catch (err) {
      alert('Sync error: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
        Loading student project workspace...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
        <FolderGit2 size={48} style={{ margin: '0 auto 16px auto', color: '#38bdf8' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>No Project Initialized</h2>
        <p style={{ color: '#94a3b8', maxWidth: '460px', margin: '8px auto 24px auto' }}>
          You have not created or joined a capstone software project yet. Initialize your project to begin tracking milestones and GitHub synchronization.
        </p>
        <button onClick={() => onNavigate('my-project')} className="btn btn-primary">
          Create New Project
        </button>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completedMilestones = milestones.filter(m => m.status === 'Completed').length;
  const overallProgress = project.progressPercentage || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(99, 102, 241, 0.08) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-cyan">Capstone v1.0</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Assigned Faculty: <strong style={{ color: '#fff' }}>{project.facultyName || 'Dr. Robert Harrison'}</strong></span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '6px' }}>
            {project.name}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px', maxWidth: '650px' }}>
            {project.description}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSyncNow}
            disabled={syncing}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Synchronizing GitHub...' : 'Sync GitHub Now'}
          </button>
          <button
            onClick={() => onNavigate('my-project')}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            Manage Project <ArrowUpRight size={15} />
          </button>
        </div>
      </div>

      {/* 4 Header Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* Stat 1: Overall Progress */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>Milestone Delivery</span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
              <Award size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '12px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: 800 }}>{overallProgress}%</span>
            <span style={{ fontSize: '0.8rem', color: '#34d399' }}>{completedMilestones}/{milestones.length} Delivered</span>
          </div>
          <div className="progress-bar-track" style={{ marginTop: '14px' }}>
            <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>

        {/* Stat 2: Tasks Completed */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>Tasks Overview</span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <CheckSquare size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '12px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: 800 }}>{completedTasks}/{tasks.length}</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Completed</span>
          </div>
          <div className="progress-bar-track" style={{ marginTop: '14px' }}>
            <div
              className="progress-bar-fill emerald"
              style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Stat 3: GitHub Commits & PRs */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>GitHub Code Evidence</span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
              <Github size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '12px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: 800 }}>{githubStatus?.stats?.totalCommits || 0}</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Commits • <strong>{githubStatus?.stats?.mergedPRs || 0}</strong> Merged PRs
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px', fontSize: '0.75rem', color: '#64748b' }}>
            <span className="pulse-dot" />
            <span>Sync: {githubStatus?.lastSyncedAt ? new Date(githubStatus.lastSyncedAt).toLocaleTimeString() : 'Pending'}</span>
          </div>
        </div>

        {/* Stat 4: Team Contributors */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>Team Participation</span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '12px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: 800 }}>{project.teamSize || 4}</span>
            <span style={{ fontSize: '0.8rem', color: '#38bdf8' }}>Active Contributors</span>
          </div>
          <div style={{ marginTop: '14px', fontSize: '0.75rem', color: '#94a3b8' }}>
            Lead: <strong style={{ color: '#fff' }}>{project.leadName}</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Milestones & GitHub Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Left: Milestones Summary Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Milestone Automation Pipeline</h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                Rule-evaluated progress strictly driven by GitHub evidence
              </p>
            </div>
            <button onClick={() => onNavigate('milestones')} className="btn btn-secondary btn-sm">
              Inspect Evidence
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {milestones.map((ms) => {
              const isDone = ms.status === 'Completed';
              return (
                <div
                  key={ms._id || ms.criteriaCode}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.06)'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${isDone ? 'badge-emerald' : 'badge-amber'}`}>
                        {ms.criteriaCode}
                      </span>
                      <h3 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{ms.name}</h3>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: isDone ? '#34d399' : '#f59e0b' }}>
                      {ms.percentage}%
                    </span>
                  </div>

                  <div className="progress-bar-track" style={{ marginTop: '10px' }}>
                    <div
                      className={`progress-bar-fill ${isDone ? 'emerald' : 'amber'}`}
                      style={{ width: `${ms.percentage}%` }}
                    />
                  </div>

                  <EvidenceList evidenceList={ms.evidenceList} lastCheckedAt={ms.lastCheckedAt} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live GitHub Activity Stream */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Github size={18} style={{ color: '#38bdf8' }} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Synchronized GitHub Activity</h2>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                {githubStatus?.repoFullName || 'Repository Stream'} (Never manually entered)
              </p>
            </div>
            <button onClick={() => onNavigate('github')} className="btn btn-secondary btn-sm">
              View Repository
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activity.slice(0, 7).map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.04)'
                }}
              >
                <div style={{
                  padding: '6px',
                  borderRadius: '6px',
                  background: item.type === 'commit' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                  color: item.type === 'commit' ? '#38bdf8' : '#818cf8',
                  marginTop: '2px'
                }}>
                  {item.type === 'commit' ? <GitCommit size={14} /> : <GitPullRequest size={14} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </span>
                    <span className="badge badge-cyan" style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>
                      {item.badge}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '0.725rem', color: '#94a3b8' }}>
                    <span>{typeof item.author === 'object' ? (item.author?.name || item.author?.login || 'Contributor') : (item.author || 'Contributor')}</span>
                    <span>•</span>
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
