import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Bell, User, LogOut, ChevronDown, CheckCircle, Shield, GraduationCap, School } from 'lucide-react';

export function TopNavbar({
  activeTab,
  onOpenNotifications,
  isTeamWorkspace = false,
  teamSection = 'overview'
}) {
  const { user, logout, quickSwitchUser } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  useEffect(() => {
    async function checkUnread() {
      try {
        const notifs = await api.getNotifications();
        const unread = notifs.filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (e) {}
    }
    checkUnread();
    const interval = setInterval(checkUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <span className="badge badge-rose"><Shield size={12} /> Administrator</span>;
      case 'faculty':
        return <span className="badge badge-cyan"><School size={12} /> Faculty Evaluator</span>;
      default:
        return <span className="badge badge-emerald"><GraduationCap size={12} /> Student Lead</span>;
    }
  };

  const handleQuickSwitch = async (email, password) => {
    setShowSwitchMenu(false);
    await quickSwitchUser(email, password);
  };

  const getTitle = () => {
    if (isTeamWorkspace) {
      const sectionName = teamSection === 'github' ? 'GitHub Activity' :
                          teamSection === 'announcements' ? 'Announcements & Feedback' :
                          teamSection === 'members' ? 'Team Members' :
                          teamSection ? teamSection.charAt(0).toUpperCase() + teamSection.slice(1) : 'Overview';
      return `Team Workspace — ${sectionName}`;
    }
    if (activeTab === 'courses' || activeTab === 'dashboard') return 'Course Dashboard';
    if (activeTab === 'course-details') return 'Course Information';
    if (activeTab === 'profile') return 'Student Profile';
    return activeTab.replace('-', ' ');
  };

  return (
    <header className="app-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, textTransform: 'capitalize' }}>
            {getTitle()}
          </h2>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Quick Demo Role Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowSwitchMenu(!showSwitchMenu)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', gap: '6px' }}
          >
            <span>Persona:</span>
            <strong style={{ color: '#38bdf8' }}>{user?.role}</strong>
            <ChevronDown size={14} />
          </button>

          {showSwitchMenu && (
            <div style={{
              position: 'absolute',
              top: '110%',
              right: 0,
              width: '260px',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
              padding: '8px',
              zIndex: 100
            }}>
              <div style={{ padding: '8px 10px', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1-Click Switch Persona
              </div>
              <button
                onClick={() => handleQuickSwitch('alka123@iitv.ac.in', 'password123')}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.8rem'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <GraduationCap size={16} color="#34d399" />
                <div>
                  <div style={{ fontWeight: 600 }}>Alka Jha (Student)</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Student Courses Dashboard</div>
                </div>
              </button>

              <button
                onClick={() => handleQuickSwitch('dr.harrison@projectflow.edu', 'password123')}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.8rem'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <School size={16} color="#38bdf8" />
                <div>
                  <div style={{ fontWeight: 600 }}>Dr. Robert Harrison</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Faculty Dashboard Shell</div>
                </div>
              </button>

              <button
                onClick={() => handleQuickSwitch('admin@projectflow.edu', 'admin123')}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.8rem'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Shield size={16} color="#fb7185" />
                <div>
                  <div style={{ fontWeight: 600 }}>Dr. Arthur Vance (Admin)</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Admin Dashboard Shell</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="btn-icon"
          style={{ position: 'relative' }}
          title="Open Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#0284c7',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #090d16'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Badge & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name}</div>
            <div style={{ marginTop: '2px' }}>{getRoleBadge(user?.role)}</div>
          </div>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0284c7, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <button
            onClick={logout}
            className="btn-icon"
            title="Logout"
            style={{ color: '#ef4444' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
