import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { IssueType } from '../../types/grievance';
import { 
  X, 
  FileText, 
  Wrench, 
  BookOpen, 
  User, 
  Upload, 
  Save, 
  RotateCcw, 
  Check, 
  Paperclip,
  Building
} from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterComplaintModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { addIssue, departments } = useApp();

  const [issueType, setIssueType] = useState<IssueType>('academic');

  // Student Info State (Only studentId, studentName, department, mobile)
  const [studentId, setStudentId] = useState('2024CSE' + Math.floor(100 + Math.random() * 900));
  const [studentName, setStudentName] = useState('');
  const [department, setDepartment] = useState(departments[0]?.name || 'Computer Science & Engineering');
  const [mobile, setMobile] = useState('');

  // Academic Fields (academicCategory as Input tag)
  const [subject, setSubject] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [course, setCourse] = useState('B.Tech CSE');
  const [academicCategory, setAcademicCategory] = useState('');

  // Maintenance Fields (Everything as Input tags!)
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [maintenanceCategory, setMaintenanceCategory] = useState('');
  const [locationDetails, setLocationDetails] = useState('');

  // Common Fields (Description, Remarks, Files)
  const [description, setDescription] = useState('');
  const [remarks, setRemarks] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const names = Array.from(e.target.files).map(f => f.name);
      setUploadedFiles(prev => [...prev, ...names]);
    }
  };

  const handleReset = () => {
    setStudentName('');
    setMobile('');
    setSubject('');
    setFacultyName('');
    setAcademicCategory('');
    setBuilding('');
    setFloor('');
    setRoomNumber('');
    setMaintenanceCategory('');
    setLocationDetails('');
    setDescription('');
    setRemarks('');
    setUploadedFiles([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !description.trim()) {
      alert('Please fill in Student Name and Description.');
      return;
    }

    addIssue({
      type: issueType,
      title: issueType === 'academic' 
        ? `${academicCategory || 'Academic Issue'}: ${subject || 'General'}`
        : `${maintenanceCategory || 'Maintenance Issue'} - ${building || 'Campus'} (${roomNumber || 'Spot'})`,
      student: {
        id: studentId || '2024STU909',
        name: studentName,
        department,
        mobile: mobile || '+91 98000 00000'
      },
      subject: issueType === 'academic' ? subject : undefined,
      facultyName: issueType === 'academic' ? facultyName : undefined,
      course: issueType === 'academic' ? course : undefined,
      academicCategory: issueType === 'academic' ? academicCategory : undefined,
      evidenceFiles: issueType === 'academic' ? uploadedFiles : undefined,

      building: issueType === 'maintenance' ? building : undefined,
      floor: issueType === 'maintenance' ? floor : undefined,
      roomNumber: issueType === 'maintenance' ? roomNumber : undefined,
      maintenanceCategory: issueType === 'maintenance' ? maintenanceCategory : undefined,
      location: issueType === 'maintenance' ? locationDetails : undefined,
      imageFiles: issueType === 'maintenance' ? uploadedFiles : undefined,

      description,
      remarks,
      attachments: uploadedFiles
    });

    handleReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-end sm:items-center justify-center">
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/20 shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Register Student Grievance / Issue
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Academic Council Official Intake Desk Form
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 max-h-[calc(90vh-130px)]">
          
          {/* Issue Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Select Issue Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <label
                className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  issueType === 'academic'
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className={`w-5 h-5 ${issueType === 'academic' ? 'text-brand-500' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs sm:text-sm">○ Academic Issue</div>
                    <div className="text-[10px] sm:text-[11px] font-normal text-slate-500 dark:text-slate-400">Grade, Faculty, Exam, Course</div>
                  </div>
                </div>
                {issueType === 'academic' && <Check className="w-4 h-4 text-brand-500" />}
                <input
                  type="radio"
                  name="issueType"
                  value="academic"
                  checked={issueType === 'academic'}
                  onChange={() => setIssueType('academic')}
                  className="sr-only"
                />
              </label>

              <label
                className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  issueType === 'maintenance'
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wrench className={`w-5 h-5 ${issueType === 'maintenance' ? 'text-brand-500' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs sm:text-sm">○ Maintenance Issue</div>
                    <div className="text-[10px] sm:text-[11px] font-normal text-slate-500 dark:text-slate-400">AC, Electrical, Plumbing, Wi-Fi</div>
                  </div>
                </div>
                {issueType === 'maintenance' && <Check className="w-4 h-4 text-brand-500" />}
                <input
                  type="radio"
                  name="issueType"
                  value="maintenance"
                  checked={issueType === 'maintenance'}
                  onChange={() => setIssueType('maintenance')}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {/* Section 1: Student Information (Only ID, Name, Department, Mobile) */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              <User className="w-4 h-4 text-brand-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Student Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Student ID *</label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500/50 outline-none text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500/50 outline-none text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Department *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500/50 outline-none text-slate-800 dark:text-slate-100"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Mobile Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dynamic Form Fields */}
          {issueType === 'academic' ? (
            <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/80 space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 border-b border-blue-200 dark:border-blue-800 pb-2">
                <BookOpen className="w-4 h-4 text-brand-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                  Academic Issue Specifications
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Subject / Paper</label>
                  <input
                    type="text"
                    placeholder="e.g. Data Structures & Algorithms (CS301)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Faculty / Evaluator Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. K. S. Sundaram"
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Course / Program</label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech CSE"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Academic Category is now an INPUT TAG */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Academic Category *</label>
                  <input
                    type="text"
                    placeholder="e.g. Grade Dispute, Attendance Shortage, Exam Scheduling..."
                    value={academicCategory}
                    onChange={(e) => setAcademicCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/80 space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 border-b border-amber-200 dark:border-amber-800 pb-2">
                <Building className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Maintenance & Estate Details
                </h3>
              </div>

              {/* EVERYTHING IN MAINTENANCE IS NOW AN INPUT TAG */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Building / Block *</label>
                  <input
                    type="text"
                    placeholder="e.g. Block B - Science & Tech Wing"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Floor *</label>
                  <input
                    type="text"
                    placeholder="e.g. 2nd Floor"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Room Number / Spot *</label>
                  <input
                    type="text"
                    placeholder="e.g. Room 204 / Lab B-302"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Maintenance Category *</label>
                  <input
                    type="text"
                    placeholder="e.g. Electrical, Plumbing, HVAC, Wi-Fi..."
                    value={maintenanceCategory}
                    onChange={(e) => setMaintenanceCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Exact Location Landmark *</label>
                  <input
                    type="text"
                    placeholder="e.g. East wing corridor near elevator"
                    value={locationDetails}
                    onChange={(e) => setLocationDetails(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Common Fields (Priority and Expected Resolution Date REMOVED) */}
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Detailed Issue Description *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Provide clear details regarding the grievance or repair requirement..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500/50 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            {/* Evidence & File Upload Box */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Upload Attachments / Evidence / Photos
              </label>
              <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:border-brand-500 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Click or drag files here to attach evidence (PDF, PNG, JPG)
                </p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {uploadedFiles.map((file, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      <Paperclip className="w-3 h-3 text-brand-500" />
                      {file}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Initial Remarks / Council Notes
              </label>
              <input
                type="text"
                placeholder="Optional notes for authority handling this issue..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 shrink-0">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>

              <button
                type="button"
                onClick={() => alert('Draft saved to local cache.')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                Save Draft
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-md shadow-brand-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <Check className="w-4 h-4" />
                Submit Complaint
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
