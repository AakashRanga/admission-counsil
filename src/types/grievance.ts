export type UserRole = 
  | 'student_council'
  | 'ad_academic'
  | 'ad_maintenance'
  | 'ad_students'
  | 'admin';

export type IssueType = 'academic' | 'maintenance';

export type PriorityLevel = string;

export type IssueStatus = 
  | 'pending'
  | 'assigned'
  | 'investigating'
  | 'work_started'
  | 'work_completed'
  | 'verification_pending'
  | 'resolved'
  | 'rejected'
  | 'reopened';

export interface StudentInfo {
  id: string;
  name: string;
  department: string;
  mobile: string;
  year?: string;
  semester?: string;
  email?: string;
}

export interface AssignedStaff {
  id: string;
  name: string;
  role: string;
  department?: string;
  trade?: string;
  assignedAt: string;
}

export interface TimelineEntry {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  performedBy: string;
  role: string;
  status?: IssueStatus;
}

export interface StudentFeedback {
  satisfied: boolean;
  rating: number; // 1-5
  comments: string;
  submittedAt: string;
}

export interface GrievanceIssue {
  id: string;
  title: string;
  type: IssueType;
  student: StudentInfo;
  
  // Academic specific
  subject?: string;
  facultyName?: string;
  course?: string;
  academicCategory?: string;
  evidenceFiles?: string[];

  // Maintenance specific
  building?: string;
  floor?: string;
  roomNumber?: string;
  maintenanceCategory?: string;
  location?: string;
  imageFiles?: string[];

  // Common fields
  priority?: PriorityLevel;
  status: IssueStatus;
  expectedResolutionDate?: string;
  remarks: string;
  description: string;
  attachments?: string[];
  submittedAt: string;
  
  assignedTo?: AssignedStaff;
  timeline: TimelineEntry[];
  feedback?: StudentFeedback;
  finalRemarks?: string;
  closedAt?: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
}

export interface DepartmentInfo {
  id: string;
  name: string;
  code: string;
  headName: string;
  activeIssuesCount: number;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  role: UserRole;
  targetId: string;
  timestamp: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'urgent';
  targetIssueId?: string;
}
