import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  BookOpen, 
  Wrench, 
  AlertCircle 
} from 'lucide-react';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { parseCSVLines } from '../../utils/csvParser';
import { apiService } from '../../services/api';

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose }) => {
  const { refreshIssuesFromDB, addToast } = useApp();
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const downloadTemplate = (type: 'academic' | 'maintenance') => {
    let headers = '';
    let sampleRow = '';
    let filename = '';

    if (type === 'academic') {
      filename = 'academic_grievances_template.csv';
      headers = 'Student ID,Student Name,Department,Mobile,Subject,Faculty Name,Course,Academic Category,Description,Remarks\n';
      sampleRow = '2024CSE101,Aarav Sharma,Computer Science & Engineering,+91 98765 43210,Data Structures,Dr. K. S. Sundaram,B.Tech CSE,Grade Dispute,Mid-term valuation mismatch in paper 2,Requesting answer sheet re-evaluation';
    } else {
      filename = 'maintenance_issues_template.csv';
      headers = 'Student ID,Student Name,Department,Mobile,Building Block,Floor,Room Number,Maintenance Category,Landmark Location,Description,Remarks\n';
      sampleRow = '2024MECH202,Priya Patel,Mechanical Engineering,+91 98000 11122,Block B - Science & Tech Wing,2nd Floor,Lab B-204,Electrical,East wing near elevator,Compressor unit making loud grinding noise,Urgent repair required for practical exams';
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + sampleRow);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Template Downloaded', `${filename} generated successfully.`);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = async (evt) => {
        const text = evt.target?.result as string;
        if (!text) return;

        const parsedRows = parseCSVLines(text);
        if (parsedRows.length <= 1) {
          setImportStatus('CSV file contains no data rows.');
          setImportedCount(null);
          return;
        }

        const headerCols = parsedRows[0].map(c => c.toLowerCase().trim());
        const isMaintenance = headerCols.some(c => c.includes('building') || c.includes('room') || c.includes('landmark'));

        const findIdx = (keywords: string[]) => {
          for (const kw of keywords) {
            const idx = headerCols.findIndex(h => h.includes(kw));
            if (idx !== -1) return idx;
          }
          return -1;
        };

        const studentIdIdx = findIdx(['student id', 'roll', 'student_id', 'id']);
        const nameIdx = findIdx(['student name', 'candidate name', 'student_name', 'name']);
        const deptIdx = findIdx(['department', 'dept', 'branch']);
        const mobileIdx = findIdx(['mobile', 'phone', 'contact']);
        const categoryIdx = findIdx(['academic category', 'maintenance category', 'category', 'type']);
        const descIdx = findIdx(['description', 'details', 'complaint', 'issue']);
        const remarksIdx = findIdx(['remarks', 'comment', 'notes']);

        // Academic specific
        const subjectIdx = findIdx(['subject', 'course code']);
        const facultyIdx = findIdx(['faculty name', 'faculty', 'teacher', 'evaluator', 'professor']);
        const courseIdx = findIdx(['course', 'degree', 'program']);

        // Maintenance specific
        const buildingIdx = findIdx(['building block', 'building', 'block']);
        const floorIdx = findIdx(['floor']);
        const roomIdx = findIdx(['room number', 'room']);
        const locationIdx = findIdx(['landmark location', 'location', 'landmark']);

        const itemsToUpload: any[] = [];
        for (let i = 1; i < parsedRows.length; i++) {
          const cols = parsedRows[i];
          if (cols.length >= 3 && cols[0].trim()) {
            const studentId = (studentIdIdx !== -1 && cols[studentIdIdx]) ? cols[studentIdIdx].trim() : (cols[0] || `2024STU${100 + i}`);
            const studentName = (nameIdx !== -1 && cols[nameIdx]) ? cols[nameIdx].trim() : (cols[1] || `Student ${i}`);
            const dept = (deptIdx !== -1 && cols[deptIdx]) ? cols[deptIdx].trim() : (cols[2] || 'Computer Science & Engineering');
            const mobile = (mobileIdx !== -1 && cols[mobileIdx]) ? cols[mobileIdx].trim() : (cols[3] || '+91 98000 00000');
            const category = (categoryIdx !== -1 && cols[categoryIdx]) ? cols[categoryIdx].trim() : (isMaintenance ? 'General Maintenance' : 'Academic Grievance');
            const description = (descIdx !== -1 && cols[descIdx]) ? cols[descIdx].trim() : (cols[cols.length - 1] || 'Bulk imported complaint.');
            const remarks = (remarksIdx !== -1 && cols[remarksIdx]) ? cols[remarksIdx].trim() : 'Imported via CSV Uploader';

            if (isMaintenance) {
              const building = (buildingIdx !== -1 && cols[buildingIdx]) ? cols[buildingIdx].trim() : (cols[4] || 'Main Block');
              const floor = (floorIdx !== -1 && cols[floorIdx]) ? cols[floorIdx].trim() : (cols[5] || '1st Floor');
              const roomNumber = (roomIdx !== -1 && cols[roomIdx]) ? cols[roomIdx].trim() : (cols[6] || 'General');
              const location = (locationIdx !== -1 && cols[locationIdx]) ? cols[locationIdx].trim() : (cols[8] || 'Campus');

              itemsToUpload.push({
                type: 'maintenance',
                title: `${category}: ${building} (${roomNumber})`,
                student_id: studentId,
                student_name: studentName,
                department: dept,
                mobile,
                building,
                floor,
                room_number: roomNumber,
                category,
                location,
                description,
                remarks
              });
            } else {
              const subject = (subjectIdx !== -1 && cols[subjectIdx]) ? cols[subjectIdx].trim() : (cols[4] || 'General Subject');
              const facultyName = (facultyIdx !== -1 && cols[facultyIdx]) ? cols[facultyIdx].trim() : (cols[5] || 'Unassigned');
              const course = (courseIdx !== -1 && cols[courseIdx]) ? cols[courseIdx].trim() : (cols[6] || 'Degree');

              itemsToUpload.push({
                type: 'academic',
                title: `${category}: ${subject}`,
                student_id: studentId,
                student_name: studentName,
                department: dept,
                mobile,
                subject,
                faculty_name: facultyName,
                course,
                category,
                description,
                remarks
              });
            }
          }
        }

        if (itemsToUpload.length > 0) {
          const res = await apiService.createBulkIssues(itemsToUpload);
          await refreshIssuesFromDB();
          const count = res?.count || itemsToUpload.length;
          setImportedCount(count);
          setImportStatus(`Successfully uploaded ${count} grievances from ${file.name} to MySQL database!`);
          addToast('success', 'Bulk Import Complete', `Added ${count} records to Academic Council Queue.`);
        } else {
          setImportStatus('No valid data rows found in CSV.');
          setImportedCount(null);
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 flex min-h-full items-center justify-center">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl my-auto flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Bulk Issue Upload & CSV Batch Intake
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload batch grievance CSV files directly into the Academic Council queue
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

        {/* Content Body */}
        <div className="p-6 space-y-6">

          {/* Quick Template Download Cards */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Step 1: Download Required Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => downloadTemplate('academic')}
                className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-brand-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Academic CSV Template</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Grades, Faculty, Exam formatting</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => downloadTemplate('maintenance')}
                className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Maintenance CSV Template</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Building, Room, Electrical formatting</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
              </button>
            </div>
          </div>

          {/* CSV File Upload Dropzone */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Step 2: Upload CSV Batch File
            </label>
            <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-brand-500 transition-colors bg-slate-50/50 dark:bg-slate-800/30">
              <input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleCSVUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-brand-500 mx-auto mb-2" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Click or Drop Batch CSV File Here to Upload
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports .CSV files matching the academic or maintenance templates
              </p>
            </div>
          </div>

          {/* Import Status Feedback */}
          {importStatus && (
            <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-3 ${
              importedCount !== null 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
            }`}>
              {importedCount !== null ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              )}
              <span>{importStatus}</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-slate-200 dark:border-slate-700 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
