import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import {
  Github,
  GitCommit,
  GitPullRequest,
  Users,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BarChart2
} from 'lucide-react';

export function GitHubEvidencePage({ selectedProjectId }) {
  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(selectedProjectId || '');
  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const projList = await api.getProjects();
        setProjects(projList);
        const activeId = selectedProjectId || (projList.length > 0 ? projList[0].id : '');
        setCurrentProjectId(activeId);
        if (activeId) {
          const evData = await api.getGitHubEvidence(activeId);
          setEvidence(evData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [selectedProjectId]);

  const handleProjectChange = async (newId) => {
    setCurrentProjectId(newId);
    try {
      setLoading(true);
      const evData = await api.getGitHubEvidence(newId);
      setEvidence(evData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !evidence) return <div style={{ padding: '40px', color: '#94a3b8' }}>Loading GitHub evidence audit...</div>;

  const contributors = evidence?.contributors || [];
  const maxCommits = Math.max(...contributors.map(c => c.commits || 0), 1);
  const recentPRs = evidence?.recentPullRequests || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>GitHub Evidence Audit</h1>
            <span className="badge badge-cyan">Faculty Verification Screen</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
            Verify real per-student code contributions, PR reviews, and development consistency before submitting grades.
          </p>
        </div>

        {/* Project Selector */}
        {projects.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Project:</span>
            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={currentProjectId}
              onChange={e => handleProjectChange(e.target.value)}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 4 Core Evidence Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Total Commits</span>
            <GitCommit size={18} style={{ color: '#38bdf8' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '10px' }}>{evidence?.totalCommits || 0}</div>
          <span style={{ fontSize: '0.725rem', color: '#10b981' }}>Verified via GitHub API</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Merged Pull Requests</span>
            <GitPullRequest size={18} style={{ color: '#818cf8' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '10px' }}>{evidence?.mergedPRs || 0}</div>
          <span style={{ fontSize: '0.725rem', color: '#a78bfa' }}>Out of {evidence?.totalPRs || 0} Total PRs</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Closed Issues</span>
            <AlertCircle size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '10px' }}>{evidence?.closedIssues || 0}</div>
          <span style={{ fontSize: '0.725rem', color: '#fbbf24' }}>{evidence?.openIssues || 0} currently open</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Active Authors</span>
            <Users size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '10px' }}>{evidence?.totalContributors || 0}</div>
          <span style={{ fontSize: '0.725rem', color: '#34d399' }}>Verified code authors</span>
        </div>
      </div>

      {/* Per-Member Contribution Breakdown */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={18} style={{ color: '#38bdf8' }} />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Per-Student Contribution Breakdown</h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
              Analyze individual student commits, code churn, and participation balance across the capstone lifecycle.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {contributors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
              No contributor metrics synced yet.
            </div>
          ) : (
            contributors.map((contrib, idx) => {
              const commitRatio = Math.round(((contrib.commits || 0) / maxCommits) * 100);
              return (
                <div
                  key={contrib.login || idx}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={contrib.avatar}
                        alt={contrib.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>
                          {contrib.name || contrib.login}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                          @{contrib.login}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem' }}>
                      <div>
                        <strong style={{ color: '#fff' }}>{contrib.commits}</strong> <span style={{ color: '#94a3b8' }}>commits</span>
                      </div>
                      <div>
                        <span style={{ color: '#10b981' }}>+{contrib.additions || 0}</span> / <span style={{ color: '#f43f5e' }}>-{contrib.deletions || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Relative contribution bar */}
                  <div className="progress-bar-track" style={{ marginTop: '12px', height: '8px' }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${commitRatio}%`,
                        background: idx === 0 ? 'linear-gradient(90deg, #0284c7, #38bdf8)' : 'linear-gradient(90deg, #6366f1, #a78bfa)'
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pull Requests & Merge Audit */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>Pull Requests & Merge State Audit</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentPRs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No pull requests synced.</div>
          ) : (
            recentPRs.map(pr => (
              <div
                key={pr.number}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <GitPullRequest size={16} style={{ color: pr.state === 'merged' ? '#818cf8' : '#38bdf8' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{pr.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                      PR #{pr.number} by <strong>{typeof pr.author === 'object' ? (pr.author?.name || pr.author?.login || 'Contributor') : (pr.author || 'Contributor')}</strong>
                    </div>
                  </div>
                </div>

                <span className={`badge ${pr.state === 'merged' ? 'badge-violet' : 'badge-cyan'}`}>
                  {pr.state === 'merged' ? '✓ Merged' : 'Open'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
