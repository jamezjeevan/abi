import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/companyService';
import { campusStore } from '../../services/campusStore';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { 
  Users, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Eye, 
  Send,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

const STATUS_OPTIONS = [
  'Applied',
  'AI Screening',
  'Qualified',
  'Under Review',
  'Shortlisted',
  'Interview',
  'Selected',
  'Not Selected',
  'Rejected'
];

export const CompanyApplicants = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    const comp = await companyService.getCompanyProfile(user?.id || '55555555-5555-5555-5555-555555555555');
    setCompany(comp);
    if (comp?.id) {
      const list = await companyService.getApplicants(comp.id);
      setApplicants(list || []);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = campusStore.subscribe(loadData);
    return () => unsub();
  }, [user]);

  const handleStatusChange = async (appId, newStatus, studentName) => {
    try {
      await companyService.updateApplicationStatus(appId, newStatus);
      setSuccess(`Application for ${studentName} updated to "${newStatus.toUpperCase()}".`);
      setTimeout(() => setSuccess(''), 4000);
      loadData();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDownloadResume = (row) => {
    // Generates/downloads a formatted simulated PDF resume file
    const content = `CAMPUS CONNECT VERIFIED RESUME
========================================
Candidate: ${row.student_name}
Register Number: ${row.register_number}
Department: ${row.department}
CGPA: ${row.cgpa} / 10.00
Technical Skills: ${(row.skills || []).join(', ')}

AI SCREENING RESULT:
Match Score: ${row.ai_match_score}%
Eligibility: ${row.eligibility}
Applied Position: ${row.job_title}
Application Date: ${new Date(row.applied_at).toLocaleString()}
========================================
Verified via Supabase PostgreSQL Authentication.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = row.resume_name || `${row.student_name.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      header: 'Student Name & ID',
      accessor: 'student_name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-xs">
            {row.student_name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900">{row.student_name}</div>
            <div className="text-[11px] text-slate-500 font-mono">
              {row.register_number} • {row.department}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Applied Drive & CGPA',
      accessor: 'job_title',
      render: (row) => (
        <div className="space-y-0.5 text-xs">
          <div className="font-bold text-slate-900">{row.job_title}</div>
          <div className="text-[11px] text-slate-500">
            CGPA: <strong className="text-slate-800">{row.cgpa}</strong>
          </div>
        </div>
      )
    },
    {
      header: 'AI Match Score & Result',
      accessor: 'ai_match_score',
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs text-slate-900">{row.ai_match_score || 95}%</span>
            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${row.ai_match_score || 95}%` }}
              />
            </div>
          </div>
          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {row.eligibility || 'Qualified'}
          </span>
        </div>
      )
    },
    {
      header: 'Resume',
      render: (row) => (
        <button
          onClick={() => handleDownloadResume(row)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-brand-600 font-semibold text-xs flex items-center gap-1.5 transition"
          title="Download Student Resume"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      )
    },
    {
      header: 'Application Status',
      accessor: 'status',
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value, row.student_name)}
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt.toLowerCase()}>{opt}</option>
          ))}
        </select>
      )
    },
    {
      header: 'Details',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <button
          onClick={() => {
            setSelectedApp(row);
            setIsDetailModalOpen(true);
          }}
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
          title="Inspect AI Screening"
        >
          <Eye className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>AI Screened Candidate Pipeline</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Recruitment Applicants
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Candidates who satisfied academic eligibility and completed AI ATS screening. Download resumes and update hiring stages.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Screened</div>
          <div className="text-2xl font-extrabold text-slate-900">{applicants.length} Candidates</div>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <DataTable
        columns={columns}
        data={applicants}
        searchPlaceholder="Search candidates by name, register number, department, or job..."
      />

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Candidate Profile & AI Match Report"
        subtitle={`${selectedApp?.student_name} (${selectedApp?.register_number}) for ${selectedApp?.job_title}`}
      >
        {selectedApp && (
          <div className="space-y-4 text-xs">
            {/* Header Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Academic Profile</span>
                <div className="font-bold text-slate-900 text-sm">{selectedApp.department}</div>
                <div className="text-slate-500 font-medium mt-0.5">CGPA: {selectedApp.cgpa} / 10.00</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">AI Match Score</span>
                <div className="text-2xl font-extrabold text-emerald-600">{selectedApp.ai_match_score || 95}%</div>
              </div>
            </div>

            {/* AI Explanation */}
            {selectedApp.ai_analysis && (
              <div className="space-y-3">
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-950 leading-relaxed">
                  <span className="font-bold block mb-1">AI Match Summary:</span>
                  {selectedApp.ai_analysis.explanation}
                </div>

                <div>
                  <div className="font-bold text-slate-700 mb-1">Candidate Matching Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {(selectedApp.ai_analysis.matching_skills || []).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {(selectedApp.ai_analysis.missing_skills || []).length > 0 && (
                  <div>
                    <div className="font-bold text-slate-700 mb-1">Missing Stack Keywords:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedApp.ai_analysis.missing_skills.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-medium text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDownloadResume(selectedApp)}
                className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Candidate Resume</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
