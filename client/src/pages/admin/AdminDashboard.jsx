import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import {
  Users,
  School,
  FolderGit2,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export function AdminDashboard({ onNavigate }) {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [uList, pList, cList] = await Promise.all([
          api.getUsers().catch(() => []),
          api.getProjects().catch(() => []),
          api.getCriteria().catch(() => [])
        ]);
        setUsers(uList);
        setProjects(pList);
        setCriteria(cList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div style={{ padding: '40px', color: '#94a3b8' }}>Loading administration dashboard...</div>;

  const studentCount = users.filter(u => u.role?.toLowerCase() === 'student').length;
  const facultyCount = users.filter(u => u.role?.toLowerCase() === 'faculty').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Platform Administration</h1>
            <span className="badge badge-rose">Institutional Governance</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
            Global capstone directory, user role provisioning, faculty allocation, and institutional oversight.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Active Projects</span>
            <FolderGit2 size={18} style={{ color: '#38bdf8' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '10px' }}>{projects.length}</div>
          <span style={{ fontSize: '0.725rem', color: '#38bdf8' }}>Capstone Teams</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Enrolled Students</span>
            <Users size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '10px' }}>{studentCount}</div>
          <span style={{ fontSize: '0.725rem', color: '#34d399' }}>Project Members</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Faculty Evaluators</span>
            <School size={18} style={{ color: '#818cf8' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '10px' }}>{facultyCount}</div>
          <span style={{ fontSize: '0.725rem', color: '#a78bfa' }}>Supervisors Assigned</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Evaluation Governance</span>
            <ShieldCheck size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '14px', color: '#fbbf24' }}>Faculty Led</div>
          <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Milestone Rules Managed by Faculty</span>
        </div>
      </div>

      {/* Grid: Users Table & Faculty-Project Assignments */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Users Table */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>System Users Directory</h2>
            <button onClick={() => onNavigate('admin-users')} className="btn btn-secondary btn-sm">
              Manage Users <ArrowRight size={13} />
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 6).map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{u.email}</div>
                  </td>
                  <td>
                    <span className={`badge ${
                      u.role === 'Admin' ? 'badge-rose' : u.role === 'Faculty' ? 'badge-cyan' : 'badge-emerald'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Faculty Assignments */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Faculty ↔ Project Allocation</h2>
            <button onClick={() => onNavigate('admin-assignments')} className="btn btn-secondary btn-sm">
              Edit Allocations <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {projects.map(p => (
              <div
                key={p.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                    Lead: {p.leadName} • {p.teamSize} Members
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
                    <School size={12} /> {p.facultyName || 'Unassigned'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
