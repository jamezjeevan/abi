import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/companyService';
import { campusStore } from '../../services/campusStore';
import { DashboardCard } from '../../components/common/DashboardCard';
import { 
  Briefcase, 
  Users, 
  CheckCircle2, 
  Award, 
  PlusCircle, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

export { CompanyJobs } from './CompanyJobs';
export { CompanyApplicants } from './CompanyApplicants';
export { CompanyNotifications } from './CompanyNotifications';
export { CompanyProfile } from './CompanyProfile';

export const CompanyDashboard = () => {
  const { profile, user } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);

  const loadData = async () => {
    const comp = await companyService.getCompanyProfile(user?.id || '55555555-5555-5555-5555-555555555555');
    setCompany(comp);

    if (comp?.id) {
      const jList = await companyService.getMyJobs(comp.id);
      setJobs(jList || []);

      const aList = await companyService.getApplicants(comp.id);
      setApplicants(aList || []);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = campusStore.subscribe(loadData);
    return () => unsub();
  }, [user]);

  const activeJobsCount = jobs.filter(j => j.status === 'published').length;
  const totalApplicantsCount = applicants.length;
  const shortlistedCount = applicants.filter(a => a.status === 'shortlisted' || a.status === 'interview').length;
  const selectedCount = applicants.filter(a => a.status === 'selected' || a.status === 'accepted').length;

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-amber-950/70 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Briefcase className="w-4 h-4" />
              <span>Corporate Recruitment & Talent Acquisition</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {company?.company_name || profile?.full_name || 'Nexus Technologies'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {company?.industry || 'Artificial Intelligence & Cloud Systems'} • {company?.location || 'San Francisco, CA'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/company/jobs"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md shadow-amber-600/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Recruitment</span>
            </Link>
            <Link
              to="/company/applicants"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 transition border border-slate-700"
            >
              <Users className="w-4 h-4" />
              <span>Review Candidates</span>
            </Link>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Active Drives"
          value={activeJobsCount}
          icon={Briefcase}
          badge="Live Postings"
          badgeColor="bg-amber-50 text-amber-700"
          iconColor="text-amber-600 bg-amber-50 border-amber-200"
        />
        <DashboardCard
          title="Screened Applicants"
          value={totalApplicantsCount}
          icon={Users}
          badge="AI Evaluated"
          badgeColor="bg-blue-50 text-blue-700"
          iconColor="text-blue-600 bg-blue-50 border-blue-200"
        />
        <DashboardCard
          title="In Interview / Shortlist"
          value={shortlistedCount}
          icon={CheckCircle2}
          badge="Next Round"
          badgeColor="bg-purple-50 text-purple-700"
          iconColor="text-purple-600 bg-purple-50 border-purple-200"
        />
        <DashboardCard
          title="Offers Extended"
          value={selectedCount}
          icon={Award}
          badge="Placements"
          badgeColor="bg-emerald-50 text-emerald-700"
          iconColor="text-emerald-600 bg-emerald-50 border-emerald-200"
        />
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Drives Snapshot */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Your Active Recruitment Drives</h3>
                  <p className="text-[11px] text-slate-400">Live positions displayed to eligible students</p>
                </div>
              </div>
              <Link to="/company/jobs" className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                <span>All Drives</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {jobs.slice(0, 3).map((job) => (
                <div key={job.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{job.job_title}</h4>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Min CGPA: {job.minimum_cgpa} • {job.location}
                    </div>
                  </div>
                  <Link
                    to="/company/applicants"
                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white transition"
                  >
                    Applicants
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Published Drives: <strong className="text-slate-800">{activeJobsCount}</strong></span>
            <Link to="/company/jobs" className="text-xs font-semibold text-amber-600 hover:underline">
              Create New Posting →
            </Link>
          </div>
        </div>

        {/* Recent Applicants Snapshot */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent AI-Screened Candidates</h3>
                  <p className="text-[11px] text-slate-400">Incoming applications with match scores</p>
                </div>
              </div>
              <Link to="/company/applicants" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {applicants.length > 0 ? (
                applicants.slice(0, 3).map((app) => (
                  <div key={app.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{app.student_name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {app.register_number} • {app.job_title}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-xs text-emerald-600 block">AI {app.ai_match_score || 95}%</span>
                      <span className="text-[10px] font-bold text-purple-700 uppercase">{app.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400 text-xs">
                  No applicants received yet for your active drives.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Candidates: <strong className="text-slate-800">{totalApplicantsCount}</strong></span>
            <Link to="/company/applicants" className="text-xs font-semibold text-blue-600 hover:underline">
              Inspect Screening Scores →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
