import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { FolderGit2, GraduationCap, School, Building2, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export function AuthPage({ initialTab = 'login', onBackToHome }) {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(initialTab === 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [institutionDetails, setInstitutionDetails] = useState({ name: '', type: 'college', city: '', state: '', country: '', address: '', website: '', description: '', logoUrl: '', coverUrl: '' });
  const [registrationRole, setRegistrationRole] = useState('Student');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        // Register but do NOT auto-login — redirect to login with success message
        const registration = { name, email, password, role, department };
        if (role === 'Coordinator') registration.institution = institutionDetails;
        await api.register(registration);
        setRegistrationRole(role);
        setRegistrationSuccess(true);
        setIsRegister(false);
        // Clear registration fields
        setName('');
        setPassword('');
        setRole('Student');
        setDepartment('Computer Science & Engineering');
        setInstitutionDetails({ name: '', type: 'college', city: '', state: '', country: '', address: '', website: '', description: '', logoUrl: '', coverUrl: '' });
        // Keep email so user can login immediately
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message);
      setRegistrationSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail, userPass) => {
    setError(null);
    setRegistrationSuccess(false);
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
        {/* Back to Homepage */}
        {onBackToHome && (
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={onBackToHome}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 500,
                fontFamily: 'var(--font-main)',
                padding: '6px 0',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#38bdf8'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; }}
              aria-label="Back to homepage"
            >
              <ArrowLeft size={16} />
              Back to Homepage
            </button>
          </div>
        )}

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
              onClick={() => { setIsRegister(true); setError(null); setRegistrationSuccess(false); }}
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

          {/* Registration Success Message */}
          {registrationSuccess && !isRegister && (
            <div style={{
              padding: '14px 16px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '10px',
              color: '#34d399',
              fontSize: '0.85rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              lineHeight: 1.5
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>{registrationRole === 'Coordinator' ? 'Coordinator account and institution created!' : 'Account Created Successfully!'}</div>
                <div style={{ color: '#86efac' }}>Please sign in with your credentials to access your dashboard.</div>
              </div>
            </div>
          )}

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
                    <option value="Coordinator">Coordinator (Create and manage an institution)</option>
                    <option value="Faculty">Faculty (Evaluator / Supervisor)</option>
                    <option value="Student">Student (Project Member / Lead)</option>
                  </select>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                    Choose the role that matches your work in ProjectFlow.
                  </span>
                </div>

                {role === 'Coordinator' && <section className="coord-registration-fields">
                  <div className="coord-registration-heading">
                    <span className="coord-eyebrow">FIRST COORDINATOR SETUP</span>
                    <h3>Create your institution profile</h3>
                    <p>The first coordinator creates the institution. You can finish branches, sessions and batches after signing in.</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Official institution name</label>
                    <input type="text" required maxLength="140" className="form-control" value={institutionDetails.name} onChange={e => setInstitutionDetails({ ...institutionDetails, name: e.target.value })} placeholder="e.g. North Valley College" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Institution type</label>
                    <select className="form-control" required value={institutionDetails.type} onChange={e => setInstitutionDetails({ ...institutionDetails, type: e.target.value })}>
                      <option value="college">College</option><option value="university">University</option><option value="school">School</option>
                    </select>
                  </div>
                  <div className="coord-registration-grid">
                    <div className="form-group"><label className="form-label">City</label><input className="form-control" value={institutionDetails.city} onChange={e => setInstitutionDetails({ ...institutionDetails, city: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">State</label><input className="form-control" value={institutionDetails.state} onChange={e => setInstitutionDetails({ ...institutionDetails, state: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Country</label><input className="form-control" value={institutionDetails.country} onChange={e => setInstitutionDetails({ ...institutionDetails, country: e.target.value })} /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Address</label><input className="form-control" value={institutionDetails.address} onChange={e => setInstitutionDetails({ ...institutionDetails, address: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Official website (optional)</label><input type="url" className="form-control" value={institutionDetails.website} onChange={e => setInstitutionDetails({ ...institutionDetails, website: e.target.value })} placeholder="https://example.edu" /></div>
                  <div className="form-group"><label className="form-label">Public description (optional)</label><textarea className="form-control" rows="3" maxLength="1200" value={institutionDetails.description} onChange={e => setInstitutionDetails({ ...institutionDetails, description: e.target.value })} /></div>
                  <div className="coord-registration-grid">
                    <div className="form-group"><label className="form-label">Logo image URL (optional)</label><input type="url" className="form-control" value={institutionDetails.logoUrl} onChange={e => setInstitutionDetails({ ...institutionDetails, logoUrl: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Cover image URL (optional)</label><input type="url" className="form-control" value={institutionDetails.coverUrl} onChange={e => setInstitutionDetails({ ...institutionDetails, coverUrl: e.target.value })} /></div>
                  </div>
                </section>}

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
              {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
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
                onClick={() => handleQuickLogin('coordinator@projectflow.edu', 'password123')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'space-between', padding: '10px 14px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={16} style={{ color: '#a78bfa' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>Coordinator (Dr. Arthur Vance)</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>coordinator@projectflow.edu</div>
                  </div>
                </div>
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Coordinator</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
