import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FolderGit2, GraduationCap, School, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export function AuthPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        await register({ name, email, password, role, department });
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail, userPass) => {
    setError(null);
    setLoading(true);
    try {
      await login(userEmail, userPass);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative'
    }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            margin: '0 auto 16px auto',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(2, 132, 199, 0.45)'
          }}>
            <FolderGit2 size={28} />
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Project<span style={{ color: '#38bdf8' }}>Flow</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
            Academic software lifecycle & automated GitHub milestone evaluation
          </p>
        </div>

        {/* Form Panel */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <button
              onClick={() => { setIsRegister(false); setError(null); }}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '8px',
                border: 'none',
                background: !isRegister ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                color: !isRegister ? '#38bdf8' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsRegister(true); setError(null); }}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '8px',
                border: 'none',
                background: isRegister ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                color: isRegister ? '#38bdf8' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Register
            </button>
          </div>

          {error && (
            <div style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '8px',
              color: '#fb7185',
              fontSize: '0.825rem',
              marginBottom: '18px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Chen"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Institutional Email</label>
              <input
                type="email"
                required
                placeholder="name@university.edu"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {isRegister && (
              <>
                <div className="form-group">
                  <label className="form-label">Select Role</label>
                  <select
                    className="form-control"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Student">Student (Project Member / Lead)</option>
                    <option value="Faculty">Faculty (Evaluator / Supervisor)</option>
                  </select>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                    Note: Admin accounts are managed by IT Administration.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Department / School</label>
                  <input
                    type="text"
                    className="form-control"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '8px', padding: '12px' }}
            >
              {loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Turnkey Demo Logins */}
          <div style={{ marginTop: '28px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <Sparkles size={14} style={{ color: '#38bdf8' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1-Click Instant Demo Roles
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('alex.chen@student.edu', 'password123')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'space-between', padding: '10px 14px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GraduationCap size={16} style={{ color: '#34d399' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>Student (Alex Chen)</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>alex.chen@student.edu</div>
                  </div>
                </div>
                <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('dr.harrison@projectflow.edu', 'password123')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'space-between', padding: '10px 14px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <School size={16} style={{ color: '#38bdf8' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>Faculty (Dr. Robert Harrison)</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>dr.harrison@projectflow.edu</div>
                  </div>
                </div>
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Faculty</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@projectflow.edu', 'admin123')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'space-between', padding: '10px 14px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} style={{ color: '#fb7185' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>Administrator (Dr. Arthur Vance)</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>admin@projectflow.edu</div>
                  </div>
                </div>
                <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
