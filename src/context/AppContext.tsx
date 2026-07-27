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
  isLoading: boolean;
  toggleDarkMode: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedIssueId: string | null;
  setSelectedIssueId: (id: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Actions
  refreshIssuesFromDB: () => Promise<void>;
  refreshAdminDataFromDB: () => Promise<void>;
  addIssue: (issueData: Partial<GrievanceIssue>) => GrievanceIssue;
  addUser: (userData: { name: string; email: string; role: string; department: string; password?: string }) => Promise<void>;
  addDepartment: (deptData: { name: string; code: string; headName: string }) => Promise<void>;
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
    setActiveTabState('dashboard');
    localStorage.setItem('ac_active_tab', 'dashboard');
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
  const [departments, setDepartments] = useState<DepartmentInfo[]>(INITIAL_DEPARTMENTS);
  const [users, setUsers] = useState<SystemUser[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('ac_theme') === 'dark';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Function to fetch database records via REST API
  const refreshIssuesFromDB = async () => {
    setIsLoading(true);
    try {
      const dbData = await apiService.getIssues();
      if (dbData && Array.isArray(dbData) && dbData.length > 0) {
        const mappedDBIssues: GrievanceIssue[] = dbData.map((dbItem: any) => {
        const currentStatus = dbItem.status || 'pending';
        const assignedTo = dbItem.assigned_staff_name ? {
          name: dbItem.assigned_staff_name,
          mobile: dbItem.assigned_staff_mobile || '',
          specialInstructions: dbItem.special_instructions || '',
          assignedAt: 'Database Record'
        } : undefined;

        // Parse dbItem.remarks for custom status comments
        const remarksMap: Record<string, string> = {};
        if (dbItem.remarks) {
          const parts = dbItem.remarks.split('|');
          for (const p of parts) {
            const trimmed = p.trim();
            const match = trimmed.match(/^\[([A-Z_]+)\]\s*(.*)$/i);
            if (match) {
              remarksMap[match[1].toLowerCase()] = match[2].trim();
            }
          }
        }

        // Step 1: Ticket Registered
        timelineEntries.push({
          id: `tl-created-${dbItem.id}`,
          title: 'Ticket Registered',
          description: 'Grievance ticket created in database.',
          timestamp: dbItem.created_at ? new Date(dbItem.created_at).toLocaleDateString() : 'Registered',
          performedBy: 'STUDENT PORTAL',
          role: 'student_council',
          status: 'pending'
        });

        // Step 2: Staff Assigned (if assigned)
        if (assignedTo) {
          timelineEntries.push({
            id: `tl-assign-${dbItem.id}`,
            title: 'Staff Assigned',
            description: `Assigned to ${assignedTo.name} (Contact: ${assignedTo.mobile || 'N/A'}). ${assignedTo.specialInstructions ? `Notes: ${assignedTo.specialInstructions}` : ''}`,
            timestamp: 'Assigned',
            performedBy: 'AUTHORITY DESK',
            role: 'ad_academic',
            status: 'assigned'
          });
        }

        // Step 3: Under Investigation
        const isInvestigatingOrBeyond = ['investigating', 'work_started', 'work_completed', 'verification_pending', 'resolved'].includes(currentStatus);
        if (isInvestigatingOrBeyond) {
          const invComment = remarksMap['investigating'] || (dbItem.remarks && !dbItem.remarks.includes('[') ? dbItem.remarks : null);
          timelineEntries.push({
            id: `tl-inv-${dbItem.id}`,
            title: 'Under Investigation',
            description: invComment ? `Log Comment: "${invComment}"` : 'Authority team initiated detailed investigation of grievance.',
            timestamp: 'In Progress',
            performedBy: 'AUTHORITY DESK',
            role: 'ad_academic',
            status: 'investigating'
          });
        }

        // Step 4: Work Started
        const isWorkStartedOrBeyond = ['work_started', 'work_completed', 'verification_pending', 'resolved'].includes(currentStatus);
        if (isWorkStartedOrBeyond) {
          const wsComment = remarksMap['work_started'];
          timelineEntries.push({
            id: `tl-started-${dbItem.id}`,
            title: 'Work Started',
            description: wsComment ? `Log Comment: "${wsComment}"` : 'Action and resolution work commenced on site/portal.',
            timestamp: 'In Progress',
            performedBy: 'ASSIGNED STAFF',
            role: 'ad_academic',
            status: 'work_started'
          });
        }

        // Step 5: Work Completed
        const isWorkCompletedOrBeyond = ['work_completed', 'verification_pending', 'resolved'].includes(currentStatus);
        if (isWorkCompletedOrBeyond) {
          const wcComment = remarksMap['work_completed'];
          timelineEntries.push({
            id: `tl-completed-${dbItem.id}`,
            title: 'Work Completed',
            description: wcComment ? `Log Comment: "${wcComment}"` : 'Resolution work completed. Forwarded to AD Students for verification.',
            timestamp: 'Completed',
            performedBy: 'ASSIGNED STAFF',
            role: 'ad_academic',
            status: 'work_completed'
          });
        }

        // Step 6: Ticket Closed & Verified by AD Students
        if (currentStatus === 'resolved' || currentStatus === 'reopened') {
          const verComment = dbItem.final_remarks || dbItem.feedback_comments || remarksMap['resolved'] || remarksMap['reopened'];
          timelineEntries.push({
            id: `tl-resolved-${dbItem.id}`,
            title: currentStatus === 'resolved' ? 'Ticket Closed & Verified' : 'Issue Reopened',
            description: verComment ? `Log Comment: "${verComment}"` : (currentStatus === 'resolved' ? 'Final verification completed with student. Ticket closed by AD Students Welfare.' : 'Issue reopened by AD Students for further resolution.'),
            timestamp: dbItem.closed_at || 'Closed',
            performedBy: 'AD STUDENTS WELFARE',
            role: 'ad_students',
            status: currentStatus
          });
        }

        // Reverse so newest milestone appears at the top
        timelineEntries.reverse();

        return {
          id: dbItem.id,
          type: dbItem.type || 'academic',
          title: dbItem.title,
          student: {
            id: dbItem.student_id || '2024STU101',
            name: dbItem.student_name || 'Student',
            department: dbItem.department || 'Computer Science & Engineering',
            mobile: dbItem.mobile || '+91 98000 00000'
          },
          status: currentStatus,
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
          assignedTo,
          feedback: (dbItem.rating !== null && dbItem.rating !== undefined) ? {
            satisfied: Boolean(dbItem.satisfied),
            rating: Number(dbItem.rating),
            comments: dbItem.feedback_comments || '',
            submittedAt: dbItem.closed_at || 'Recently'
          } : undefined,
          finalRemarks: dbItem.final_remarks || undefined,
          closedAt: dbItem.closed_at || undefined,
          timeline: timelineEntries
        };
      });

      // Replace issues state with live database records
      setIssues(mappedDBIssues);
    }
    } catch (err) {
      console.warn('[*] Error refreshing issues from DB:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch Admin DB records (users, departments, audit logs)
  const refreshAdminDataFromDB = async () => {
    setIsLoading(true);
    try {
      const [usersData, deptsData, logsData] = await Promise.all([
        apiService.getUsers(),
        apiService.getDepartments(),
        apiService.getAuditLogs()
      ]);

      if (usersData && Array.isArray(usersData) && usersData.length > 0) {
        const mappedUsers: SystemUser[] = usersData.map((u: any) => ({
          id: String(u.id),
          name: u.name,
          email: u.email,
          role: u.role,
          department: u.department
        }));
        setUsers(mappedUsers);
      }

      if (deptsData && Array.isArray(deptsData) && deptsData.length > 0) {
        const mappedDepts: DepartmentInfo[] = deptsData.map((d: any) => ({
          id: d.id,
          name: d.name,
          code: d.code,
          headName: d.head_name || d.headName,
          activeIssuesCount: 0
        }));
        setDepartments(mappedDepts);
      }

      if (logsData && Array.isArray(logsData) && logsData.length > 0) {
        const mappedLogs: AuditLogEntry[] = logsData.map((l: any) => ({
          id: String(l.id),
          action: l.action,
          performedBy: l.performed_by || l.performedBy,
          role: l.role,
          targetId: l.target_id || l.targetId,
          timestamp: l.timestamp,
          details: l.details
        }));
        setAuditLogs(mappedLogs);
      }
    } catch (e) {
      console.warn('[*] Error fetching admin data from DB:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch DB issues & admin data on initial mount
  useEffect(() => {
    refreshIssuesFromDB();
    refreshAdminDataFromDB();
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
    const nowStr = new Date().toLocaleString();
    const newLog: AuditLogEntry = {
      id: 'log-' + Date.now(),
      action,
      performedBy: `${roleTitles[currentRole] || 'System User'}`,
      role: currentRole,
      targetId,
      timestamp: nowStr,
      details
    };

    // Save audit log to DB
    apiService.createAuditLog({
      action: newLog.action,
      performed_by: newLog.performedBy,
      role: newLog.role,
      target_id: newLog.targetId,
      timestamp: newLog.timestamp,
      details: newLog.details
    });

    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addUser = async (userData: { name: string; email: string; role: string; department: string; password?: string }) => {
    const newUserObj = await apiService.createUser({
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      password: userData.password || 'simats123'
    });

    if (newUserObj) {
      const createdUser: SystemUser = {
        id: String(newUserObj.id),
        name: newUserObj.name,
        email: newUserObj.email,
        role: newUserObj.role,
        department: newUserObj.department
      };
      setUsers(prev => [createdUser, ...prev]);
      addAuditLog('CREATE_USER', String(newUserObj.id), `Added authority user ${userData.name} (${userData.role}) to DB.`);
      addToast('success', 'User Registered', `${userData.name} added to authority roster.`);
    }
  };

  const addDepartment = async (deptData: { name: string; code: string; headName: string }) => {
    const newDeptObj = await apiService.createDepartment({
      name: deptData.name,
      code: deptData.code,
      head_name: deptData.headName
    });

    if (newDeptObj) {
      const createdDept: DepartmentInfo = {
        id: newDeptObj.id,
        name: newDeptObj.name,
        code: newDeptObj.code,
        headName: newDeptObj.head_name || newDeptObj.headName,
        activeIssuesCount: 0
      };
      setDepartments(prev => [...prev, createdDept]);
      addAuditLog('CREATE_DEPARTMENT', newDeptObj.id, `Created new department ${deptData.name} (${deptData.code}).`);
      addToast('success', 'Department Created', `${deptData.name} directory record saved to DB.`);
    }
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

    // Persist to backend database
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

    // Persist status and remarks log to backend database via REST API
    apiService.updateStatus(issueId, status, comment);

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

      const descriptionText = comment ? `Log Comment: "${comment}"` : `Status updated to ${statusLabels[status]}`;

      const newTimelineItem = {
        id: 'tl-' + Date.now(),
        title: statusLabels[status],
        description: descriptionText,
        timestamp: nowStr,
        performedBy: currentRole.replace('_', ' ').toUpperCase(),
        role: currentRole,
        status
      };

      const updatedRemarks = comment 
        ? (issue.remarks ? `${issue.remarks} | [${status.toUpperCase()}] ${comment}` : `[${status.toUpperCase()}] ${comment}`)
        : issue.remarks;

      return {
        ...issue,
        status,
        remarks: updatedRemarks,
        timeline: [newTimelineItem, ...issue.timeline]
      };
    }));

    addAuditLog('UPDATE_STATUS', issueId, `Changed status of ${issueId} to ${status}. ${comment ? `Comment: ${comment}` : ''}`);
    addToast('info', 'Status & Log Updated', `Ticket ${issueId} updated to ${status.replace('_', ' ')}.`);
  };


  const assignStaffToIssue = (issueId: string, staff: AssignedStaff) => {
    const nowStr = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    // Persist to backend database via REST API
    apiService.assignStaff(issueId, {
      assigned_staff_name: staff.name,
      assigned_staff_mobile: staff.mobile || '',
      special_instructions: staff.specialInstructions || ''
    });

    setIssues(prev => prev.map(issue => {
      if (issue.id !== issueId) return issue;

      const roleOrMobile = staff.mobile ? `Contact: ${staff.mobile}` : (staff.role || 'Staff');
      const newTimelineItem = {
        id: 'tl-' + Date.now(),
        title: 'Staff Assigned',
        description: `Assigned to ${staff.name} (${roleOrMobile}). Notes: ${staff.specialInstructions || 'None'}`,
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
    addToast('success', 'Staff Assigned', `${staff.name} assigned to handle ${issueId}. Saved to DB.`);
  };


  const addStudentFeedback = (
    issueId: string, 
    feedback: StudentFeedback, 
    closeOrReopen: 'close' | 'reopen',
    finalRemarks?: string
  ) => {
    const nowStr = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    const targetStatus: IssueStatus = closeOrReopen === 'close' ? 'resolved' : 'reopened';

    // Persist final closure or reopening status & feedback to backend database API
    apiService.verifyResolution(issueId, {
      status: targetStatus,
      rating: feedback.rating,
      satisfied: feedback.satisfied,
      feedback_comments: feedback.comments,
      final_remarks: finalRemarks
    });

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
      isLoading,
      toggleDarkMode,
      searchQuery,
      setSearchQuery,
      selectedIssueId,
      setSelectedIssueId,
      activeTab,
      setActiveTab,
      refreshIssuesFromDB,
      refreshAdminDataFromDB,
      addIssue,
      addUser,
      addDepartment,
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
