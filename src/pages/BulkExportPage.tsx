import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Upload, FileSpreadsheet, CheckCircle2, BookOpen, Wrench, FileText } from 'lucide-react';
import { parseCSVLines, normalizeDepartmentName } from '../utils/csvParser';
import { apiService } from '../services/api';

export const BulkExportPage: React.FC = () => {
  const { issues, refreshIssuesFromDB, addToast } = useApp();
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

      reader.onload = async (evt) => {
        const text = evt.target?.result as string;
        if (!text) return;

        const parsedRows = parseCSVLines(text);
        if (parsedRows.length <= 1) {
          setImportStatus('CSV file contains no data rows.');
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
            const deptRaw = (deptIdx !== -1 && cols[deptIdx]) ? cols[deptIdx].trim() : (cols[2] || 'Computer Science & Engineering');
            const dept = normalizeDepartmentName(deptRaw);
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
          setImportStatus(`Successfully batch imported ${count} grievances into the database!`);
          addToast('success', 'Bulk Import Successful', `Processed ${count} complaints from ${file.name}`);
        } else {
          setImportStatus('No valid data rows found in CSV.');
        }
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
