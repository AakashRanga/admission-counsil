import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Upload, FileSpreadsheet, CheckCircle2, BookOpen, Wrench, FileText } from 'lucide-react';

export const BulkExportPage: React.FC = () => {
  const { issues, addIssue, addToast } = useApp();
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // CSV Templates Generator
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

  // Bulk Export All Issues into CSV
  const exportAllIssuesCSV = () => {
    const headers = 'Ticket ID,Issue Type,Student ID,Student Name,Department,Mobile,Category,Building/Subject,Status,Submitted At,Description\n';
    const rows = issues.map(i => {
      const category = i.type === 'academic' ? (i.academicCategory || 'Academic') : (i.maintenanceCategory || 'Maintenance');
      const locationOrSubject = i.type === 'academic' ? (i.subject || '') : (i.building || '');
      const cleanDesc = (i.description || '').replace(/,/g, ' ');
      return `${i.id},${i.type},${i.student.id},${i.student.name},${i.student.department},${i.student.mobile},"${category}","${locationOrSubject}",${i.status},"${i.submittedAt}","${cleanDesc}"`;
    }).join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `academic_council_bulk_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Bulk Export Complete', `Exported ${issues.length} records to CSV.`);
  };

  // Handle Drag & Drop File Import Simulation
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        if (!text) return;

        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length <= 1) {
          setImportStatus('CSV file has no data rows.');
          return;
        }

        // Process rows after header
        let importedCount = 0;
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',');
          if (cols.length >= 4) {
            addIssue({
              type: cols[1]?.toLowerCase().includes('maint') ? 'maintenance' : 'academic',
              student: {
                id: cols[0] || `2024STU${100 + i}`,
                name: cols[1] || `Bulk Student ${i}`,
                department: cols[2] || 'Computer Science & Engineering',
                mobile: cols[3] || '+91 98000 00000'
              },
              description: cols[cols.length - 1] || 'Bulk imported grievance complaint.',
              remarks: 'Imported via CSV Bulk Uploader'
            });
            importedCount++;
          }
        }

        setImportStatus(`Successfully imported ${importedCount} grievances into the portal!`);
        addToast('success', 'Bulk Import Successful', `Processed ${importedCount} complaints from ${file.name}`);
      };

      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-5xl mx-auto">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-brand-500" />
            Bulk Issue Exporter & CSV Import Suite
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Download CSV templates tailored by issue type, batch upload complaint sheets, or export datasets for university reports.
          </p>
        </div>
      </div>

      {/* Section 1: Template Downloads based on Issue Type */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Download className="w-4 h-4 text-brand-500" />
          Step 1: Download Issue Type CSV Templates
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select an issue type below to download its official Excel/CSV data entry template formatted with proper columns.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Academic Template Card */}
          <div className="p-5 rounded-2xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/40 dark:bg-blue-950/20 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300 font-bold text-sm">
                <BookOpen className="w-4 h-4 text-brand-500" />
                <span>Academic Grievances CSV Template</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Includes columns for Student ID, Name, Department, Mobile, Subject, Faculty Evaluator, Course, Category & Description.
              </p>
            </div>

            <button
              onClick={() => downloadTemplate('academic')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Academic Template (.CSV)</span>
            </button>
          </div>

          {/* Maintenance Template Card */}
          <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/20 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                <Wrench className="w-4 h-4 text-amber-500" />
                <span>Maintenance Repairs CSV Template</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Includes columns for Student ID, Name, Department, Mobile, Building Block, Floor, Room Number, Category & Landmark Location.
              </p>
            </div>

            <button
              onClick={() => downloadTemplate('maintenance')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Maintenance Template (.CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Bulk CSV Upload Dropzone */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Upload className="w-4 h-4 text-brand-500" />
          Step 2: Upload Completed CSV Batch File
        </h2>

        <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-brand-500 transition-colors">
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleCSVUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Click or Drop Completed CSV File Here to Import
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Supports .CSV batch files generated using official templates above.
          </p>
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
        )}
      </div>

      {/* Section 3: Bulk Export Database */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-500" />
            Step 3: Export All Grievances ({issues.length} Records)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Generate an aggregated CSV file containing all active, investigating, and resolved grievance tickets.
          </p>
        </div>

        <button
          onClick={exportAllIssuesCSV}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg transition-all shrink-0 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export All Issues (.CSV)</span>
        </button>
      </div>

    </div>
  );
};
