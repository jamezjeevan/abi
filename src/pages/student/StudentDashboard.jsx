import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { campusStore } from '../../services/campusStore';
import { DashboardCard } from '../../components/common/DashboardCard';
import { 
  Briefcase, 
  GraduationCap, 
  Send, 
  Award, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  UserCheck, 
  FileText,
  Bell,
  MessageSquare,
  TrendingUp,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export { StudentJobs } from './StudentJobs';
export { StudentApplications } from './StudentApplications';
export { StudentResume } from './StudentResume';
export { StudentMentor } from './StudentMentor';
export { StudentNotifications } from './StudentNotifications';
export { StudentMessages } from './StudentMessages';
export { StudentProfile } from './StudentProfile';

export const StudentDashboard = () => {
  const { profile, user } = useAuth();
  const [student, setStudent] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const loadData = async () => {
    const stu = await studentService.getProfile(user?.id || '44444444-4444-4444-4444-444444444444');
    setStudent(stu);

    const jobList = await studentService.getAvailableJobs();
    setJobs(jobList || []);

    if (stu?.id) {
      const appList = await studentService.getMyApplications(stu.id);
      setApplications(appList || []);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = campusStore.subscribe(loadData);
    return () => unsub();
  }, [user]);

  const mentorName = student?.mentor_name || 'Prof. Sarah Jenkins';
  const myApplicationsCount = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'shortlisted' || a.status === 'interview').length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-300 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Campus Placement Season 2024–2025</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {student?.name || profile?.full_name || 'Alex Rivera'}!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Register No: <span className="font-mono text-brand-300 font-bold">{student?.register_number || 'REG2024CS088'}</span> • {student?.department || 'Computer Science & Engineering'}
            </p>
          </div>

          {/* Prominent My Mentor Display */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col gap-2 min-w-[260px] shadow-sm">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Academic Mentorship</span>
            </div>
            <div className="text-sm font-extrabold text-white">
              My Mentor: {mentorName}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <span className="text-slate-300">CGPA: <strong className="text-white">{student?.cgpa || '8.92'}</strong></span>
              <Link to="/student/messages" className="text-brand-300 hover:text-white font-semibold flex items-center gap-1">
                <span>Chat</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Cumulative CGPA"
          value={student?.cgpa || '8.92'}
          icon={Award}
          badge="Academic Standing"
          badgeColor="bg-emerald-50 text-emerald-700"
          iconColor="text-emerald-600 bg-emerald-50 border-emerald-200"
        />
        <DashboardCard
          title="My Applications"
          value={myApplicationsCount}
          icon={Send}
          badge="AI Screened"
          badgeColor="bg-brand-50 text-brand-700"
          iconColor="text-brand-600 bg-brand-50 border-brand-200"
        />
        <DashboardCard
          title="Shortlisted Drives"
          value={shortlistedCount}
          icon={CheckCircle2}
          badge="Interview Stage"
          badgeColor="bg-purple-50 text-purple-700"
          iconColor="text-purple-600 bg-purple-50 border-purple-200"
        />
        <DashboardCard
          title="Active Drives"
          value={jobs.length}
          icon={Briefcase}
          badge="Verified Openings"
          badgeColor="bg-amber-50 text-amber-700"
          iconColor="text-amber-600 bg-amber-50 border-amber-200"
        />
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended Jobs (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-200">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Recommended Recruitment Drives</h2>
                  <p className="text-[11px] text-slate-400">Filtered for your department with AI matching scores</p>
                </div>
              </div>
              <Link to="/student/jobs" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                <span>View All Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {jobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-xl border border-slate-200/80 hover:border-brand-300 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{job.job_title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        CGPA ≥ {job.minimum_cgpa}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      <strong className="text-slate-800">{job.company_name}</strong> • {job.location} • {job.salary}
                    </div>
                  </div>

                  <Link
                    to="/student/jobs"
                    className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition shadow-xs self-start sm:self-auto"
                  >
                    View & Apply
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Available Drives: <strong className="text-slate-800">{jobs.length}</strong></span>
            <Link to="/student/jobs" className="text-xs font-semibold text-brand-600 hover:underline">
              Explore All Openings →
            </Link>
          </div>
        </div>

        {/* Right Sidebar: My Applications & Mentor Card */}
        <div className="space-y-6">
          {/* Mentor Highlight Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Faculty Mentor</span>
                <h3 className="text-xs font-extrabold text-slate-900">{mentorName}</h3>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div>Department of Computer Science</div>
              <div className="text-[11px] text-slate-400 font-mono">faculty@campusconnect.edu</div>
              <div className="pt-2">
                <Link
                  to="/student/messages"
                  className="w-full text-center py-2 px-3 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition block shadow-xs"
                >
                  Send Message
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Applications Status */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">My Application Tracker</h3>
              <Link to="/student/applications" className="text-xs text-brand-600 hover:underline font-semibold">All</Link>
            </div>

            <div className="space-y-2.5">
              {applications.length > 0 ? (
                applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="truncate max-w-[140px]">{app.job_title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                        {app.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                      <span>{app.company_name}</span>
                      <span className="font-bold text-emerald-600">AI: {app.ai_match_score || 92}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400 text-xs">
                  No active applications. Browse jobs and apply with your resume!
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
