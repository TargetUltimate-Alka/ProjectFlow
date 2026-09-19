import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { Modal } from '../../components/Modal';
import { ListTodo, Plus, CheckCircle, Clock, AlertCircle, Trash2, Edit2 } from 'lucide-react';

export function RequirementsPage() {
  const [requirements, setRequirements] = useState([]);
  const [project, setProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('High');
  const [category, setCategory] = useState('Functional');
  const [loading, setLoading] = useState(true);

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjects();
      if (projects.length > 0) {
        setProject(projects[0]);
        const reqs = await api.getRequirements(projects[0].id);
        setRequirements(reqs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createRequirement(project.id, { title, description, priority, category });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setPriority('High');
      await fetchRequirements();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusChange = async (reqId, newStatus) => {
    try {
      await api.updateRequirement(project.id, reqId, { status: newStatus });
      await fetchRequirements();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (reqId) => {
    if (!window.confirm('Delete this requirement?')) return;
    try {
      await api.deleteRequirement(project.id, reqId);
      await fetchRequirements();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#94a3b8' }}>Loading project requirements...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Software Requirements</h1>
            <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>Student-Authored</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
            Traceable functional and non-functional specifications entered and tracked by the project team
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Add Requirement
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '100px' }}>Req ID</th>
              <th>Requirement Title & Scope</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Verification Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requirements.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No requirements added yet. Click "Add Requirement" to specify your software scope.
                </td>
              </tr>
            ) : (
              requirements.map((req) => (
                <tr key={req._id || req.id}>
                  <td>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#38bdf8',
                      backgroundColor: 'rgba(56, 189, 248, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}>
                      {req.reqCode}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{req.title}</div>
                    {req.description && (
                      <div style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '2px', maxWidth: '500px' }}>
                        {req.description}
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{req.category || 'Functional'}</span>
                  </td>
                  <td>
                    <span className={`badge ${
                      req.priority === 'High' ? 'badge-rose' : req.priority === 'Medium' ? 'badge-amber' : 'badge-cyan'
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-control"
                      style={{ padding: '4px 10px', fontSize: '0.75rem', width: 'auto' }}
                      value={req.status || 'Pending'}
                      onChange={(e) => handleStatusChange(req._id || req.id, e.target.value)}
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="In Progress">🔄 In Progress</option>
                      <option value="Verified">✓ Verified</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleDelete(req._id || req.id)}
                      className="btn-icon"
                      title="Delete Requirement"
                      style={{ color: '#fb7185' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Software Requirement">
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Requirement Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Implement resilient event bus with RabbitMQ fallback"
              className="form-control"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description</label>
            <textarea
              rows={3}
              placeholder="Specify acceptance criteria and boundary constraints..."
              className="form-control"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-control" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Functional">Functional</option>
                <option value="Architecture">Architecture</option>
                <option value="Integration">Integration</option>
                <option value="Security">Security</option>
                <option value="Non-Functional">Non-Functional</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Requirement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
