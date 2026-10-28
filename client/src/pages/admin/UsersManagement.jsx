import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { Modal } from '../../components/Modal';
import { Users, UserPlus, Shield, School, GraduationCap, Filter, CheckCircle2, XCircle } from 'lucide-react';

export function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New user form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('Student');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [institutionId, setInstitutionId] = useState('');
  const [institutions, setInstitutions] = useState([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    api.getInstitutions().then(setInstitutions).catch(() => {});
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.createUser({ name, email, password, role, department, institutionId: role === 'Coordinator' ? institutionId : undefined });
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setInstitutionId('');
      await fetchUsers();
    } catch (err) {
      alert('Failed to create user: ' + err.message);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await api.updateUser(user.id, { status: newStatus });
      await fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#94a3b8' }}>Loading user directory...</div>;

  const filteredUsers = users.filter(u => {
    if (roleFilter === 'all') return true;
    return u.role?.toLowerCase() === roleFilter.toLowerCase();
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Institutional User Directory</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
            Account provisioning, role management, and access controls for academic personnel
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <UserPlus size={16} /> Provision New User
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', gap: '8px' }}>
        {['all', 'Student', 'Faculty', 'Coordinator', 'Admin'].map(r => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-secondary'}`}
          >
            {r === 'all' ? 'All Roles' : `${r}s`}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name & Email</th>
              <th>Role</th>
              <th>Department / School</th>
              <th>Account Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.email}</div>
                </td>
                <td>
                  <span className={`badge ${
                    user.role === 'Admin' ? 'badge-rose' : user.role === 'Faculty' ? 'badge-cyan' : 'badge-emerald'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.825rem', color: '#cbd5e1' }}>{user.department}</span>
                </td>
                <td>
                  <span className={`badge ${user.status === 'active' ? 'badge-emerald' : 'badge-rose'}`}>
                    {user.status === 'active' ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {user.role !== 'Admin' && (
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`btn btn-sm ${user.status === 'active' ? 'btn-secondary' : 'btn-emerald'}`}
                    >
                      {user.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Provision New User">
        <form onSubmit={handleCreateUser}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Dr. Emily Thorne"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {role === 'Coordinator' && <div className="form-group">
            <label className="form-label">Institution</label>
            <select className="form-control" value={institutionId} onChange={e => setInstitutionId(e.target.value)}>
              <option value="">Assign later — coordinator will create a profile</option>
              {institutions.map(institution => <option key={institution.id} value={institution.id}>{institution.name}{institution.city ? ` · ${institution.city}` : ''}</option>)}
            </select>
          </div>}

          <div className="form-group">
            <label className="form-label">Institutional Email</label>
            <input
              type="email"
              required
              className="form-control"
              placeholder="e.thorne@projectflow.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Initial Password</label>
            <input
              type="password"
              required
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">System Role</label>
              <select className="form-control" value={role} onChange={e => setRole(e.target.value)}>
                <option value="Student">Student</option>
                <option value="Faculty">Faculty Evaluator</option>
                <option value="Coordinator">Institution Coordinator</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-control"
                value={department}
                onChange={e => setDepartment(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
