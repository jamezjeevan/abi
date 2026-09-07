import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { facultyService } from '../../services/facultyService';
import { campusStore } from '../../services/campusStore';
import { DashboardCard } from '../../components/common/DashboardCard';
import { 
  Users, 
  Send, 
  CheckCircle2, 
  Award, 
  UserPlus, 
  ArrowRight,
  Sparkles,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export { FacultyStudents } from './FacultyStudents';
export { FacultyApplications } from './FacultyApplications';
export { FacultyNotifications } from './FacultyNotifications';
export { FacultyMessages } from './FacultyMessages';
export { FacultyProfile } from './FacultyProfile';

export const FacultyDashboard = () => {
  const { profile, user } = useAuth();
  const meta = profile?.meta || {};

  const [stats, setStats] = useState({
    totalMentees: 0,
    placedMentees: 0,
    interviewingMentees: 0,
    totalApplications: 0,
    averageCgpa: '0.00'
  });

  const [mentees, setMentees] = useState([]);

  const loadData = async () => {
    const s = await facultyService.getFacultyStats(user?.id || '33333333-3333-3333-3333-333333333333');
    setStats(s);
    const mList = await facultyService.getMyStudents(user?.id || '33333333-3333-3333-3333-333333333333');
    setMentees(mList.slice(0, 5));
  };

  useEffect(() => {
    loadData();
    const unsub = campusStore.subscribe(loadData);
    return () => unsub();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Faculty Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              <Users className="w-4 h-4" />
              <span>Academic Mentorship & Placement Oversight</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {profile?.full_name || 'Prof. Sarah Jenkins'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Faculty ID: <span className="font-mono text-emerald-300 font-semibold">{meta.faculty_id || 'FAC-CS-101'}</span> • Department of {meta.department || 'Computer Science & Engineering'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/faculty/students"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md shadow-emerald-600/30"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Mentee</span>
            </Link>
            <Link
              to="/faculty/messages"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 transition border border-slate-700"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with Mentees</span>
            </Link>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Assigned Mentees"
          value={stats.totalMentees}
          icon={Users}
          badge="Direct Mentorship"
          badgeColor="bg-emerald-50 text-emerald-700"
          iconColor="text-emerald-600 bg-emerald-50 border-emerald-200"
        />
        <DashboardCard
          title="Applications Sent"
          value={stats.totalApplications}
          icon={Send}
          badge="AI Screened"
          badgeColor="bg-blue-50 text-blue-700"
          iconColor="text-blue-600 bg-blue-50 border-blue-200"
        />
        <DashboardCard
          title="In Interview / Shortlist"
          value={stats.interviewingMentees}
          icon={CheckCircle2}
          badge="Corporate Screening"
          badgeColor="bg-purple-50 text-purple-700"
          iconColor="text-purple-600 bg-purple-50 border-purple-200"
        />
        <DashboardCard
          title="Average CGPA"
          value={stats.averageCgpa}
          icon={Sparkles}
          badge="Cohort Metric"
          badgeColor="bg-amber-50 text-amber-700"
          iconColor="text-amber-600 bg-amber-50 border-amber-200"
        />
      </div>

      {/* Auto-Mentor Notice */}
      <div className="p-4 rounded-2xl bg-emerald-950/60 text-emerald-200 text-xs border border-emerald-900 flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-white">Mentorship Hierarchy Linkage:</span> Enrolling a student automatically stores your faculty ID as their <code className="font-mono text-emerald-300">mentor_id</code>. Your mentee will see "My Mentor: {profile?.full_name || 'Prof. Sarah Jenkins'}" on their top dashboard bar and can message you directly.
        </div>
      </div>

      {/* Mentee List Snapshot */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Your Mentee Cohort</h3>
              <p className="text-[11px] text-slate-400">Students assigned to your direct academic & recruitment mentorship</p>
            </div>
          </div>
          <Link to="/faculty/students" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            <span>Manage All Mentees</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {mentees.map((stu) => (
            <div key={stu.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  {stu.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">{stu.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {stu.register_number} • CGPA {stu.cgpa} • {stu.department}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  stu.placement_status === 'Placed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : stu.placement_status === 'In Interview'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {stu.placement_status || 'Registered'}
                </span>
                <Link
                  to="/faculty/messages"
                  className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-[11px] font-semibold flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Chat</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
