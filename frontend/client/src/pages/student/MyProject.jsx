import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { Modal } from '../../components/Modal';
import { FolderGit2, Edit3, Calendar, Users, School, CheckCircle, Clock } from 'lucide-react';

export function MyProject() {
  const [project, setProject] = useState(null);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editFacultyId, setEditFacultyId] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjects();
      if (projects.length > 0) {
        const full = await api.getProject(projects[0].id);
        setProject(full);
        setEditName(full.name);
        setEditDescription(full.description);
        setEditFacultyId(full.facultyId || '');
      }
      const faculties = await api.getFaculty().catch(() => []);
      setFacultyList(faculties);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const selectedFaculty = facultyList.find(f => f.id === editFacultyId);
      await api.updateProject(project.id, {
        name: editName,
        description: editDescription,
        facultyId: editFacultyId,
        facultyName: selectedFaculty ? selectedFaculty.name : project.facultyName
      });
      setIsModalOpen(false);
      await fetchProject();
    } catch (err) {
      alert('Failed to update project: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#94a3b8' }}>Loading project...</div>;
  if (!project) return <div style={{ padding: '40px', color: '#94a3b8' }}>No project found.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>My Project Details</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Primary capstone software specifications, metadata, and faculty supervisor
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary">
          <Edit3 size={15} /> Edit Project
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Core Info */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>Project Identity</span>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>{project.name}</h2>
          <p style={{ color: '#94a3b8', marginTop: '10px', fontSize: '0.9rem', lineHeight: 1.6 }}>
            {project.description || 'No description provided.'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '18px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Project Status</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <span className="pulse-dot" />
                <strong style={{ fontSize: '0.9rem', color: '#38bdf8' }}>{project.status}</strong>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Created Date</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <Calendar size={14} style={{ color: '#94a3b8' }} />
                <span style={{ fontSize: '0.85rem' }}>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Supervision & Team Info */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>Supervision & Scope</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '8px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Assigned Faculty Supervisor</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                  <School size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{project.facultyName || 'Dr. Robert Harrison'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Capstone Evaluation Board</div>
                </div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Student Team Leader</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <Users size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{project.leadName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{project.leadEmail}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
              <div style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Team Size</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>{project.teamSize || 4} Members</div>
              </div>
              <div style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Milestones</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>{project.milestonesCount || 3} Defined</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Project Details">
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Project Title</label>
            <input
              type="text"
              required
              className="form-control"
              value={editName}
              onChange={e => setEditName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description & Problem Scope</label>
            <textarea
              className="form-control"
              rows={4}
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Faculty Supervisor</label>
            <select
              className="form-control"
              value={editFacultyId}
              onChange={e => setEditFacultyId(e.target.value)}
            >
              <option value="">Select Faculty...</option>
              {facultyList.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
