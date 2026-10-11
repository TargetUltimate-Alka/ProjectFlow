import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { EvidenceList } from '../../components/EvidenceList';
import {
  FolderGit2,
  CheckSquare,
  Award,
  Github,
  Users,
  FileText,
  ListTodo,
  Calendar,
  Clock,
  ArrowLeft,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export function ProjectDetails({ projectId, onBack, onNavigateToEvaluation }) {
  const [data, setData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'requirements' | 'tasks' | 'github' | 'milestones'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [overviewData, taskData] = await Promise.all([
          api.getProjectOverview(projectId),
          api.getTasks(projectId).catch(() => [])
        ]);
        setData(overviewData);
        setTasks(taskData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [projectId]);

  if (loading) return <div style={{ padding: '40px', color: '#94a3b8' }}>Loading project supervision details...</div>;
  if (!data || !data.project) return <div style={{ padding: '40px', color: '#94a3b8' }}>Project not found.</div>;

  const { project, team = [], requirements = [], milestones = [], documents = [], githubStats = {} } = data;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completedMilestones = milestones.filter(m => m.status === 'Completed').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Back Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onBack} className="btn-icon">
            <ArrowLeft size={16} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{project.name}</h1>
              <span className="badge badge-cyan">{project.status}</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '2px' }}>
              Team Lead: <strong style={{ color: '#fff' }}>{project.leadName}</strong> ({project.leadEmail})
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onNavigateToEvaluation} className="btn btn-primary">
            <Award size={16} /> Evaluate Project
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px' }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'requirements', label: `Requirements (${requirements.length})` },
          { id: 'tasks', label: `Tasks (${tasks.length})` },
          { id: 'github', label: 'GitHub Evidence' },
          { id: 'milestones', label: `Milestones (${milestones.length})` }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`btn btn-sm ${activeTab === t.id ? 'btn-primary' : 'btn-secondary'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top 4 Metrics Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Tasks Completed Ratio</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
                {completedTasks} / {tasks.length}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#10b981' }}>
                {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}% Complete
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Milestones Completed Ratio</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
                {completedMilestones} / {milestones.length}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                {milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0}% Complete
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>GitHub Activity Counts</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
                {githubStats?.stats?.totalCommits || 0}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#a78bfa' }}>
                {githubStats?.stats?.mergedPRs || 0} Merged PRs • {githubStats?.stats?.totalContributors || 0} Contribs
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Last Synced Time</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '12px' }}>
                {githubStats?.lastSyncedAt ? new Date(githubStats.lastSyncedAt).toLocaleTimeString() : 'Pending'}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Status: <strong style={{ color: '#34d399' }}>{githubStats?.syncStatus || 'Active'}</strong>
              </span>
            </div>
          </div>

          {/* Project Details & Team Roster */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Scope & Description</h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {project.description || 'No description provided.'}
              </p>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Academic Artifacts Uploaded:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {documents.length === 0 ? (
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>No documents uploaded</span>
                  ) : (
                    documents.map(d => (
                      <span key={d._id || d.id} className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
                        <FileText size={12} /> {d.type}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Student Team Roster</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {team.map((m) => (
                  <div
                    key={m._id || m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0,0,0,0.2)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{m.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.role} • {m.email}</div>
                    </div>
                    {m.isLeader && <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>Leader</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REQUIREMENTS */}
      {activeTab === 'requirements' && (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Req ID</th>
                <th>Requirement Title</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map(r => (
                <tr key={r._id || r.id}>
                  <td><span className="badge badge-cyan" style={{ fontFamily: 'var(--font-mono)' }}>{r.reqCode}</span></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{r.description}</div>
                  </td>
                  <td><span className="badge badge-amber">{r.priority}</span></td>
                  <td><span className="badge badge-emerald">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: TASKS */}
      {activeTab === 'tasks' && (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Assignee</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t._id || t.id}>
                  <td><strong>{t.title}</strong></td>
                  <td>{t.assigneeName}</td>
                  <td><span className="badge badge-cyan" style={{ textTransform: 'capitalize' }}>{t.priority}</span></td>
                  <td><span className={`badge ${t.status === 'completed' ? 'badge-emerald' : 'badge-amber'}`} style={{ textTransform: 'capitalize' }}>{t.status.replace('_', ' ')}</span></td>
                  <td>{t.dueDate || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: GITHUB */}
      {activeTab === 'github' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>GitHub Sync Summary</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(0,0,0,0.25)' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Repository</span>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '4px' }}>{githubStats.repoFullName || 'Connected'}</div>
            </div>
            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(0,0,0,0.25)' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Commits Synchronized</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '4px' }}>{githubStats?.stats?.totalCommits || 0}</div>
            </div>
            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(0,0,0,0.25)' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Pull Requests Merged</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '4px' }}>{githubStats?.stats?.mergedPRs || 0}</div>
            </div>
            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(0,0,0,0.25)' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Issues Closed</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '4px' }}>{githubStats?.stats?.closedIssues || 0}</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MILESTONES */}
      {activeTab === 'milestones' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {milestones.map(ms => (
            <div key={ms._id || ms.criteriaCode} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{ms.name}</h3>
                <span className="badge badge-cyan">{ms.percentage}% Complete</span>
              </div>
              <EvidenceList evidenceList={ms.evidenceList} lastCheckedAt={ms.lastCheckedAt} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
