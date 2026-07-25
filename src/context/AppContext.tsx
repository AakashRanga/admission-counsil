import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { 
  UserRole, 
  GrievanceIssue, 
  DepartmentInfo, 
  SystemUser, 
  AuditLogEntry, 
  NotificationItem,
  IssueStatus,
  AssignedStaff,
  StudentFeedback
} from '../types/grievance';
import { 
  MOCK_ISSUES, 
  INITIAL_DEPARTMENTS, 
  INITIAL_USERS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS 
} from '../mock/mockData';

import { apiService } from '../services/api';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  issues: GrievanceIssue[];
  departments: DepartmentInfo[];
  users: SystemUser[];
  auditLogs: AuditLogEntry[];
  notifications: NotificationItem[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedIssueId: string | null;
  setSelectedIssueId: (id: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Actions
  refreshIssuesFromDB: () => Promise<void>;
  addIssue: (issueData: Partial<GrievanceIssue>) => GrievanceIssue;
  updateIssueStatus: (issueId: string, status: IssueStatus, comment?: string) => void;
  assignStaffToIssue: (issueId: string, staff: AssignedStaff) => void;
  addStudentFeedback: (issueId: string, feedback: StudentFeedback, closeOrReopen: 'close' | 'reopen', finalRemarks?: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  toasts: Toast[];
  addToast: (type: Toast['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('ac_role');
    return (saved as UserRole) || 'student_council';
  });

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    localStorage.setItem('ac_role', role);
  };

  const [activeTab, setActiveTabState] = useState<string>(() => {
    return localStorage.getItem('ac_active_tab') || 'dashboard';
  });

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    localStorage.setItem('ac_active_tab', tab);
  };

  const [issues, setIssues] = useState<GrievanceIssue[]>(() => {
    const saved = localStorage.getItem('ac_issues');
    return saved ? JSON.parse(saved) : MOCK_ISSUES;
  });
  const [departments] = useState<DepartmentInfo[]>(INITIAL_DEPARTMENTS);
  const [users] = useState<SystemUser[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('ac_theme') === 'dark';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Function to fetch database records from MySQL via FastAPI REST API
  const refreshIssuesFromDB = async () => {
    const dbData = await apiService.getIssues();
    if (dbData && Array.isArray(dbData) && dbData.length > 0) {
      const mappedDBIssues: GrievanceIssue[] = dbData.map((dbItem: any) => ({
        id: dbItem.id,
        type: dbItem.type || 'academic',
        title: dbItem.title,
        student: {
          id: dbItem.student_id || '2024STU101',
          name: dbItem.student_name || 'Student',
          department: dbItem.department || 'Computer Science & Engineering',
          mobile: dbItem.mobile || '+91 98000 00000'
        },
        status: dbItem.status || 'pending',
        description: dbItem.description || '',
        remarks: dbItem.remarks || '',
        submittedAt: dbItem.created_at ? new Date(dbItem.created_at).toLocaleDateString() : 'Today',
        academicCategory: dbItem.category,
        maintenanceCategory: dbItem.category,
        building: dbItem.building,
        floor: dbItem.floor,
        roomNumber: dbItem.room_number,
        location: dbItem.location,
        subject: dbItem.subject,
        facultyName: dbItem.faculty_name,
        course: dbItem.course,
        timeline: [
          {
            id: 'tl-1',
            title: 'Issue Record Fetched',
            description: 'Loaded from MySQL database academic_council',
            timestamp: 'Database Record',
            performedBy: 'FastAPI Backend',
            role: 'admin',
            status: dbItem.status || 'pending'
          }
        ]
      }));

      // Replace issues state with live database records from MySQL academic_council
      setIssues(mappedDBIssues);
    }
  };

  // Fetch DB issues on initial mount
  useEffect(() => {
    refreshIssuesFromDB();
  }, []);

  // Dark Mode Sync
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ac_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ac_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist issues
  useEffect(() => {
    localStorage.setItem('ac_issues', JSON.stringify(issues));
  }, [issues]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const addToast = (type: Toast['type'], title: string, message: string) => {
    const id = 'toast-' + Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addAuditLog = (action: string, targetId: string, details: string) => {
    const roleTitles: Record<UserRole, string> = {
      student_council: 'Student Council Representative',
      ad_academic: 'AD Academic',
      ad_maintenance: 'AD Maintenance',
      ad_students: 'AD Students',
      admin: 'Administrator'
    };
    const newLog: AuditLogEntry = {
      id: 'log-' + Date.now(),
      action,
      performedBy: `${roleTitles[currentRole]}`,
      role: currentRole,
      targetId,
      timestamp: new Date().toLocaleString(),
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addIssue = (issueData: Partial<GrievanceIssue>): GrievanceIssue => {
    const newId = `GRV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const nowStr = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    const newIssue: GrievanceIssue = {
      id: newId,
      title: issueData.title || (issueData.type === 'academic' ? `${issueData.subject} Issue` : `${issueData.building} Maintenance`),
      type: issueData.type || 'academic',
      student: issueData.student || {
        id: '2024STU' + Math.floor(1000 + Math.random() * 9000),
        name: 'Student User',
        department: 'Computer Science & Engineering',
        year: '2nd Year',
        semester: '4th Semester',
        mobile: '+91 98000 00000',
        email: 'student@univ.edu'
      },
      subject: issueData.subject,
      facultyName: issueData.facultyName,
      course: issueData.course,
      academicCategory: issueData.academicCategory,
      evidenceFiles: issueData.evidenceFiles || [],
      
      building: issueData.building,
      floor: issueData.floor,
      roomNumber: issueData.roomNumber,
      maintenanceCategory: issueData.maintenanceCategory,
      location: issueData.location,
      imageFiles: issueData.imageFiles || [],

      priority: issueData.priority || 'medium',
      status: 'pending',
      expectedResolutionDate: issueData.expectedResolutionDate || '2026-08-01',
      remarks: issueData.remarks || '',
      description: issueData.description || '',
      attachments: issueData.attachments || [],
      submittedAt: nowStr,
      timeline: [
        {
          id: 'tl-' + Date.now(),
          title: 'Grievance Registered',
          description: `Intake recorded by Student Council (${issueData.student?.name || 'Student'}).`,
          timestamp: nowStr,
          performedBy: 'Student Council Representative',
          role: 'student_council',
          status: 'pending'
        }
      ]
    };

    // Persist to FastAPI + MySQL Workbench database
    apiService.createSingleIssue({
      type: newIssue.type,
      title: newIssue.title,
      student_id: newIssue.student.id,
      student_name: newIssue.student.name,
      department: newIssue.student.department,
      mobile: newIssue.student.mobile,
      category: newIssue.academicCategory || newIssue.maintenanceCategory,
      description: newIssue.description,
      remarks: newIssue.remarks,
      status: 'pending',
      building: newIssue.building,
      floor: newIssue.floor,
      room_number: newIssue.roomNumber,
      location: newIssue.location,
      subject: newIssue.subject,
      faculty_name: newIssue.facultyName,
      course: newIssue.course
    });

    setIssues(prev => [newIssue, ...prev]);
    addAuditLog('CREATE_COMPLAINT', newId, `Registered new ${newIssue.type} grievance for ${newIssue.student.name}`);
    addToast('success', 'Grievance Registered', `Ticket ID ${newId} generated successfully.`);
    return newIssue;
  };

  const updateIssueStatus = (issueId: string, status: IssueStatus, comment?: string) => {
    const nowStr = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    setIssues(prev => prev.map(issue => {
      if (issue.id !== issueId) return issue;

      const statusLabels: Record<IssueStatus, string> = {
        pending: 'Pending Intake',
        assigned: 'Staff Assigned',
        investigating: 'Under Investigation',
        work_started: 'Work Started',
        work_completed: 'Work Completed',
        verification_pending: 'Verification Pending',
        resolved: 'Resolved',
        rejected: 'Rejected',
        reopened: 'Reopened'
      };

      const newTimelineItem = {
        id: 'tl-' + Date.now(),
        title: `Status set to ${statusLabels[status]}`,
        description: comment || `Status updated by ${currentRole.replace('_', ' ').toUpperCase()}`,
        timestamp: nowStr,
        performedBy: currentRole.replace('_', ' ').toUpperCase(),
        role: currentRole,
        status
      };

      return {
        ...issue,
        status,
        timeline: [newTimelineItem, ...issue.timeline]
      };
    }));

    addAuditLog('UPDATE_STATUS', issueId, `Changed status of ${issueId} to ${status}`);
    addToast('info', 'Status Updated', `Issue ${issueId} status is now ${status.replace('_', ' ')}.`);
  };

  const assignStaffToIssue = (issueId: string, staff: AssignedStaff) => {
    const nowStr = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    setIssues(prev => prev.map(issue => {
      if (issue.id !== issueId) return issue;

      const newTimelineItem = {
        id: 'tl-' + Date.now(),
        title: 'Staff Assigned',
        description: `Assigned to ${staff.name} (${staff.role}).`,
        timestamp: nowStr,
        performedBy: currentRole.replace('_', ' ').toUpperCase(),
        role: currentRole,
        status: 'assigned' as IssueStatus
      };

      return {
        ...issue,
        status: issue.status === 'pending' ? 'assigned' : issue.status,
        assignedTo: staff,
        timeline: [newTimelineItem, ...issue.timeline]
      };
    }));

    addAuditLog('ASSIGN_STAFF', issueId, `Assigned ${staff.name} to ${issueId}`);
    addToast('success', 'Staff Assigned', `${staff.name} assigned to handle ${issueId}.`);
  };

  const addStudentFeedback = (
    issueId: string, 
    feedback: StudentFeedback, 
    closeOrReopen: 'close' | 'reopen',
    finalRemarks?: string
  ) => {
    const nowStr = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    const targetStatus: IssueStatus = closeOrReopen === 'close' ? 'resolved' : 'reopened';

    setIssues(prev => prev.map(issue => {
      if (issue.id !== issueId) return issue;

      const newTimelineItem = {
        id: 'tl-' + Date.now(),
        title: closeOrReopen === 'close' ? 'Grievance Verified & Closed' : 'Grievance Reopened',
        description: `Feedback: ${feedback.satisfied ? 'Satisfied' : 'Unsatisfied'} (${feedback.rating}/5 stars). ${feedback.comments}`,
        timestamp: nowStr,
        performedBy: 'AD Students Verification',
        role: 'ad_students',
        status: targetStatus
      };

      return {
        ...issue,
        status: targetStatus,
        feedback,
        finalRemarks: finalRemarks || issue.finalRemarks,
        closedAt: closeOrReopen === 'close' ? nowStr : undefined,
        timeline: [newTimelineItem, ...issue.timeline]
      };
    }));

    addAuditLog('VERIFY_RESOLUTION', issueId, `${closeOrReopen === 'close' ? 'Closed' : 'Reopened'} grievance ${issueId} based on verification.`);
    addToast(closeOrReopen === 'close' ? 'success' : 'warning', 'Verification Processed', `Grievance ${issueId} has been ${targetStatus}.`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      setCurrentRole,
      issues,
      departments,
      users,
      auditLogs,
      notifications,
      isDarkMode,
      toggleDarkMode,
      searchQuery,
      setSearchQuery,
      selectedIssueId,
      setSelectedIssueId,
      activeTab,
      setActiveTab,
      refreshIssuesFromDB,
      addIssue,
      updateIssueStatus,
      assignStaffToIssue,
      addStudentFeedback,
      markNotificationRead,
      clearAllNotifications,
      toasts,
      addToast,
      removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
