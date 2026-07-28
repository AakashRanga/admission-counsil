import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/ToastContainer';

// Modals
import { RegisterComplaintModal } from './components/forms/RegisterComplaintModal';
import { AssignStaffModal } from './components/forms/AssignStaffModal';
import { ResolutionModal } from './components/forms/ResolutionModal';
import { IssueDetailsModal } from './components/common/IssueDetailsModal';
import { BulkUploadModal } from './components/forms/BulkUploadModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { StudentCouncilDashboard } from './pages/StudentCouncilDashboard';
import { ADAcademicDashboard } from './pages/ADAcademicDashboard';
import { ADMaintenanceDashboard } from './pages/ADMaintenanceDashboard';
import { ADStudentsDashboard } from './pages/ADStudentsDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

// Dedicated Sub-Pages
import { AcademicQueuePage } from './pages/AcademicQueuePage';
import { MaintenanceQueuePage } from './pages/MaintenanceQueuePage';
import { StudentVerificationPage } from './pages/StudentVerificationPage';
import { ClosedHistoryPage } from './pages/ClosedHistoryPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { BulkExportPage } from './pages/BulkExportPage';

import { ReportsPage } from './pages/ReportsPage';
import { UsersManagementPage } from './pages/UsersManagementPage';
import { DepartmentsDirectoryPage } from './pages/DepartmentsDirectoryPage';
import { AuditLogsPage } from './pages/AuditLogsPage';

import type { GrievanceIssue } from './types/grievance';
import { Menu, GraduationCap } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, selectedIssueId, setSelectedIssueId } = useApp();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('ac_logged_in') === 'true';
  });
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [assignTargetIssue, setAssignTargetIssue] = useState<GrievanceIssue | null>(null);
  const [resolutionTargetIssue, setResolutionTargetIssue] = useState<GrievanceIssue | null>(null);

  const handleLoginSuccess = () => {
    localStorage.setItem('ac_logged_in', 'true');
    setActiveTab('dashboard');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('ac_logged_in');
    localStorage.removeItem('ac_role');
    localStorage.removeItem('ac_active_tab');
    setActiveTab('dashboard');
    setIsLoggedIn(false);
  };


  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const renderActiveView = () => {
    // 1. Common Tab Pages
    if (activeTab === 'bulk_export') {
      if (currentRole === 'ad_academic' || currentRole === 'ad_maintenance') {
        return currentRole === 'ad_academic' ? 
          <ADAcademicDashboard onOpenAssignModal={(issue) => setAssignTargetIssue(issue)} /> : 
          <ADMaintenanceDashboard onOpenAssignModal={(issue) => setAssignTargetIssue(issue)} />;
      }
      return <BulkExportPage />;
    }
    if (activeTab === 'notifications') return <NotificationsPage />;
    if (activeTab === 'reports') return <ReportsPage />;
    if (activeTab === 'users') return <UsersManagementPage />;
    if (activeTab === 'departments') return <DepartmentsDirectoryPage />;
    if (activeTab === 'audit_logs') return <AuditLogsPage />;

    // 2. Dedicated Sub-queue Pages
    if (activeTab === 'academic_queue') return <AcademicQueuePage onOpenAssignModal={(issue) => setAssignTargetIssue(issue)} />;
    if (activeTab === 'maintenance_queue') return <MaintenanceQueuePage onOpenAssignModal={(issue) => setAssignTargetIssue(issue)} />;
    if (activeTab === 'verification') return <StudentVerificationPage onOpenResolutionModal={(issue) => setResolutionTargetIssue(issue)} />;
    if (activeTab === 'closed') return <ClosedHistoryPage />;

    // 3. Main Role Overview Dashboards (activeTab === 'dashboard')
    switch (currentRole) {
      case 'student_council':
        return <StudentCouncilDashboard onOpenRegisterModal={() => setIsRegisterOpen(true)} />;
      case 'ad_academic':
        return <ADAcademicDashboard onOpenAssignModal={(issue) => setAssignTargetIssue(issue)} />;
      case 'ad_maintenance':
        return <ADMaintenanceDashboard onOpenAssignModal={(issue) => setAssignTargetIssue(issue)} />;
      case 'ad_students':
        return <ADStudentsDashboard onOpenResolutionModal={(issue) => setResolutionTargetIssue(issue)} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <StudentCouncilDashboard onOpenRegisterModal={() => setIsRegisterOpen(true)} />;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row font-sans transition-colors duration-200">
      
      {/* Main Workspace Layout with Sidebar on Left */}
      <div className="flex flex-1 w-full max-w-[1600px] mx-auto h-screen overflow-hidden">
        <Sidebar 
          onOpenRegisterModal={() => setIsRegisterOpen(true)} 
          onLogout={handleLogout}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenBulkUpload={() => setIsBulkUploadOpen(true)}
        />

        <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
          <Header 
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
            onOpenBulkUpload={() => setIsBulkUploadOpen(true)}
          />
          <div className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Toast Container */}
      <ToastContainer />

      {/* Register Complaint Form Modal */}
      <RegisterComplaintModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      {/* Bulk Upload CSV Modal */}
      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
      />

      {/* Assign Staff / Trade Team Modal */}
      <AssignStaffModal
        issue={assignTargetIssue}
        onClose={() => setAssignTargetIssue(null)}
      />

      {/* AD Students Verification & Resolution Modal */}
      <ResolutionModal
        issue={resolutionTargetIssue}
        onClose={() => setResolutionTargetIssue(null)}
      />

      {/* Full Issue Detail Slide-Over / Modal */}
      <IssueDetailsModal
        issueId={selectedIssueId}
        onClose={() => setSelectedIssueId(null)}
        onOpenAssignModal={(issue) => setAssignTargetIssue(issue)}
        onOpenResolutionModal={(issue) => setResolutionTargetIssue(issue)}
      />

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
