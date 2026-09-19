import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { School, FolderGit2, Check, UserCheck } from 'lucide-react';

export function AssignmentsPage() {
  const [projects, setProjects] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pList, fList] = await Promise.all([
        api.getProjects(),
        api.getFaculty().catch(() => [])
      ]);
      setProjects(pList);
      setFacultyList(fList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (projectId, facultyId) => {
    try {
      setSavingId(projectId);
      const selected = facultyList.find(f => f.id === facultyId);
      await api.updateProject(projectId, {
        facultyId: facultyId || null,
        facultyName: selected ? selected.name : 'Unassigned'
      });
      await fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#94a3b8' }}>Loading assignments...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Faculty Supervision Allocations</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
          Assign Capstone Evaluators and Academic Supervisors to student software engineering projects.
        </p>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Project Name & Scope</th>
              <th>Student Team Lead</th>
              <th>Team Size</th>
              <th>Assigned Faculty Supervisor</th>
              <th style={{ textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(proj => (
              <tr key={proj.id}>
                <td>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{proj.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {proj.description}
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{proj.leadName}</span>
                </td>
                <td>
                  <span className="badge badge-cyan">{proj.teamSize} Members</span>
                </td>
                <td>
                  <select
                    className="form-control"
                    style={{ width: 'auto', minWidth: '220px' }}
                    value={proj.facultyId || ''}
                    disabled={savingId === proj.id}
                    onChange={e => handleAssign(proj.id, e.target.value)}
                  >
                    <option value="">-- Unassigned --</option>
                    {facultyList.map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
                    ))}
                  </select>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {proj.facultyId ? (
                    <span className="badge badge-emerald">Assigned</span>
                  ) : (
                    <span className="badge badge-amber">Needs Supervisor</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
