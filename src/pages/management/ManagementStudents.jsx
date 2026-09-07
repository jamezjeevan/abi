import React, { useState, useEffect } from 'react';
import { managementService } from '../../services/managementService';
import { campusStore } from '../../services/campusStore';
import { DataTable } from '../../components/common/DataTable';
import { 
  Users, 
  GraduationCap, 
  ShieldAlert, 
  Sparkles, 
  BookOpen, 
  Briefcase, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export const ManagementStudents = () => {
  const [students, setStudents] = useState([]);

  const loadData = async () => {
    const list = await managementService.getStudentsThroughFaculty();
    setStudents(list || []);
  };

  useEffect(() => {
    loadData();
    const unsub = campusStore.subscribe(() => {
      loadData();
    });
    return () => unsub();
  }, []);

  const columns = [
    {
      header: 'Student',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-xs">
            {row.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900">{row.name}</div>
            <div className="text-[11px] text-slate-500 font-mono">
              {row.register_number} • Year {row.year}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Department & CGPA',
      accessor: 'department',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="text-slate-800 font-medium text-xs flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>{row.department}</span>
          </div>
          <div className="text-[11px] text-slate-500">
            CGPA: <strong className="text-slate-800">{row.cgpa}</strong>
          </div>
        </div>
      )
    },
    {
      header: 'Assigned Faculty Mentor',
      accessor: 'faculty_name',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-xs text-indigo-950">{row.faculty_name || 'Prof. Sarah Jenkins'}</div>
            <div className="text-[10px] text-slate-400">Direct Mentorship Tier</div>
          </div>
        </div>
      )
    },
    {
      header: 'Placement Status',
      accessor: 'placement_status',
      render: (row) => {
        const isPlaced = row.placement_status === 'Placed';
        const isInterviewing = row.placement_status === 'In Interview / Shortlisted';
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
            isPlaced 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : isInterviewing
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaced ? 'bg-emerald-500' : isInterviewing ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
            {row.placement_status}
          </span>
        );
      }
    },
    {
      header: 'Applications',
      accessor: 'total_applications',
      className: 'text-center',
      cellClassName: 'text-center font-bold text-slate-700',
      render: (row) => row.total_applications || 0
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Institutional Cohort Supervision</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Body via Faculty Mentorship
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Management oversees student academic and placement health through their assigned faculty mentors.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Tracked</div>
          <div className="text-2xl font-extrabold text-slate-900">{students.length} Students</div>
        </div>
      </div>

      {/* Strict Hierarchy Constraint Alert */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold text-amber-950">Strict Institutional Protocol:</strong> College Management does <span className="underline decoration-amber-500 font-bold">NOT</span> directly create student accounts. Students are provisioned and assigned mentors by <span className="font-semibold text-amber-950">Faculty Members</span>. Management oversees batch performance, placement trends, and faculty mentorship allocations.
        </div>
      </div>

      {/* Students Data Table */}
      <DataTable
        columns={columns}
        data={students}
        searchPlaceholder="Search students by name, register number, department, or faculty..."
      />
    </div>
  );
};
