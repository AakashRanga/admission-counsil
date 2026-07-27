import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronDown, 
  X, 
  Menu, 
  Upload, 
  Download, 
  BookOpen, 
  Wrench 
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  onOpenBulkUpload?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar, onOpenBulkUpload }) => {
  const { addToast, currentRole } = useApp();

  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const showBulkActions = currentRole !== 'ad_academic' && currentRole !== 'ad_maintenance';

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
    setShowTemplateDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-6 py-2.5 sm:py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 md:hidden hover:bg-slate-200 dark:hover:bg-slate-700"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Right Actions */}
        {showBulkActions && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* CSV Template Download Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
                title="Download CSV Templates"
              >
                <Download className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span className="hidden md:inline">Templates</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showTemplateDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-xl glass-panel shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setShowTemplateDropdown(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CSV Issue Templates</p>
                    <button onClick={() => setShowTemplateDropdown(false)} className="text-slate-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="py-1 space-y-1">
                    <button
                      onClick={() => downloadTemplate('academic')}
                      className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-xs hover:bg-brand-50 dark:hover:bg-brand-950/60 text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-brand-500 shrink-0" />
                      <div>
                        <div className="font-bold text-[11px]">Academic Template (.CSV)</div>
                        <div className="text-[10px] text-slate-400">Course & Grade Issues</div>
                      </div>
                    </button>
                    <button
                      onClick={() => downloadTemplate('maintenance')}
                      className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-xs hover:bg-amber-50 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      <Wrench className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <div className="font-bold text-[11px]">Maintenance Template (.CSV)</div>
                        <div className="text-[10px] text-slate-400">Repair Issues</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bulk Issue Upload Trigger */}
            <button
              onClick={onOpenBulkUpload}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all shrink-0"
              title="Upload CSV Issue Batch"
            >
              <Upload className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Bulk Issue Upload</span>
            </button>

          </div>
        )}

      </div>
    </header>
  );
};
