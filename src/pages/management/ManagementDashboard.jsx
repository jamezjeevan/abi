import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { managementService } from '../../services/managementService';
import { campusStore } from '../../services/campusStore';
import { DashboardCard } from '../../components/common/DashboardCard';
import { 
  Building2, 
  GraduationCap, 
  Users, 
  Briefcase, 
  PlusCircle, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

export { ManagementFaculty } from './ManagementFaculty';
export { ManagementStudents } from './ManagementStudents';
export { ManagementApplications } from './ManagementApplications';
export { ManagementMessages } from './ManagementMessages';
export { ManagementProfile } from './ManagementProfile';

export const ManagementDashboard = () => {
  const { profile } = useAuth();
  const meta = profile?.meta || {};

  const [stats, setStats] = useState({
    totalFaculty: 0,
    activeFaculty: 0,
    totalStudentsEnrolled: 0,
    placedStudents: 0,
    studentsInProcess: 0,
    placementRate: 0,
    activeCorporateDrives: 0,
    totalApplicationsProcessed: 0
  });

  const [recentFaculty, setRecentFaculty] = useState([]);

  const loadData = async () => {
    const s = await managementService.getManagementStats();
    setStats(s);
    const fList = await managementService.getFacultyList();
    setRecentFaculty(fList.slice(0, 4));
  };

  useEffect(() => {
    loadData();
    const unsub = campusStore.subscribe(loadData);
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" />
              <span>College Management & Dean Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {profile?.full_name || 'Dean Dr. Arthur Vance'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Management ID: <span className="font-mono text-indigo-300 font-semibold">{meta.management_id || 'MGT-001'}</span> • {meta.institution || 'St. Peter Institute of Technology'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/management/faculty"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md shadow-indigo-600/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Faculty</span>
            </Link>
            <Link
              to="/management/messages"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 transition border border-slate-700"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Communicate with Faculty</span>
            </Link>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Faculty"
          value={stats.totalFaculty}
          icon={GraduationCap}
          badge={`${stats.activeFaculty} Active`}
          badgeColor="bg-indigo-50 text-indigo-700"
          iconColor="text-indigo-600 bg-indigo-50 border-indigo-200"
        />
        <DashboardCard
          title="Supervised Students"
          value={stats.totalStudentsEnrolled}
          icon={Users}
          badge="via Mentors"
          badgeColor="bg-blue-50 text-blue-700"
          iconColor="text-blue-600 bg-blue-50 border-blue-200"
        />
        <DashboardCard
          title="Active Campus Drives"
          value={stats.activeCorporateDrives}
          icon={Briefcase}
          badge="Verified Companies"
          badgeColor="bg-amber-50 text-amber-700"
          iconColor="text-amber-600 bg-amber-50 border-amber-200"
        />
        <DashboardCard
          title="Placement Success"
          value={`${stats.placementRate}%`}
          icon={TrendingUp}
          badge={`${stats.placedStudents} Placed`}
          badgeColor="bg-emerald-50 text-emerald-700"
          iconColor="text-emerald-600 bg-emerald-50 border-emerald-200"
        />
      </div>

      {/* Hierarchy Rule Card */}
      <div className="p-4 rounded-2xl bg-indigo-950/60 text-indigo-200 text-xs border border-indigo-900 flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-white">Hierarchical Authority Rule:</span> College Management creates and manages Faculty members. Management does <span className="text-rose-400 font-bold">NOT</span> directly create students. Faculty members provision students and are automatically assigned as their mentors.
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Faculty Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Institutional Faculty Roster</h3>
                  <p className="text-[11px] text-slate-400">Department mentors created by College Management</p>
                </div>
              </div>
              <Link to="/management/faculty" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentFaculty.map((f) => (
                <div key={f.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {f.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{f.name}</div>
                      <div className="text-[11px] text-slate-500">{f.faculty_id} • {f.department}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Mentor
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Faculty: <strong className="text-slate-800">{stats.totalFaculty}</strong></span>
            <Link to="/management/faculty" className="text-xs font-semibold text-indigo-600 hover:underline">
              Manage Faculty Accounts →
            </Link>
          </div>
        </div>

        {/* Student Placement Health Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Student Placement Progress</h3>
                  <p className="text-[11px] text-slate-400">View student recruitment status through faculty relationships</p>
                </div>
              </div>
              <Link to="/management/students" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <span>View Students</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Students in Active Recruitment</div>
                  <div className="text-[11px] text-slate-500">Screened & shortlisted across corporate drives</div>
                </div>
                <div className="text-lg font-extrabold text-indigo-600">{stats.studentsInProcess || 1}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Total Applications Evaluated</div>
                  <div className="text-[11px] text-slate-500">Processed by deterministic checks & AI matcher</div>
                </div>
                <div className="text-lg font-extrabold text-purple-600">{stats.totalApplicationsProcessed}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Enrolled Students: <strong className="text-slate-800">{stats.totalStudentsEnrolled}</strong></span>
            <Link to="/management/applications" className="text-xs font-semibold text-blue-600 hover:underline">
              Inspect Placement Pipeline →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
