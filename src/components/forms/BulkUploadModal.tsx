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

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose }) => {
  const { addIssue, addToast } = useApp();
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

      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        if (!text) return;

        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length <= 1) {
          setImportStatus('CSV file contains no data rows.');
          setImportedCount(null);
          return;
        }

        let count = 0;
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',');
          if (cols.length >= 4) {
            const isMaint = cols[1]?.toLowerCase().includes('maint') || lines[0].toLowerCase().includes('building');
            addIssue({
              type: isMaint ? 'maintenance' : 'academic',
              title: isMaint 
                ? `${cols[7] || 'Maintenance Issue'} - ${cols[4] || 'Campus'}`
                : `${cols[7] || 'Academic Grievance'}: ${cols[4] || 'Course Work'}`,
              student: {
                id: cols[0] || `2024STU${100 + i}`,
                name: cols[1] || `Bulk Student ${i}`,
                department: cols[2] || 'Computer Science & Engineering',
                mobile: cols[3] || '+91 98000 00000'
              },
              description: cols[cols.length - 1] || cols[8] || 'Bulk imported grievance record.',
              remarks: 'Imported via Common Header Bulk Uploader'
            });
            count++;
          }
        }

        setImportedCount(count);
        setImportStatus(`Successfully batch processed ${count} grievances from ${file.name}!`);
        addToast('success', 'Bulk Import Complete', `Added ${count} records to Academic Council Queue.`);
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
