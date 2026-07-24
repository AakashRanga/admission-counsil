import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';

// Modals
import { RegisterComplaintModal } from './components/forms/RegisterComplaintModal';
import { AssignStaffModal } from './components/forms/AssignStaffModal';
import { ResolutionModal } from './components/forms/ResolutionModal';
import { IssueDetailsModal } from './components/common/IssueDetailsModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { StudentCouncilDashboard } from './pages/StudentCouncilDashboard';
import { ADAcademicDashboard } from './pages/ADAcademicDashboard';
import { ADMaintenanceDashboard } from './pages/ADMaintenanceDashboard';
import { ADStudentsDashboard } from './pages/ADStudentsDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

// Dedicated Sub-Pages
import { ComplaintsQueuePage } from './pages/ComplaintsQueuePage';
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
  const { currentRole, activeTab, selectedIssueId, setSelectedIssueId } = useApp();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [assignTargetIssue, setAssignTargetIssue] = useState<GrievanceIssue | null>(null);
  const [resolutionTargetIssue, setResolutionTargetIssue] = useState<GrievanceIssue | null>(null);

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const renderActiveView = () => {
    // 1. Common Tab Pages
    if (activeTab === 'bulk_export') return <BulkExportPage />;
    if (activeTab === 'notifications') return <NotificationsPage />;
    if (activeTab === 'reports') return <ReportsPage />;
    if (activeTab === 'users') return <UsersManagementPage />;
    if (activeTab === 'departments') return <DepartmentsDirectoryPage />;
    if (activeTab === 'audit_logs') return <AuditLogsPage />;

    // 2. Dedicated Sub-queue Pages
    if (activeTab === 'queue') return <ComplaintsQueuePage />;
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row font-sans transition-colors duration-200">
      
      {/* Mobile Top Bar with Menu Toggle */}
      <div className="md:hidden flex items-center justify-between p-3.5 glass-panel border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100">SIMATS Academic Council</span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Main Workspace Layout with Sidebar on Left */}
      <div className="flex flex-1 w-full max-w-[1600px] mx-auto min-h-screen">
        <Sidebar 
          onOpenRegisterModal={() => setIsRegisterOpen(true)} 
          onLogout={() => setIsLoggedIn(false)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto min-w-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Toast Container */}
      <ToastContainer />

      {/* Register Complaint Form Modal */}
      <RegisterComplaintModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
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
