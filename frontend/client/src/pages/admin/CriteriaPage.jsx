import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { Modal } from '../../components/Modal';
import { Sliders, Plus, Edit2, Trash2, Shield, GitCommit, GitPullRequest, FileText, CheckCircle2 } from 'lucide-react';

export function CriteriaPage() {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [minCommits, setMinCommits] = useState(5);
  const [minPRs, setMinPRs] = useState(1);
  const [minMergedPRs, setMinMergedPRs] = useState(1);
  const [minClosedIssues, setMinClosedIssues] = useState(1);
  const [requiredDocType, setRequiredDocType] = useState('SRS');

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      const list = await api.getCriteria();
      setCriteria(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, []);

  const openCreateModal = () => {
    setEditingCriteria(null);
    setName('');
    setDescription('');
    setMinCommits(10);
    setMinPRs(2);
    setMinMergedPRs(2);
    setMinClosedIssues(2);
    setRequiredDocType('Architecture Design');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingCriteria(item);
    setName(item.name);
    setDescription(item.description || '');
    setMinCommits(item.minCommits || 0);
    setMinPRs(item.minPRs || 0);
    setMinMergedPRs(item.minMergedPRs || 0);
    setMinClosedIssues(item.minClosedIssues || 0);
    setRequiredDocType(item.requiredDocType || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        description,
        minCommits: parseInt(minCommits, 10),
        minPRs: parseInt(minPRs, 10),
        minMergedPRs: parseInt(minMergedPRs, 10),
        minClosedIssues: parseInt(minClosedIssues, 10),
        requiredDocType
      };

      if (editingCriteria) {
        await api.updateCriteria(editingCriteria._id || editingCriteria.id, payload);
      } else {
        await api.createCriteria(payload);
      }

      setIsModalOpen(false);
      await fetchCriteria();
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this milestone criteria rule? Projects evaluating this milestone may be affected.')) return;
    try {
      await api.deleteCriteria(id);
      await fetchCriteria();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#94a3b8' }}>Loading criteria configuration...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Milestone Automation Criteria Engine</h1>
            <span className="badge badge-rose">Admin Configuration</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
            Configure the quantitative thresholds and required artifacts that automatically drive student milestone progression.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} /> Create Criteria Rule
        </button>
      </div>

      {/* Criteria Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {criteria.map((item) => (
          <div
            key={item._id || item.id}
            className="glass-panel"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="badge badge-cyan">{item.code || 'Rule'}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => openEditModal(item)} className="btn-icon" title="Edit Rule">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(item._id || item.id)} className="btn-icon" title="Delete Rule" style={{ color: '#fb7185' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '12px', color: '#fff' }}>
                {item.name}
              </h2>
              <p style={{ fontSize: '0.825rem', color: '#94a3b8', marginTop: '6px', lineHeight: 1.5 }}>
                {item.description}
              </p>

              {/* Thresholds Table */}
              <div style={{
                marginTop: '20px',
                padding: '14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(0,0,0,0.25)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                fontSize: '0.775rem'
              }}>
                <div>
                  <span style={{ color: '#64748b' }}>Minimum Commits:</span>
                  <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.9rem', marginTop: '2px' }}>
                    {item.minCommits} commits
                  </div>
                </div>

                <div>
                  <span style={{ color: '#64748b' }}>Minimum Pull Requests:</span>
                  <div style={{ fontWeight: 700, color: '#818cf8', fontSize: '0.9rem', marginTop: '2px' }}>
                    {item.minPRs} PRs ({item.minMergedPRs} merged)
                  </div>
                </div>

                <div>
                  <span style={{ color: '#64748b' }}>Closed Issues:</span>
                  <div style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.9rem', marginTop: '2px' }}>
                    {item.minClosedIssues} issues
                  </div>
                </div>

                <div>
                  <span style={{ color: '#64748b' }}>Required Document:</span>
                  <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.9rem', marginTop: '2px' }}>
                    {item.requiredDocType || 'None'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCriteria ? 'Edit Milestone Criteria' : 'Create Milestone Criteria'}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Criteria Rule Name</label>
            <input
              type="text"
              required
              className="form-control"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description & Learning Outcomes</label>
            <textarea
              rows={2}
              className="form-control"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Minimum Commits</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={minCommits}
                onChange={e => setMinCommits(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Minimum PRs</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={minPRs}
                onChange={e => setMinPRs(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Minimum Merged PRs</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={minMergedPRs}
                onChange={e => setMinMergedPRs(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Minimum Closed Issues</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={minClosedIssues}
                onChange={e => setMinClosedIssues(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Required Document Artifact</label>
            <select
              className="form-control"
              value={requiredDocType}
              onChange={e => setRequiredDocType(e.target.value)}
            >
              <option value="">No document requirement</option>
              <option value="SRS">SRS (Requirements Specification)</option>
              <option value="Architecture Design">Architecture Design & Diagrams</option>
              <option value="Final Report">Final Report</option>
              <option value="User Manual">User Manual</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Rule Configuration
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
