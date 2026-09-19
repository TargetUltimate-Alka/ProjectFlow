import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { NotificationDrawer } from './components/NotificationDrawer';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MyProject } from './pages/student/MyProject';
import { TeamPage } from './pages/student/TeamPage';
import { RequirementsPage } from './pages/student/RequirementsPage';
import { TasksPage } from './pages/student/TasksPage';
import { GitHubPage } from './pages/student/GitHubPage';
import { MilestonesPage } from './pages/student/MilestonesPage';
import { DocumentsPage } from './pages/student/DocumentsPage';

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
  const [activeTab, setActiveTab] = useState('dashboard');
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
    if (role === 'faculty' && activeTab === 'dashboard') return 'faculty-dashboard';
    if (role === 'admin' && activeTab === 'dashboard') return 'admin-dashboard';
    if (role === 'student' && (activeTab.startsWith('faculty-') || activeTab.startsWith('admin-'))) return 'dashboard';
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
          {/* STUDENT SHELL VIEWS */}
          {role === 'student' && (
            <>
              {currentTab === 'dashboard' && <StudentDashboard onNavigate={setActiveTab} />}
              {currentTab === 'my-project' && <MyProject />}
              {currentTab === 'team' && <TeamPage />}
              {currentTab === 'requirements' && <RequirementsPage />}
              {currentTab === 'tasks' && <TasksPage />}
              {currentTab === 'milestones' && <MilestonesPage />}
              {currentTab === 'github' && <GitHubPage />}
              {currentTab === 'documents' && <DocumentsPage />}
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
              {currentTab === 'faculty-evidence' && (
                <GitHubEvidencePage selectedProjectId={selectedProjectId} />
              )}
              {currentTab === 'faculty-evaluations' && (
                <EvaluationPage selectedProjectId={selectedProjectId} />
              )}
              {currentTab === 'faculty-feedback' && (
                <EvaluationPage selectedProjectId={selectedProjectId} />
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
              {currentTab === 'admin-criteria' && <CriteriaPage />}
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
