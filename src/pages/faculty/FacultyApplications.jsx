import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { facultyService } from '../../services/facultyService';
import { campusStore } from '../../services/campusStore';
import { DataTable } from '../../components/common/DataTable';
import { Briefcase, Send, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const FacultyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);

  const loadData = async () => {
    const list = await facultyService.getMenteeApplications(user?.id || '33333333-3333-3333-3333-333333333333');
    setApplications(list || []);
  };

  useEffect(() => {
    loadData();
    const unsub = campusStore.subscribe(loadData);
    return () => unsub();
  }, [user]);

  const columns = [
    {
      header: 'Mentee Student',
      accessor: 'student_name',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.student_name}</div>
          <div className="text-[11px] text-slate-500 font-mono">{row.register_number}</div>
        </div>
      )
    },
    {
      header: 'Job & Company',
      accessor: 'job_title',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.job_title}</div>
          <div className="text-[11px] text-slate-500">{row.company_name}</div>
        </div>
      )
    },
    {
      header: 'AI Match Evaluation',
      accessor: 'ai_match_score',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs text-slate-800">{row.ai_match_score || 85}%</span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {row.eligibility || 'Qualified'}
          </span>
        </div>
      )
    },
    {
      header: 'Recruiter Status',
      accessor: 'status',
      render: (row) => (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
          {row.status}
        </span>
      )
    },
    {
      header: 'Applied Date',
      accessor: 'applied_at',
      render: (row) => (
        <span className="text-slate-500 text-xs">
          {new Date(row.applied_at).toLocaleDateString()}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
          <Send className="w-4 h-4" />
          <span>Mentee Placement Pipeline</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Mentee Applications & Placement Status
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Track job applications submitted by your mentored students and their progression through company interview stages.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={applications}
        searchPlaceholder="Search mentee applications by student, company, or status..."
      />
    </div>
  );
};
