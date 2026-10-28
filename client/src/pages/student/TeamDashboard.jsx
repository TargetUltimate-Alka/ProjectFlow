import React, { useState, useEffect } from 'react';
import { api, getUser } from '../../api';
import {
  ChevronRight,
  ArrowLeft,
  Users,
  Award,
  GitCommit,
  FileText,
  CheckSquare,
  Clock,
  Calendar,
  User,
  Plus,
  Paperclip,
  Download,
  MoreVertical,
  ExternalLink,
  ShieldAlert,
  AlertCircle,
  RefreshCw,
  Crown,
  Edit3,
  CheckCircle2,
  Send,
  X,
  Mail,
  Hash,
  Sparkles
} from 'lucide-react';

// Connect existing student page components for tabs
import { TasksPage } from './TasksPage';
import { DocumentsPage } from './DocumentsPage';
import { GitHubPage } from './GitHubPage';

export function TeamDashboard({
  courseId,
  teamId,
  activeTab: controlledTab,
  onTabChange,
  onBack,
  onNavigateToCourse
}) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internalTab, setInternalTab] = useState('overview');

  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;
  const handleTabChange = (newTab) => {
    if (onTabChange) {
      onTabChange(newTab);
    } else {
      setInternalTab(newTab);
    }
  };

  // Announcement modal state
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annAttachment, setAnnAttachment] = useState('');
  const [postingAnn, setPostingAnn] = useState(false);
  const [annError, setAnnError] = useState(null);

  // Edit Project Info modal state
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [savingProject, setSavingProject] = useState(false);
  const [projectError, setProjectError] = useState(null);

  const currentUser = getUser() || {};
  const userRole = (currentUser.role || 'Student').toLowerCase();
  const userEmail = (currentUser.email || '').toLowerCase();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTeamDashboard(courseId, teamId);
      setDashboardData(data);
      if (data?.project) {
        setEditTitle(data.project.title || '');
        setEditDescription(data.project.description || '');
        setEditStartDate(data.project.startDate || '');
        setEditEndDate(data.project.endDate || '');
      }
    } catch (err) {
      console.error('Failed to load team dashboard:', err);
      setError({
        status: err.status || 500,
        message: err.message || 'Failed to load team dashboard.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId && teamId) {
      fetchDashboard();
    }
  }, [courseId, teamId]);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle.trim()) {
      setAnnError('Announcement title is required.');
      return;
    }

    try {
      setPostingAnn(true);
      setAnnError(null);
      const attachments = annAttachment.trim()
        ? [{ id: `att_${Date.now()}`, name: annAttachment.trim(), size: '1.2 MB', type: 'pdf' }]
        : [];

      await api.createTeamAnnouncement(courseId, teamId, {
        title: annTitle.trim(),
        content: annContent.trim(),
        attachments
      });

      setShowAnnounceModal(false);
      setAnnTitle('');
      setAnnContent('');
      setAnnAttachment('');
      await fetchDashboard();
    } catch (err) {
      setAnnError(err.message || 'Failed to post announcement.');
    } finally {
      setPostingAnn(false);
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      setProjectError('Project title is required.');
      return;
    }

    try {
      setSavingProject(true);
      setProjectError(null);
      await api.updateTeamProject(courseId, teamId, {
        projectTitle: editTitle.trim(),
        projectDescription: editDescription.trim(),
        startDate: editStartDate,
        endDate: editEndDate
      });

      setShowEditProjectModal(false);
      await fetchDashboard();
    } catch (err) {
      setProjectError(err.message || 'Failed to update project details.');
    } finally {
      setSavingProject(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '24px 20px', minHeight: '80vh' }}>
        {/* Breadcrumb Skeleton */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <div style={{ width: '80px', height: '16px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }} />
          <ChevronRight size={14} color="#64748b" />
          <div style={{ width: '160px', height: '16px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }} />
          <ChevronRight size={14} color="#64748b" />
          <div style={{ width: '100px', height: '16px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Header Skeleton */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '24px',
          borderRadius: '16px',
          background: 'rgba(18, 24, 38, 0.6)',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '28px'
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(56, 189, 248, 0.15)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ width: '220px', height: '24px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', marginBottom: '8px' }} />
            <div style={{ width: '320px', height: '16px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }} />
          </div>
        </div>

        {/* Cards Skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ height: '220px', borderRadius: '16px', background: 'rgba(18, 24, 38, 0.6)' }} />
          <div style={{ height: '220px', borderRadius: '16px', background: 'rgba(18, 24, 38, 0.6)' }} />
        </div>
      </div>
    );
  }

  // 403 Forbidden / Error State (Requirement 5)
  if (error) {
    const isForbidden = error.status === 403;
    return (
      <div style={{ maxWidth: '720px', margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{
          padding: '40px 32px',
          borderRadius: '20px',
          background: 'rgba(18, 24, 38, 0.95)',
          border: isForbidden ? '1.5px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: isForbidden ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            color: isForbidden ? '#ef4444' : '#f59e0b'
          }}>
            {isForbidden ? <ShieldAlert size={32} /> : <AlertCircle size={32} />}
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '10px' }}>
            {isForbidden ? 'Private Team Workspace' : 'Unable to Open Dashboard'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '24px' }}>
            {error.message}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
            <button
              onClick={onBack}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '10px',
                backgroundColor: '#0284c7',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Course</span>
            </button>
            <button
              onClick={fetchDashboard}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={15} />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { team, course, project, progress, announcements } = dashboardData || {};

  const isTeamLead = ((team?.teamLeadEmail || '').toLowerCase() === userEmail) ||
    ((team?.members || []).some(m => (m.email || '').toLowerCase() === userEmail && m.isLeader));
  const isFacultySupervisor = userRole === 'faculty';
  const canEditProject = isTeamLead || isFacultySupervisor || userRole === 'admin';

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '16px 20px 48px 20px' }}>
      {/* 1. Header & Navigation (Breadcrumb + Back) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Breadcrumb Path matching panel 7: Courses > CSS43 - Web Services > Team Alpha (> Section) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#94a3b8' }}>
          <button
            onClick={onNavigateToCourse || onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: 0,
              fontSize: 'inherit',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            Courses
          </button>
          <ChevronRight size={14} color="#64748b" />
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: 0,
              fontSize: 'inherit',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            {course?.code || 'CS543'} - {course?.name || 'Web Services'}
          </button>
          <ChevronRight size={14} color="#64748b" />
          <button
            onClick={() => handleTabChange('overview')}
            style={{
              background: 'none',
              border: 'none',
              color: (activeTab === 'overview' || activeTab === 'team') ? '#f8fafc' : '#94a3b8',
              cursor: 'pointer',
              padding: 0,
              fontSize: 'inherit',
              fontWeight: (activeTab === 'overview' || activeTab === 'team') ? 600 : 500,
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'}
            onMouseLeave={(e) => e.currentTarget.style.color = (activeTab === 'overview' || activeTab === 'team') ? '#f8fafc' : '#94a3b8'}
          >
            {team?.name || 'Team'}
          </button>
          {activeTab !== 'overview' && activeTab !== 'team' && (
            <>
              <ChevronRight size={14} color="#64748b" />
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                {activeTab === 'github' ? 'GitHub Activity' :
                 activeTab === 'announcements' ? 'Announcements & Feedback' :
                 activeTab === 'members' ? 'Team Members' :
                 activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </span>
            </>
          )}
        </div>

        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#cbd5e1',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
            e.currentTarget.style.color = '#38bdf8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = '#cbd5e1';
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to Course</span>
        </button>
      </div>

      {/* 2. Team Header Banner matching Panel 7 */}
      <div style={{
        borderRadius: '16px',
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {/* Team Icon with Gradient matching Panel 7 */}
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
              flexShrink: 0
            }}>
              <Users size={30} strokeWidth={2.2} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                  {team?.name}
                </h1>
                {/* Active Status Badge matching Panel 7 */}
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(16, 185, 129, 0.18)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.35)'
                }}>
                  {team?.status || 'Active'}
                </span>
                {team?.id && (
                  <span style={{
                    fontSize: '0.72rem',
                    color: '#64748b',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    fontFamily: 'monospace'
                  }}>
                    ID: {team.id}
                  </span>
                )}
              </div>

              {/* Team Lead & Members Metadata matching Panel 7 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.88rem', color: '#94a3b8', marginTop: '6px' }}>
                <span>Team Lead: <strong style={{ color: '#e2e8f0' }}>{team?.teamLead}</strong></span>
                <span style={{ color: '#475569' }}>|</span>
                <span>Members: <strong style={{ color: '#38bdf8' }}>{team?.memberCount}</strong></span>
                <span style={{ color: '#475569' }}>|</span>
                <span>Course: <strong style={{ color: '#e2e8f0' }}>{course?.code}</strong></span>
                <span style={{ color: '#475569' }}>|</span>
                <span>Supervisor: <strong style={{ color: '#e2e8f0' }}>{project?.facultySupervisor}</strong></span>
              </div>
            </div>
          </div>

          {canEditProject && (
            <button
              onClick={() => setShowEditProjectModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.12)'}
            >
              <Edit3 size={14} />
              <span>Edit Project Info</span>
            </button>
          )}
        </div>

        {/* 3. Navigation Tabs matching Panel 7 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'tasks', label: 'Tasks' },
            { id: 'documents', label: 'Documents' },
            { id: 'github', label: 'GitHub Activity' },
            { id: 'announcements', label: 'Announcements & Feedback' },
            { id: 'members', label: 'Team Members' }
          ].map((tab) => {
            const isActive = (tab.id === 'overview' && (activeTab === 'overview' || activeTab === 'team')) ||
                             (activeTab === tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #0284c7' : '3px solid transparent',
                  padding: '8px 4px 10px 4px',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#e2e8f0';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#94a3b8';
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Tab Content: Overview Section (Matching Panel 7 Layout) */}
      {activeTab === 'overview' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.7fr) minmax(360px, 1fr)',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* LEFT COLUMN: Project Information + Team Members + Progress Overview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Project Information Card */}
            <div style={{
              borderRadius: '16px',
              padding: '24px',
              background: 'rgba(18, 24, 38, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
            }}>
              {/* Top metadata 3-box row matching panel 7 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                marginBottom: '18px'
              }}>
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Project Title
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>
                    {project?.title || 'Untitled Project'}
                  </div>
                </div>

                <div style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Course
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>
                    {project?.associatedCourse || `${course?.code} - ${course?.name}`}
                  </div>
                </div>

                <div style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Faculty
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>
                    {project?.facultySupervisor || 'Dr. R. Sharma'}
                  </div>
                </div>
              </div>

              {/* Project Description & Important Dates matching Panel 7 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr',
                gap: '18px',
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', margin: '0 0 6px 0' }}>
                    Project Description
                  </h4>
                  <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                    {project?.description || 'No description provided for this academic project.'}
                  </p>
                </div>

                <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', paddingLeft: '18px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', margin: '0 0 8px 0' }}>
                    Important Dates
                  </h4>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>Start Date : <strong style={{ color: '#f1f5f9' }}>{project?.startDate || 'Not configured'}</strong></div>
                    <div>End Date : <strong style={{ color: '#f1f5f9' }}>{project?.endDate || 'Not configured'}</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members Card */}
            <div style={{
              borderRadius: '16px',
              padding: '20px 24px',
              background: 'rgba(18, 24, 38, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="#38bdf8" />
                  <span>Team Members ({team?.members?.length || 0})</span>
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Capacity: {team?.memberCount || 4} / {team?.maxMembers || 5}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '12px'
              }}>
                {(team?.members || []).map((member, mIdx) => {
                  const isLead = member.isLeader || (team.teamLeadEmail && member.email && team.teamLeadEmail.toLowerCase() === member.email.toLowerCase());
                  return (
                    <div
                      key={mIdx}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        background: isLead ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                        border: isLead ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: isLead ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'linear-gradient(135deg, #1e293b, #334155)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        flexShrink: 0
                      }}>
                        {member.name ? member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'M'}
                      </div>

                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {member.name}
                          </span>
                          {isLead && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              background: 'rgba(245, 158, 11, 0.2)',
                              color: '#f59e0b',
                              border: '1px solid rgba(245, 158, 11, 0.35)'
                            }}>
                              <Crown size={10} /> Lead
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                          {member.role || (isLead ? 'Team Lead' : 'Student Contributor')} • {member.rollNumber || member.email}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress Overview Card matching Panel 7 */}
            <div style={{
              borderRadius: '16px',
              padding: '24px',
              background: 'rgba(18, 24, 38, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                  Progress Overview
                </h3>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                  {progress?.overallPercentage ?? 60}%
                </span>
              </div>

              {/* Progress Bar matching Panel 7 */}
              <div style={{
                width: '100%',
                height: '10px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
                marginBottom: '24px'
              }}>
                <div style={{
                  width: `${progress?.overallPercentage ?? 60}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)',
                  borderRadius: '999px',
                  transition: 'width 0.4s ease'
                }} />
              </div>

              {/* 4 Summary Cards matching Panel 7 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '14px'
              }}>
                {/* 1. Tasks Card */}
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10b981',
                    flexShrink: 0
                  }}>
                    <CheckSquare size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>Tasks</div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                      {progress?.tasks?.isConfigured ? (
                        <>
                          {progress.tasks.total} <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>({progress.tasks.completed} completed)</span>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Unavailable</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Documents Card */}
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(2, 132, 199, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                    flexShrink: 0
                  }}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>Documents</div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                      {progress?.documents?.isConfigured ? (
                        progress.documents.count ?? 6
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Unavailable</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. GitHub Commits Card */}
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(168, 85, 247, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c084fc',
                    flexShrink: 0
                  }}>
                    <GitCommit size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>GitHub Commits</div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                      {progress?.github?.isConfigured ? (
                        progress.github.commits ?? 48
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Not Connected</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Evaluation Card */}
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f59e0b',
                    flexShrink: 0
                  }}>
                    <Award size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>Evaluation</div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                      {progress?.evaluation?.isConfigured ? (
                        progress.evaluation.status || 'Pending'
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Pending</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Announcements (For This Team) matching Panel 7 */}
          <div style={{
            borderRadius: '16px',
            padding: '24px',
            background: 'rgba(18, 24, 38, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Header: Title + "+ New" Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Announcements (For This Team)
              </h3>
              <button
                onClick={() => setShowAnnounceModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#0284c7',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(2, 132, 199, 0.35)',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0ea5e9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>+ New</span>
              </button>
            </div>

            {/* Announcements List */}
            {announcements && announcements.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {announcements.map((ann, idx) => (
                  <div
                    key={ann.id || idx}
                    style={{
                      borderRadius: '12px',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.025)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      transition: 'border-color 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          background: idx % 2 === 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: idx % 2 === 0 ? '#10b981' : '#f59e0b',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}>
                          <FileText size={17} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                            {ann.title}
                          </h4>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                            {ann.author} • {ann.date}
                          </div>
                        </div>
                      </div>

                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        title="Options"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    {ann.content && (
                      <p style={{
                        fontSize: '0.84rem',
                        color: '#cbd5e1',
                        lineHeight: 1.5,
                        margin: '12px 0 0 0'
                      }}>
                        {ann.content}
                      </p>
                    )}

                    {/* Attached files chip matching Panel 7: API_Endpoints_v2.pdf */}
                    {ann.attachments && ann.attachments.length > 0 && (
                      <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {ann.attachments.map((att, aIdx) => (
                          <div
                            key={aIdx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '12px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: 'rgba(2, 132, 199, 0.1)',
                              border: '1px solid rgba(2, 132, 199, 0.25)',
                              color: '#38bdf8',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                            onClick={() => alert(`Downloading ${att.name}...`)}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <FileText size={14} />
                              <span>{att.name}</span>
                            </div>
                            <Download size={14} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '36px 16px', textAlign: 'center', color: '#94a3b8' }}>
                <p style={{ margin: 0, fontSize: '0.88rem' }}>No announcements posted for this team yet.</p>
                <button
                  onClick={() => setShowAnnounceModal(true)}
                  style={{
                    marginTop: '12px',
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  + Post First Announcement
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Tab Content: Tasks Tab */}
      {activeTab === 'tasks' && (
        <div style={{
          borderRadius: '16px',
          padding: '24px',
          background: 'rgba(18, 24, 38, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <TasksPage
            projectId={project?.id}
            team={team}
            course={course}
            isTeamLead={isTeamLead}
            onBackToOverview={() => handleTabChange('overview')}
            onBackToCourse={onBack}
            hideBreadcrumb={true}
          />
        </div>
      )}

      {/* 6. Tab Content: Documents Tab */}
      {activeTab === 'documents' && (
        <div style={{
          borderRadius: '16px',
          padding: '24px',
          background: 'rgba(18, 24, 38, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <DocumentsPage
            projectId={project?.id}
            team={team}
          />
        </div>
      )}

      {/* 7. Tab Content: GitHub Activity Tab */}
      {activeTab === 'github' && (
        <div style={{
          borderRadius: '16px',
          padding: '24px',
          background: 'rgba(18, 24, 38, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <GitHubPage
            projectId={project?.id}
            team={team}
          />
        </div>
      )}

      {/* 8. Tab Content: Announcements & Feedback Tab */}
      {activeTab === 'announcements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Milestone Evaluation Feedback from Supervisor */}
          <div style={{
            borderRadius: '16px',
            padding: '24px',
            background: 'rgba(18, 24, 38, 0.85)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={22} color="#f59e0b" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                  Faculty Supervision & Milestone Feedback
                </h3>
              </div>
              <span style={{
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                Evaluation: {progress?.evaluation?.status || 'Pending'}
              </span>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 16px 0' }}>
              {progress?.evaluation?.feedback || 'Milestone 1 evaluation is currently queued for supervisor review.'}
            </p>

            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Assigned Supervisor: <strong style={{ color: '#f1f5f9' }}>{project?.facultySupervisor}</strong> ({project?.facultyEmail})
            </div>
          </div>

          {/* Full announcements stream */}
          <div style={{
            borderRadius: '16px',
            padding: '24px',
            background: 'rgba(18, 24, 38, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                All Team Announcements & Communication
              </h3>
              <button
                onClick={() => setShowAnnounceModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#0284c7',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} />
                <span>+ Post Announcement</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(announcements || []).map((ann, idx) => (
                <div
                  key={ann.id || idx}
                  style={{
                    borderRadius: '12px',
                    padding: '18px',
                    background: 'rgba(255, 255, 255, 0.025)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                      {ann.title}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{ann.date}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '3px' }}>
                    By {ann.author} ({ann.authorEmail || 'Faculty'})
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6, margin: '12px 0 0 0' }}>
                    {ann.content}
                  </p>
                  {ann.attachments && ann.attachments.length > 0 && (
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {ann.attachments.map((att, aIdx) => (
                        <div
                          key={aIdx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: 'rgba(2, 132, 199, 0.1)',
                            border: '1px solid rgba(2, 132, 199, 0.3)',
                            color: '#38bdf8',
                            fontSize: '0.82rem',
                            cursor: 'pointer'
                          }}
                          onClick={() => alert(`Downloading ${att.name}...`)}
                        >
                          <Paperclip size={13} />
                          <span>{att.name}</span>
                          <Download size={13} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. Tab Content: Team Members Tab */}
      {activeTab === 'members' && (
        <div style={{
          borderRadius: '16px',
          padding: '24px',
          background: 'rgba(18, 24, 38, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 16px 0' }}>
            Team Roster & Member Roles
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            {(team?.members || []).map((m, idx) => {
              const isLead = m.isLeader || (team.teamLeadEmail && m.email && team.teamLeadEmail.toLowerCase() === m.email.toLowerCase());
              return (
                <div
                  key={idx}
                  style={{
                    padding: '20px',
                    borderRadius: '14px',
                    background: isLead ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.025)',
                    border: isLead ? '1.5px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.07)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: isLead ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'linear-gradient(135deg, #1e293b, #334155)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '1rem'
                    }}>
                      {m.name ? m.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'M'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                          {m.name}
                        </h4>
                        {isLead && (
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '999px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            background: 'rgba(245, 158, 11, 0.2)',
                            color: '#f59e0b',
                            border: '1px solid rgba(245, 158, 11, 0.35)'
                          }}>
                            Team Lead
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                        {m.role || (isLead ? 'Lead Architect & Coordinator' : 'Member Contributor')}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={13} color="#38bdf8" />
                      <span>{m.email}</span>
                    </div>
                    {m.rollNumber && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Hash size={13} color="#38bdf8" />
                        <span>Roll: {m.rollNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: Post Team Announcement */}
      {showAnnounceModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '560px',
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Post Team Announcement
              </h3>
              <button
                onClick={() => setShowAnnounceModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {annError && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.85rem',
                marginBottom: '16px'
              }}>
                {annError}
              </div>
            )}

            <form onSubmit={handlePostAnnouncement}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Updated API Documentation"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Message
                </label>
                <textarea
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Provide instructions or updates for this team workspace..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Attachment Filename (optional)
                </label>
                <input
                  type="text"
                  value={annAttachment}
                  onChange={(e) => setAnnAttachment(e.target.value)}
                  placeholder="e.g. API_Endpoints_v2.pdf"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAnnounceModal(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#cbd5e1',
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={postingAnn}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#0284c7',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {postingAnn ? <RefreshCw size={15} className="spinning" /> : <Send size={15} />}
                  <span>{postingAnn ? 'Posting...' : 'Post Announcement'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Project Information */}
      {showEditProjectModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '560px',
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Edit Project Information
              </h3>
              <button
                onClick={() => setShowEditProjectModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {projectError && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.85rem',
                marginBottom: '16px'
              }}>
                {projectError}
              </div>
            )}

            <form onSubmit={handleSaveProject}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Project Title *
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Project Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditProjectModal(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#cbd5e1',
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProject}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#0284c7',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {savingProject ? <RefreshCw size={15} className="spinning" /> : <CheckCircle2 size={15} />}
                  <span>{savingProject ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
