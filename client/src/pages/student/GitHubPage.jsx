import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { Modal } from '../../components/Modal';
import {
  Github,
  RefreshCw,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Users,
  ExternalLink,
  Star,
  GitFork,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';

export function GitHubPage() {
  const [project, setProject] = useState(null);
  const [githubStatus, setGithubStatus] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'activity'

  // Connect form fields
  const [repoUrl, setRepoUrl] = useState('https://github.com/Nandinikanaujiya/ProjectFlow');
  const [token, setToken] = useState('');
  const [useDemoMode, setUseDemoMode] = useState(true);

  const fetchGitHubData = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjects();
      if (projects.length > 0) {
        const proj = projects[0];
        setProject(proj);
        const [status, act] = await Promise.all([
          api.getGitHubStatus(proj.id),
          api.getGitHubActivity(proj.id)
        ]);
        setGithubStatus(status);
        setActivity(act);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubData();
  }, []);

  const handleConnect = async (e) => {
    e.preventDefault();
    try {
      setSyncing(true);
      await api.connectGitHub({
        projectId: project.id,
        repoUrl,
        token: token || null,
        useDemoMode
      });
      setIsConnectModalOpen(false);
      await fetchGitHubData();
    } catch (err) {
      alert('Connection failed: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncNow = async () => {
    try {
      setSyncing(true);
      await api.syncGitHub(project.id);
      await fetchGitHubData();
    } catch (err) {
      alert('Sync failed: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#94a3b8' }}>Loading GitHub status...</div>;

  // 1. BEFORE CONNECTION VIEW
  if (!githubStatus || !githubStatus.connected) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>GitHub Source Control</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Automated code repository integration for academic evaluation
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            color: '#fff'
          }}>
            <Github size={36} />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Connect Your GitHub Repository</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '540px', margin: '10px auto 32px auto', lineHeight: 1.6 }}>
            ProjectFlow automatically inspects your repository to verify development progress without manual entry. When connected, the Integration Service syncs:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            textAlign: 'left',
            marginBottom: '36px'
          }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 600, fontSize: '0.85rem' }}>
                <GitCommit size={16} /> Commits & Code
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                Commit frequency, hashes, branch activity, and message traceability.
              </p>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontWeight: 600, fontSize: '0.85rem' }}>
                <GitPullRequest size={16} /> Pull Requests
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                Code review discussions, merged pull requests, and branch merges.
              </p>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 600, fontSize: '0.85rem' }}>
                <Users size={16} /> Contributors
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                Per-member code contributions to verify equitable team distribution.
              </p>
            </div>
          </div>

          <button onClick={() => setIsConnectModalOpen(true)} className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
            <Github size={18} /> Connect GitHub Repository
          </button>
        </div>

        {/* Connect Modal */}
        <Modal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)} title="Connect GitHub Repository">
          <form onSubmit={handleConnect}>
            <div className="form-group">
              <label className="form-label">Repository URL or Owner/Repo</label>
              <input
                type="text"
                required
                className="form-control"
                value={repoUrl}
                onChange={e => setRepoUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Personal Access Token (Optional)</label>
              <input
                type="password"
                placeholder="ghp_••••••••••••••••••••"
                className="form-control"
                value={token}
                onChange={e => setToken(e.target.value)}
              />
              <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                Required for private repositories. Never exposed to the frontend.
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              marginTop: '16px'
            }}>
              <input
                type="checkbox"
                id="demoMode"
                checked={useDemoMode}
                onChange={e => setUseDemoMode(e.target.checked)}
              />
              <label htmlFor="demoMode" style={{ fontSize: '0.8rem', color: '#e2e8f0', cursor: 'pointer' }}>
                Enable high-fidelity simulated sandbox data if API rate limits occur
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button type="button" onClick={() => setIsConnectModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={syncing} className="btn btn-primary">
                {syncing ? 'Connecting...' : 'Authorize & Connect'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // 2. AFTER CONNECTION VIEW
  const stats = githubStatus.stats || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>GitHub Integration</h1>
            <span className="badge badge-emerald">
              <span className="pulse-dot" /> Connected & Active
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
            Synchronized repository: <strong style={{ color: '#fff' }}>{githubStatus.repoFullName}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href={githubStatus.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <ExternalLink size={15} /> Open Repository
          </a>
          <button
            onClick={handleSyncNow}
            disabled={syncing}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Synchronizing...' : 'Sync Now'}
          </button>
        </div>
      </div>

      {/* Repository Status Header Banner */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Github size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{githubStatus.repoFullName}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={13} style={{ color: '#f59e0b' }} /> {githubStatus.stars} Stars
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <GitFork size={13} /> {githubStatus.forks} Forks
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={13} style={{ color: '#38bdf8' }} /> {githubStatus.openIssues} Open Issues
              </span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Last Synchronized</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginTop: '2px' }}>
            {githubStatus.lastSyncedAt ? new Date(githubStatus.lastSyncedAt).toLocaleString() : 'Pending initial sync'}
          </div>
        </div>
      </div>

      {/* 4 Summary Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Total Commits</span>
            <GitCommit size={18} style={{ color: '#38bdf8' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '10px' }}>{stats.totalCommits || 0}</div>
          <span style={{ fontSize: '0.725rem', color: '#10b981' }}>✓ Synced from API</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Pull Requests</span>
            <GitPullRequest size={18} style={{ color: '#818cf8' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '10px' }}>{stats.totalPRs || 0}</div>
          <span style={{ fontSize: '0.725rem', color: '#a78bfa' }}>
            <strong>{stats.mergedPRs || 0}</strong> Merged • {stats.openPRs || 0} Open
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Issues Closed</span>
            <AlertCircle size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '10px' }}>{stats.closedIssues || 0}</div>
          <span style={{ fontSize: '0.725rem', color: '#fbbf24' }}>
            {stats.openIssues || 0} issues remaining
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Active Contributors</span>
            <Users size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '10px' }}>{stats.totalContributors || 0}</div>
          <span style={{ fontSize: '0.725rem', color: '#34d399' }}>Verified Authors</span>
        </div>
      </div>

      {/* Sub Tabs: Overview & Chronological Activity Feed */}
      <div style={{
        display: 'flex',
        gap: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '12px'
      }}>
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`btn btn-sm ${activeSubTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Activity Timeline Feed
        </button>
        <button
          onClick={() => setActiveSubTab('resilience')}
          className={`btn btn-sm ${activeSubTab === 'resilience' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Sync Health & Resilience
        </button>
      </div>

      {activeSubTab === 'overview' ? (
        /* Chronological Activity Feed */
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Chronological GitHub Activity Stream</h2>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Latest 25 Events</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activity.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                No events recorded. Trigger "Sync Now" to fetch live data.
              </div>
            ) : (
              activity.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: ev.type === 'commit' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                      color: ev.type === 'commit' ? '#38bdf8' : '#818cf8'
                    }}>
                      {ev.type === 'commit' ? <GitCommit size={16} /> : <GitPullRequest size={16} />}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                        {ev.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                        <span>Author: <strong>{typeof ev.author === 'object' ? (ev.author?.name || ev.author?.login || 'Contributor') : (ev.author || 'Contributor')}</strong></span>
                        <span>•</span>
                        <span>{new Date(ev.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-cyan" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                    {ev.badge}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Resilience & Snapshot Audit */
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
            Sync Resilience & Fault-Tolerance Policy
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <strong style={{ color: '#34d399' }}>✓ Last Good Snapshot Guarantee:</strong>
              <p style={{ marginTop: '4px' }}>
                If GitHub API encounters a 403 rate limit, authentication error, or connection drop, ProjectFlow preserves the last valid synchronized snapshot in <code>integration_db</code> and flags the status. Previous valid metrics are never wiped or reset.
              </p>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <strong style={{ color: '#38bdf8' }}>✓ Direct-to-Engine Event Broadcasting:</strong>
              <p style={{ marginTop: '4px' }}>
                Upon successful sync, the Integration Service emits a <code>SyncCompleted</code> event to RabbitMQ / EventBus, immediately waking up the Project Service Milestone Engine to recalculate percentages.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
