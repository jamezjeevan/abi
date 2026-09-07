import React, { useState, useEffect } from 'react';
import { campusStore } from '../../services/campusStore';
import { DataTable } from '../../components/common/DataTable';
import { Briefcase, Building2, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const ManagementApplications = () => {
  const [applications, setApplications] = useState([]);

  const loadData = () => {
    const store = campusStore.getStore();
    setApplications(store.applications || []);
  };

  useEffect(() => {
    loadData();
    const unsub = campusStore.subscribe(loadData);
    return () => unsub();
  }, []);

  const columns = [
    {
      header: 'Applicant',
      accessor: 'student_name',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.student_name}</div>
          <div className="text-[11px] text-slate-500 font-mono">{row.register_number}</div>
        </div>
      )
    },
    {
      header: 'Recruitment Drive',
      accessor: 'job_title',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.job_title}</div>
          <div className="text-[11px] text-slate-500">{row.company_name}</div>
        </div>
      )
    },
    {
      header: 'AI Match Score',
      accessor: 'ai_match_score',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-10 text-xs font-bold text-slate-800">{row.ai_match_score || 85}%</div>
          <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                (row.ai_match_score || 85) >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${row.ai_match_score || 85}%` }}
            />
          </div>
        </div>
      )
    },
    {
      header: 'Screening Result',
      accessor: 'eligibility',
      render: (row) => (
        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          {row.eligibility || 'Qualified'}
        </span>
      )
    },
    {
      header: 'Current Status',
      accessor: 'status',
      render: (row) => (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
          <Briefcase className="w-4 h-4" />
          <span>Campus Placement Pipeline</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Institutional Placement Applications
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Real-time feed of students applying to corporate drives and their AI screening outcomes.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={applications}
        searchPlaceholder="Search placement records by student, company, or job..."
      />
    </div>
  );
};
