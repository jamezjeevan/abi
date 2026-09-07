import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { campusStore } from '../../services/campusStore';
import { DashboardCard } from '../../components/common/DashboardCard';
import { 
  Building2, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  PlusCircle, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Layers,
  Building
} from 'lucide-react';
import { Link } from 'react-router-dom';

export { AdminManagement } from './AdminManagement';
export { AdminCompanies } from './AdminCompanies';
export { AdminProfile } from './AdminProfile';

export const AdminDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalManagement: 0,
    totalCompanies: 0,
    totalStudents: 0,
    totalFaculty: 0,
    activeRecruitments: 0,
    totalApplications: 0
  });

  const [recentManagement, setRecentManagement] = useState([]);
  const [recentCompanies, setRecentCompanies] = useState([]);

  const loadDashboard = async () => {
    const s = await adminService.getStats();
    setStats(s);
    const mList = await adminService.getManagementList();
    setRecentManagement(mList.slice(0, 4));
    const cList = await adminService.getCompanyList();
    setRecentCompanies(cList.slice(0, 4));
  };

  useEffect(() => {
    loadDashboard();
    const unsubscribe = campusStore.subscribe(() => {
      loadDashboard();
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      {/* Admin Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-rose-950/80 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Campus Governance & Platform Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {profile?.full_name || 'System Administrator'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Global Platform Oversight • Authorizing Institutional Management Authorities and Verified Corporate Recruitment Partners.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/admin/management"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md shadow-indigo-600/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Management</span>
            </Link>
            <Link
              to="/admin/companies"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md shadow-amber-600/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Company</span>
            </Link>
          </div>
        </div>

        {/* Abstract design elements */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 6 Core Required KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Metrics Overview</h2>
          <span className="text-xs text-slate-400">Synchronized via Supabase</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <DashboardCard
            title="Management"
            value={stats.totalManagement}
            icon={Building2}
            badge="Institutional"
            iconColor="text-indigo-600 bg-indigo-50 border-indigo-200"
          />
          <DashboardCard
            title="Companies"
            value={stats.totalCompanies}
            icon={Briefcase}
            badge="Recruiters"
            iconColor="text-amber-600 bg-amber-50 border-amber-200"
          />
          <DashboardCard
            title="Faculty"
            value={stats.totalFaculty}
            icon={GraduationCap}
            badge="Mentors"
            iconColor="text-emerald-600 bg-emerald-50 border-emerald-200"
          />
          <DashboardCard
            title="Students"
            value={stats.totalStudents}
            icon={Sparkles}
            badge="Registered"
            iconColor="text-blue-600 bg-blue-50 border-blue-200"
          />
          <DashboardCard
            title="Active Drives"
            value={stats.activeRecruitments}
            icon={TrendingUp}
            badge="Live Jobs"
            iconColor="text-purple-600 bg-purple-50 border-purple-200"
          />
          <DashboardCard
            title="Applications"
            value={stats.totalApplications}
            icon={FileText}
            badge="Screened"
            iconColor="text-rose-600 bg-rose-50 border-rose-200"
          />
        </div>
      </div>

      {/* Architecture Separation Notice */}
      <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs border border-slate-800 flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-white">Hierarchical Isolation Rule:</span> Admin provisions College Management and Corporate Company accounts. College Management creates and oversees Faculty, and Faculty provisions and mentors individual Students. Admin does <span className="text-rose-400 font-bold">NOT</span> manage individual students directly.
        </div>
      </div>

      {/* Recent Entities Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* College Management Snapshot */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">College Management Authorities</h3>
                  <p className="text-[11px] text-slate-400">Deans and Academic Officers with faculty creation rights</p>
                </div>
              </div>
              <Link to="/admin/management" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentManagement.map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/40 border border-slate-200/80 transition flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100/70 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{m.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {m.management_id} • {m.institution || 'SPIT'}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    m.is_active !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {m.is_active !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Registered: <strong className="text-slate-800">{stats.totalManagement}</strong></span>
            <Link to="/admin/management" className="text-xs font-semibold text-indigo-600 hover:underline">
              Manage Institutional Accounts →
            </Link>
          </div>
        </div>

        {/* Corporate Recruiter Partners Snapshot */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Corporate Recruiter Partners</h3>
                  <p className="text-[11px] text-slate-400">Companies authorized to publish campus job drives</p>
                </div>
              </div>
              <Link to="/admin/companies" className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentCompanies.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/40 border border-slate-200/80 transition flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-700 font-bold text-xs flex items-center justify-center">
                      {c.company_name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{c.company_name}</div>
                      <div className="text-[11px] text-slate-500">
                        {c.industry || 'Technology'} • {c.location || 'Hybrid'}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    c.is_active !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {c.is_active !== false ? 'Verified' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Verified: <strong className="text-slate-800">{stats.totalCompanies}</strong></span>
            <Link to="/admin/companies" className="text-xs font-semibold text-amber-600 hover:underline">
              Manage Corporate Accounts →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
