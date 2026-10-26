import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { NotificationDrawer } from './components/NotificationDrawer';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { CoursePage } from './pages/student/CoursePage';
import { MyProject } from './pages/student/MyProject';
import { TeamPage } from './pages/student/TeamPage';
import { RequirementsPage } from './pages/student/RequirementsPage';
import { TasksPage } from './pages/student/TasksPage';
import { GitHubPage } from './pages/student/GitHubPage';
import { MilestonesPage } from './pages/student/MilestonesPage';
import { DocumentsPage } from './pages/student/DocumentsPage';
import { User, ArrowLeft, Mail, Hash, Calendar, GraduationCap, School } from 'lucide-react';

// Faculty Pages
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { ProjectDetails } from './pages/faculty/ProjectDetails';
import { GitHubEvidencePage } from './pages/faculty/GitHubEvidencePage';
import { EvaluationPage } from './pages/faculty/EvaluationPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UsersManagement } from './pages/admin/UsersManagement';
import { AssignmentsPage } from './pages/admin/AssignmentsPage';
import { CriteriaPage } from './pages/admin/CriteriaPage';

export function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#090d16',
        color: '#38bdf8',
        fontWeight: 600
      }}>
        Initializing ProjectFlow Environment...
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const role = (user.role || '').toLowerCase();

  // Reset tab default if role changes
  const effectiveTab = () => {
    if (role === 'faculty' && (activeTab === 'dashboard' || activeTab === 'courses')) return 'faculty-dashboard';
    if (role === 'admin' && (activeTab === 'dashboard' || activeTab === 'courses')) return 'admin-dashboard';
    if (role === 'student' && (activeTab.startsWith('faculty-') || activeTab.startsWith('admin-'))) return 'courses';
    if (role === 'student' && activeTab === 'dashboard') return 'courses';
    return activeTab;
  };

  const currentTab = effectiveTab();

  const handleFacultySelectProject = (projId, viewType) => {
    setSelectedProjectId(projId);
    if (viewType === 'details') setActiveTab('faculty-projects');
    if (viewType === 'evaluation') setActiveTab('faculty-evaluations');
  };

  return (
    <div className="app-layout">
      {/* Role-Specific Sidebar Shell */}
      <Sidebar
        activeTab={currentTab}
        setActiveTab={setActiveTab}
        onOpenNotifications={() => setIsNotifOpen(true)}
      />

      {/* Main Content Area */}
      <div className="app-main">
        <TopNavbar
          activeTab={currentTab}
          onOpenNotifications={() => setIsNotifOpen(true)}
        />

        <main className="app-content">
          {/* STUDENT SHELL VIEWS - Course Based Architecture (Google Classroom Model) */}
          {role === 'student' && (
            <>
              {(currentTab === 'courses' || currentTab === 'dashboard') && (
                <StudentDashboard
                  onSelectCourse={(course) => {
                    const identifier = course.code || course.id;
                    setSelectedCourseId(identifier);
                    setActiveTab('course-details');
                  }}
                />
              )}

              {currentTab === 'course-details' && (
                <CoursePage
                  courseId={selectedCourseId}
                  onBack={() => {
                    setSelectedCourseId(null);
                    setActiveTab('courses');
                  }}
                />
              )}

              {currentTab === 'profile' && (
                <div style={{ maxWidth: '640px', margin: '20px auto' }} className="glass-panel">
                  <div style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '1.4rem'
                      }}>
                        {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST'}
                      </div>
                      <div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>{user?.name || 'Student Account'}</h2>
                        <span className="badge badge-emerald" style={{ marginTop: '4px' }}>
                          <GraduationCap size={12} /> Enrolled Student
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                        <Mail size={16} style={{ color: '#38bdf8' }} />
                        <span>Email: <strong style={{ color: '#fff' }}>{user?.email}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                        <Hash size={16} style={{ color: '#38bdf8' }} />
                        <span>Roll Number: <strong style={{ color: '#fff' }}>{user?.rollNumber || '20251651013'}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                        <Calendar size={16} style={{ color: '#38bdf8' }} />
                        <span>Batch: <strong style={{ color: '#fff' }}>{user?.batch || '2026-2028'}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                        <School size={16} style={{ color: '#38bdf8' }} />
                        <span>Department: <strong style={{ color: '#fff' }}>{user?.department || 'Computer Science & Engineering'}</strong></span>
                      </div>
                    </div>

                    <div style={{ marginTop: '28px' }}>
                      <button onClick={() => setActiveTab('courses')} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <ArrowLeft size={16} />
                        <span>Back to My Courses</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* FACULTY SHELL VIEWS */}
          {role === 'faculty' && (
            <>
              {currentTab === 'faculty-dashboard' && (
                <FacultyDashboard onSelectProject={handleFacultySelectProject} />
              )}
              {currentTab === 'faculty-projects' && (
                <ProjectDetails
                  projectId={selectedProjectId}
                  onBack={() => setActiveTab('faculty-dashboard')}
                  onNavigateToEvaluation={() => setActiveTab('faculty-evaluations')}
                />
              )}
              {currentTab === 'faculty-criteria' && (
                <CriteriaPage onNavigateToEvaluation={() => setActiveTab('faculty-evaluations')} />
              )}
              {currentTab === 'faculty-evidence' && (
                <GitHubEvidencePage selectedProjectId={selectedProjectId} />
              )}
              {currentTab === 'faculty-evaluations' && (
                <EvaluationPage selectedProjectId={selectedProjectId} onNavigateToCriteria={() => setActiveTab('faculty-criteria')} />
              )}
              {currentTab === 'faculty-feedback' && (
                <EvaluationPage selectedProjectId={selectedProjectId} onNavigateToCriteria={() => setActiveTab('faculty-criteria')} />
              )}
            </>
          )}

          {/* ADMIN SHELL VIEWS */}
          {role === 'admin' && (
            <>
              {currentTab === 'admin-dashboard' && <AdminDashboard onNavigate={setActiveTab} />}
              {currentTab === 'admin-users' && <UsersManagement />}
              {currentTab === 'admin-faculty' && <UsersManagement />}
              {currentTab === 'admin-projects' && <AssignmentsPage />}
              {currentTab === 'admin-assignments' && <AssignmentsPage />}
            </>
          )}
        </main>
      </div>

      {/* Global Event Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />
    </div>
  );
}
export default App;
