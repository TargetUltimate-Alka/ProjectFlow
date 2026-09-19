import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderGit2,
  Users,
  ListTodo,
  CheckSquare,
  Award,
  Github,
  FileText,
  Bell,
  Settings,
  LogOut,
  GraduationCap,
  School,
  ShieldCheck,
  Sliders,
  UserCheck,
  FileSearch,
  MessageSquare
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, onOpenNotifications }) {
  const { user, logout } = useAuth();
  const role = (user?.role || '').toLowerCase();

  // Distinct nav configurations per role
  const studentNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-project', label: 'My Project', icon: FolderGit2 },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'requirements', label: 'Requirements', icon: ListTodo },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'milestones', label: 'Milestones', icon: Award },
    { id: 'github', label: 'GitHub Activity', icon: Github },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  const facultyNav = [
    { id: 'faculty-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'faculty-projects', label: 'Assigned Projects', icon: FolderGit2 },
    { id: 'faculty-evidence', label: 'GitHub Evidence', icon: Github },
    { id: 'faculty-evaluations', label: 'Project Evaluation', icon: Award },
    { id: 'faculty-feedback', label: 'Feedback & Notes', icon: MessageSquare }
  ];

  const adminNav = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-users', label: 'User Directory', icon: Users },
    { id: 'admin-faculty', label: 'Faculty Roster', icon: School },
    { id: 'admin-projects', label: 'All Projects', icon: FolderGit2 },
    { id: 'admin-assignments', label: 'Faculty Assignments', icon: UserCheck },
    { id: 'admin-criteria', label: 'Milestone Criteria Rules', icon: Sliders }
  ];

  let items = studentNav;
  let roleTitle = 'Student Portal';
  let roleIcon = GraduationCap;
  let roleColor = '#34d399';

  if (role === 'faculty') {
    items = facultyNav;
    roleTitle = 'Faculty Supervision';
    roleIcon = School;
    roleColor = '#38bdf8';
  } else if (role === 'admin') {
    items = adminNav;
    roleTitle = 'Admin Console';
    roleIcon = ShieldCheck;
    roleColor = '#fb7185';
  }

  const RoleIconComponent = roleIcon;

  return (
    <aside className="app-sidebar">
      {/* Brand & Logo */}
      <div style={{
        padding: '24px 24px 20px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
        }}>
          <FolderGit2 size={20} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
            Project<span style={{ color: '#38bdf8' }}>Flow</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <RoleIconComponent size={12} style={{ color: roleColor }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: roleColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {roleTitle}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '8px 12px 12px 12px'
        }}>
          Navigation
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid transparent',
                  background: isActive ? 'linear-gradient(90deg, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0.05) 100%)' : 'transparent',
                  borderColor: isActive ? 'rgba(56, 189, 248, 0.3)' : 'transparent',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                <Icon size={18} style={{ color: isActive ? '#38bdf8' : 'inherit' }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <button
          onClick={onOpenNotifications}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            borderRadius: '8px',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '0.8rem',
            width: '100%',
            textAlign: 'left'
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; }}
        >
          <Bell size={16} />
          <span>Notifications</span>
        </button>

        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            borderRadius: '8px',
            background: 'transparent',
            border: 'none',
            color: '#f87171',
            cursor: 'pointer',
            fontSize: '0.8rem',
            width: '100%',
            textAlign: 'left'
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
