import type { GrievanceIssue, DepartmentInfo, SystemUser, AuditLogEntry, NotificationItem } from '../types/grievance';

export const INITIAL_DEPARTMENTS: DepartmentInfo[] = [
  { id: 'dept-1', name: 'Computer Science & Engineering', code: 'CSE', headName: 'Dr. Aris Thorne', activeIssuesCount: 12 },
  { id: 'dept-2', name: 'Electrical & Electronics Eng.', code: 'EEE', headName: 'Dr. Elena Vance', activeIssuesCount: 8 },
  { id: 'dept-3', name: 'Mechanical Engineering', code: 'MECH', headName: 'Prof. Marcus Vance', activeIssuesCount: 15 },
  { id: 'dept-4', name: 'Biotechnology & Bioengineering', code: 'BIO', headName: 'Dr. Sophia Lin', activeIssuesCount: 5 },
  { id: 'dept-5', name: 'School of Architecture & Design', code: 'ARCH', headName: 'Prof. David Miller', activeIssuesCount: 9 },
  { id: 'dept-6', name: 'School of Management & Business', code: 'SMB', headName: 'Dr. Rachel Green', activeIssuesCount: 6 }
];

export const INITIAL_USERS: SystemUser[] = [
  { id: 'usr-1', name: 'Siddharth Rao', email: 'siddharth.council@univ.edu', role: 'student_council', department: 'CSE' },
  { id: 'usr-2', name: 'Dr. Ramesh Kumar', email: 'ramesh.academic@univ.edu', role: 'ad_academic', department: 'Academic Affairs' },
  { id: 'usr-3', name: 'Eng. Rajesh Verma', email: 'rajesh.maint@univ.edu', role: 'ad_maintenance', department: 'Campus Estate & Infra' },
  { id: 'usr-4', name: 'Prof. Ananya Roy', email: 'ananya.students@univ.edu', role: 'ad_students', department: 'Student Welfare' },
  { id: 'usr-5', name: 'Admin Operations', email: 'admin.portal@univ.edu', role: 'admin', department: 'Central Administration' }
];

export const MOCK_ISSUES: GrievanceIssue[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Critical Issue Alert',
    message: 'AC Cooling Failure in Lab B-302 marked as CRITICAL.',
    timestamp: '10 minutes ago',
    read: false,
    type: 'urgent',
    targetIssueId: 'GRV-2026-105'
  },
  {
    id: 'notif-2',
    title: 'Grade Dispute Updated',
    message: 'Dr. K. S. Sundaram added verification notes to GRV-2026-104.',
    timestamp: '1 hour ago',
    read: false,
    type: 'info',
    targetIssueId: 'GRV-2026-104'
  },
  {
    id: 'notif-3',
    title: 'Issue Verification Completed',
    message: 'Water Leakage in Hostel 4 marked RESOLVED by AD Students.',
    timestamp: 'Yesterday',
    read: true,
    type: 'success',
    targetIssueId: 'GRV-2026-108'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-101',
    action: 'CREATE_COMPLAINT',
    performedBy: 'Siddharth Rao (Student Council)',
    role: 'student_council',
    targetId: 'GRV-2026-109',
    timestamp: '2026-07-23 09:00:15',
    details: 'Registered Academic Complaint for Mechanical Lab Timetable clash.'
  },
  {
    id: 'log-102',
    action: 'ASSIGN_STAFF',
    performedBy: 'Eng. Rajesh Verma (AD Maintenance)',
    role: 'ad_maintenance',
    targetId: 'GRV-2026-106',
    timestamp: '2026-07-22 13:30:00',
    details: 'Assigned NetOps Team - Tech Alok to Wi-Fi issue in Library 2nd Floor.'
  },
  {
    id: 'log-103',
    action: 'VERIFY_RESOLUTION',
    performedBy: 'Prof. Ananya Roy (AD Students)',
    role: 'ad_students',
    targetId: 'GRV-2026-108',
    timestamp: '2026-07-22 17:10:00',
    details: 'Verified repair with student feedback (5 stars) and closed grievance.'
  },
  {
    id: 'log-104',
    action: 'UPDATE_STATUS',
    performedBy: 'Dr. Ramesh Kumar (AD Academic)',
    role: 'ad_academic',
    targetId: 'GRV-2026-104',
    timestamp: '2026-07-21 14:15:00',
    details: 'Changed status to Investigating and notified subject teacher.'
  }
];
