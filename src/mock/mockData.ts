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

export const MOCK_ISSUES: GrievanceIssue[] = [
  {
    id: 'GRV-2026-104',
    title: 'Discrepancy in Mid-Semester Data Structures Grade',
    type: 'academic',
    student: {
      id: '2023CSE045',
      name: 'Aarav Sharma',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      semester: '5th Semester',
      mobile: '+91 98765 43210',
      email: 'aarav.2023cse@univ.edu'
    },
    subject: 'Data Structures & Algorithms (CS301)',
    facultyName: 'Dr. K. S. Sundaram',
    course: 'B.Tech CSE',
    academicCategory: 'Grade Dispute',
    description: 'Marks for Question 4b were omitted in the tabulated result sheet despite full marks being given on the physically evaluated answer script attached.',
    evidenceFiles: ['Answer_Script_Scan_Q4.pdf', 'Grade_Sheet_Portal.png'],
    priority: 'high',
    status: 'investigating',
    expectedResolutionDate: '2026-07-28',
    remarks: 'Forwarded to AD Academic for urgent verification with department controller.',
    submittedAt: '2026-07-20 10:30 AM',
    assignedTo: {
      id: 'stf-101',
      name: 'Dr. K. S. Sundaram',
      role: 'Faculty Evaluator',
      department: 'Computer Science & Engineering',
      assignedAt: '2026-07-21 02:15 PM'
    },
    timeline: [
      {
        id: 'tl-1',
        title: 'Complaint Intake',
        description: 'Issue recorded by Student Council representative Siddharth Rao.',
        timestamp: '2026-07-20 10:30 AM',
        performedBy: 'Siddharth Rao',
        role: 'Student Council Representative'
      },
      {
        id: 'tl-2',
        title: 'Forwarded to Academic Dean',
        description: 'Assigned category Grade Dispute and priority High.',
        timestamp: '2026-07-20 11:45 AM',
        performedBy: 'Student Council System',
        role: 'System'
      },
      {
        id: 'tl-3',
        title: 'Faculty Assigned',
        description: 'AD Academic assigned subject teacher Dr. K. S. Sundaram for script re-verification.',
        timestamp: '2026-07-21 02:15 PM',
        performedBy: 'Dr. Ramesh Kumar',
        role: 'AD Academic',
        status: 'investigating'
      }
    ]
  },
  {
    id: 'GRV-2026-105',
    title: 'AC Cooling Failure in Main Supercomputing Lab B-302',
    type: 'maintenance',
    student: {
      id: '2024EEE012',
      name: 'Priya Nambiar',
      department: 'Electrical & Electronics Eng.',
      year: '2nd Year',
      semester: '3rd Semester',
      mobile: '+91 98123 45678',
      email: 'priya.2024eee@univ.edu'
    },
    building: 'Block B - Science & Tech Wing',
    floor: '3rd Floor',
    roomNumber: 'B-302',
    maintenanceCategory: 'HVAC & Air Conditioning',
    location: 'Supercomputing Center, East Wing',
    imageFiles: ['Lab_AC_Compressor_Error.jpg'],
    description: 'The central duct cooling system in Lab B-302 has stopped functioning, leading to high thermal throttles on workstation servers during afternoon lab sessions.',
    priority: 'critical',
    status: 'work_started',
    expectedResolutionDate: '2026-07-24',
    remarks: 'Dispatch team sent immediately to prevent hardware damage.',
    submittedAt: '2026-07-21 09:15 AM',
    assignedTo: {
      id: 'stf-204',
      name: 'HVAC Rapid Response Unit',
      role: 'Lead Technician',
      trade: 'HVAC & AC',
      assignedAt: '2026-07-21 10:00 AM'
    },
    timeline: [
      {
        id: 'tl-10',
        title: 'Issue Logged',
        description: 'Complaint registered via Council Desk by Priya Nambiar.',
        timestamp: '2026-07-21 09:15 AM',
        performedBy: 'Siddharth Rao',
        role: 'Student Council Representative'
      },
      {
        id: 'tl-11',
        title: 'Urgent Dispatch',
        description: 'AD Maintenance flagged as Critical and assigned HVAC Repair Unit.',
        timestamp: '2026-07-21 10:00 AM',
        performedBy: 'Eng. Rajesh Verma',
        role: 'AD Maintenance',
        status: 'assigned'
      },
      {
        id: 'tl-12',
        title: 'Work Started',
        description: 'Technician opened refrigerant line inspection on roof unit 4.',
        timestamp: '2026-07-22 08:30 AM',
        performedBy: 'Lead HVAC Tech',
        role: 'HVAC Team',
        status: 'work_started'
      }
    ]
  },
  {
    id: 'GRV-2026-106',
    title: 'Wi-Fi Signal Dropout & High Packet Loss in Library 2nd Floor',
    type: 'maintenance',
    student: {
      id: '2022MECH088',
      name: 'Vikramaditya Roy',
      department: 'Mechanical Engineering',
      year: '4th Year',
      semester: '7th Semester',
      mobile: '+91 97654 32109',
      email: 'vikram.2022mech@univ.edu'
    },
    building: 'Central Library Building',
    floor: '2nd Floor',
    roomNumber: 'Quiet Study Zone 2B',
    maintenanceCategory: 'Network & Wi-Fi',
    location: 'Access Point AP-LIB-2B',
    imageFiles: ['Ping_Test_Result.png'],
    description: 'Wi-Fi access point drops connections every 10 minutes, disrupting research paper submissions.',
    priority: 'medium',
    status: 'assigned',
    expectedResolutionDate: '2026-07-26',
    remarks: 'Assigned to IT Network Operations.',
    submittedAt: '2026-07-22 11:00 AM',
    assignedTo: {
      id: 'stf-302',
      name: 'NetOps Team - Tech Alok',
      role: 'Network Engineer',
      trade: 'Network & Wi-Fi',
      assignedAt: '2026-07-22 01:30 PM'
    },
    timeline: [
      {
        id: 'tl-20',
        title: 'Issue Registered',
        description: 'Network grievance recorded.',
        timestamp: '2026-07-22 11:00 AM',
        performedBy: 'Student Council',
        role: 'Student Council Representative'
      },
      {
        id: 'tl-21',
        title: 'Assigned to NetOps',
        description: 'Scheduled for access point firmware upgrade and cable check.',
        timestamp: '2026-07-22 01:30 PM',
        performedBy: 'Eng. Rajesh Verma',
        role: 'AD Maintenance',
        status: 'assigned'
      }
    ]
  },
  {
    id: 'GRV-2026-107',
    title: 'Attendance Shortage Warning for Bio-Fluid Dynamics (BIO402)',
    type: 'academic',
    student: {
      id: '2023BIO019',
      name: 'Ananya Deshmukh',
      department: 'Biotechnology & Bioengineering',
      year: '3rd Year',
      semester: '6th Semester',
      mobile: '+91 99887 76655',
      email: 'ananya.2023bio@univ.edu'
    },
    subject: 'Bio-Fluid Dynamics (BIO402)',
    facultyName: 'Prof. S. Chakrabarty',
    course: 'B.Tech Biotech',
    academicCategory: 'Attendance Shortage',
    description: 'Medical leave approved by Dean of Student Affairs was not updated in the automated ERP biometric attendance log for 4 lecture sessions.',
    evidenceFiles: ['Approved_Medical_Leave_Certificate.pdf'],
    priority: 'high',
    status: 'verification_pending',
    expectedResolutionDate: '2026-07-25',
    remarks: 'Medical leave document verified by AD Students.',
    submittedAt: '2026-07-18 04:00 PM',
    assignedTo: {
      id: 'stf-105',
      name: 'Prof. S. Chakrabarty',
      role: 'Course Coordinator',
      department: 'Biotechnology & Bioengineering',
      assignedAt: '2026-07-19 09:00 AM'
    },
    timeline: [
      {
        id: 'tl-30',
        title: 'Intake Completed',
        description: 'Student submitted medical certificate.',
        timestamp: '2026-07-18 04:00 PM',
        performedBy: 'Student Council Representative',
        role: 'Student Council'
      },
      {
        id: 'tl-31',
        title: 'Attendance Rectified',
        description: 'Course teacher updated attendance record in ERP.',
        timestamp: '2026-07-22 03:00 PM',
        performedBy: 'Prof. S. Chakrabarty',
        role: 'Faculty',
        status: 'verification_pending'
      }
    ]
  },
  {
    id: 'GRV-2026-108',
    title: 'Water Leakage in Girl Hostel Block 4 Room 204 Bathroom',
    type: 'maintenance',
    student: {
      id: '2025ARCH003',
      name: 'Riya Gupta',
      department: 'School of Architecture & Design',
      year: '1st Year',
      semester: '2nd Semester',
      mobile: '+91 91234 56789',
      email: 'riya.2025arch@univ.edu'
    },
    building: 'Girls Hostel Block 4',
    floor: '2nd Floor',
    roomNumber: 'Room 204',
    maintenanceCategory: 'Plumbing',
    location: 'Ensuite Bathroom',
    imageFiles: ['Plumbing_Leak_Photo.jpg'],
    description: 'Severe pipe joint leakage under sink causing water accumulation on bathroom floor.',
    priority: 'high',
    status: 'resolved',
    expectedResolutionDate: '2026-07-22',
    remarks: 'Plumber repaired joint gasket and sealed with sealant.',
    submittedAt: '2026-07-19 08:00 AM',
    assignedTo: {
      id: 'stf-210',
      name: 'Master Plumber Mohan',
      role: 'Plumbing Supervisor',
      trade: 'Plumbing',
      assignedAt: '2026-07-19 09:30 AM'
    },
    feedback: {
      satisfied: true,
      rating: 5,
      comments: 'Repaired within 4 hours of complaint. Very polite team.',
      submittedAt: '2026-07-22 05:00 PM'
    },
    closedAt: '2026-07-22 05:10 PM',
    timeline: [
      {
        id: 'tl-40',
        title: 'Registered',
        description: 'Reported by hostel rep.',
        timestamp: '2026-07-19 08:00 AM',
        performedBy: 'Council',
        role: 'Student Council'
      },
      {
        id: 'tl-41',
        title: 'Work Completed',
        description: 'Plumbing pipe replaced.',
        timestamp: '2026-07-21 04:00 PM',
        performedBy: 'Master Plumber Mohan',
        role: 'Plumber',
        status: 'work_completed'
      },
      {
        id: 'tl-42',
        title: 'Student Verification',
        description: 'Student rated 5 stars and confirmed repair.',
        timestamp: '2026-07-22 05:00 PM',
        performedBy: 'Prof. Ananya Roy',
        role: 'AD Students',
        status: 'resolved'
      }
    ]
  },
  {
    id: 'GRV-2026-109',
    title: 'Overcrowding & Overlapping Schedule in Mechanical Lab Elective',
    type: 'academic',
    student: {
      id: '2023MECH042',
      name: 'Rohan Mehta',
      department: 'Mechanical Engineering',
      year: '3rd Year',
      semester: '5th Semester',
      mobile: '+91 98765 11223',
      email: 'rohan.2023mech@univ.edu'
    },
    subject: 'Advanced Robotics Lab (ME304L)',
    facultyName: 'Dr. V. K. Raman',
    course: 'B.Tech MECH',
    academicCategory: 'Curriculum & Pedagogy',
    description: 'Slot B clashes with core Thermodynamics tutorial session for 18 students.',
    priority: 'medium',
    status: 'pending',
    expectedResolutionDate: '2026-07-30',
    remarks: 'Awaiting timetable committee review.',
    submittedAt: '2026-07-23 09:00 AM',
    timeline: [
      {
        id: 'tl-50',
        title: 'Intake',
        description: 'Group grievance registered by class representative.',
        timestamp: '2026-07-23 09:00 AM',
        performedBy: 'Siddharth Rao',
        role: 'Student Council Representative',
        status: 'pending'
      }
    ]
  }
];

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
