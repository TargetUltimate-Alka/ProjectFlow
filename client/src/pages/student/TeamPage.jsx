import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { Modal } from '../../components/Modal';
import { Users, UserPlus, Crown, Mail, Shield, Trash2 } from 'lucide-react';

export function TeamPage() {
  const [team, setTeam] = useState([]);
  const [project, setProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Fullstack Developer');
  const [isLeader, setIsLeader] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjects();
      if (projects.length > 0) {
        setProject(projects[0]);
        const members = await api.getTeam(projects[0].id);
        setTeam(members);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.addTeamMember(project.id, { name, email, role, isLeader });
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setRole('Fullstack Developer');
      setIsLeader(false);
      await fetchTeam();
    } catch (err) {
      alert('Failed to add member: ' + err.message);
    }
  };

  const handleRemove = async (memberId) => {
    if (!window.confirm('Remove this member from the team?')) return;
    try {
      await api.removeTeamMember(project.id, memberId);
      await fetchTeam();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#94a3b8' }}>Loading team members...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Capstone Team Members</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Collaborative academic team roster and role designations
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <UserPlus size={16} /> Add Team Member
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {team.map((member) => (
          <div key={member._id || member.id} className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: member.isLeader ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #0284c7, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem'
              }}>
                {member.name ? member.name.charAt(0).toUpperCase() : 'M'}
              </div>

              {member.isLeader ? (
                <span className="badge badge-amber"><Crown size={12} /> Team Leader</span>
              ) : (
                <span className="badge badge-cyan">Contributor</span>
              )}
            </div>

            <div style={{ marginTop: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{member.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 500, marginTop: '2px' }}>
                {member.role}
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '16px',
              padding: '8px 10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0,0,0,0.25)',
              fontSize: '0.775rem',
              color: '#94a3b8'
            }}>
              <Mail size={14} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.email}</span>
            </div>

            {!member.isLeader && (
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleRemove(member._id || member.id)}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Team Member">
        <form onSubmit={handleAddMember}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Jordan Lee"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">University Email</label>
            <input
              type="email"
              required
              className="form-control"
              placeholder="jordan.lee@student.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Designated Role</label>
            <input
              type="text"
              className="form-control"
              value={role}
              onChange={e => setRole(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
            <input
              type="checkbox"
              id="isLeaderCheck"
              checked={isLeader}
              onChange={e => setIsLeader(e.target.checked)}
            />
            <label htmlFor="isLeaderCheck" style={{ fontSize: '0.85rem', color: '#e2e8f0', cursor: 'pointer' }}>
              Designate as Co-Leader
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Member
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
