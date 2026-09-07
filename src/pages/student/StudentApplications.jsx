import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { campusStore } from '../../services/campusStore';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { 
  Send, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  Eye, 
  FileText,
  AlertTriangle
} from 'lucide-react';

export const StudentApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const loadData = async () => {
    const stu = await studentService.getProfile(user?.id || '44444444-4444-4444-4444-444444444444');
    if (stu?.id) {
      const apps = await studentService.getMyApplications(stu.id);
      setApplications(apps || []);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = campusStore.subscribe(loadData);
    return () => unsub();
  }, [user]);

  const handleOpenDetail = (app) => {
    setSelectedApp(app);
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'selected' || s === 'accepted') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (s === 'shortlisted' || s === 'interview') {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    if (s === 'rejected' || s === 'not selected') {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (s === 'under review') {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  const columns = [
    {
      header: 'Job Title & Company',
      accessor: 'job_title',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-50 to-indigo-50 border border-brand-200 text-brand-700 font-bold flex items-center justify-center text-xs">
            {row.company_name?.charAt(0) || 'C'}
          </div>
          <div>
            <div className="font-bold text-slate-900">{row.job_title}</div>
            <div className="text-[11px] text-slate-500 font-medium">{row.company_name}</div>
          </div>
        </div>
      )
    },
    {
      header: 'AI Match Score',
      accessor: 'ai_match_score',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs text-slate-800">{row.ai_match_score || 90}%</span>
          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${row.ai_match_score || 90}%` }}
            />
          </div>
        </div>
      )
    },
    {
      header: 'Screening Result',
      accessor: 'eligibility',
      render: (row) => (
        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {row.eligibility || 'Qualified'}
        </span>
      )
    },
    {
      header: 'Application Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusBadge(row.status)}`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Date Applied',
      accessor: 'applied_at',
      render: (row) => (
        <span className="text-slate-500 text-xs">
          {new Date(row.applied_at).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Action',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <button
          onClick={() => handleOpenDetail(row)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs inline-flex items-center gap-1 transition"
        >
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>Inspect</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <Send className="w-4 h-4" />
            <span>Application Tracking & Placement Status</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            My Job Applications
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Real-time status progression from AI Screening to Interview and Final Placement Selection.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Applications</div>
          <div className="text-2xl font-extrabold text-slate-900">{applications.length} Submissions</div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={applications}
        searchPlaceholder="Search submitted applications by title or company..."
      />

      {/* Application Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Application Screening Analysis"
        subtitle={`${selectedApp?.job_title} at ${selectedApp?.company_name}`}
      >
        {selectedApp && (
          <div className="space-y-4 text-xs">
            {/* Status Callout */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Recruitment Stage</span>
                <span className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
                  {selectedApp.status}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">AI Match Score</span>
                <span className="text-base font-extrabold text-emerald-600">
                  {selectedApp.ai_match_score || 95}%
                </span>
              </div>
            </div>

            {/* AI Summary */}
            {selectedApp.ai_analysis && (
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-indigo-950 leading-relaxed">
                  <span className="font-bold block mb-1">AI Screening Report:</span>
                  {selectedApp.ai_analysis.explanation}
                </div>

                <div>
                  <div className="font-bold text-slate-700 mb-1">Matched Skills:</div>
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
                    <div className="font-bold text-slate-700 mb-1">Missing Recommended Skills:</div>
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

            {/* Application Meta */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-500">
              <span>Applied on: {new Date(selectedApp.applied_at).toLocaleString()}</span>
              <span>Resume attached: {selectedApp.resume_name || 'Resume.pdf'}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
