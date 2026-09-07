import React from 'react';
import { Briefcase, Filter, Search, MapPin, DollarSign, Calendar, Sparkles } from 'lucide-react';

export const StudentJobs = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-950">Campus Recruitment Drives</h1>
          <p className="text-xs text-slate-500">Explore verified company openings filtered for your department and graduation year.</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search by job title, company name, or technology..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Featured Job Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs hover:border-brand-400 transition space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-base">
              NT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Junior Full Stack Engineer</h2>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Eligible (CGPA 8.92 ≥ 7.50)
                </span>
              </div>
              <div className="text-xs text-slate-600 mt-1 font-medium">Nexus Technologies • Artificial Intelligence & Cloud Systems</div>
            </div>
          </div>

          <div className="flex sm:flex-col items-end gap-1">
            <span className="text-xs text-slate-400">Deadline: in 24 days</span>
            <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold shadow-xs">
              Apply with Resume
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Join our platform engineering organization building cloud microservices, reactive user interfaces, and automated backend pipelines. Looking for motivated engineers graduating in 2024.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">React</span>
          <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">Node.js</span>
          <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">PostgreSQL</span>
          <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">TypeScript</span>
        </div>
      </div>
    </div>
  );
};

export const StudentApplications = () => (
  <div className="space-y-6">
    <h1 className="text-xl font-bold text-slate-900">My Job Applications</h1>
    <p className="text-xs text-slate-500">Track real-time status of your submissions, AI match scores, and interview requests.</p>
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="text-xs text-slate-600 font-medium">Showing 2 active submissions. Module 7 will enable live resume-to-job matching submissions.</div>
    </div>
  </div>
);

export const StudentResume = () => (
  <div className="space-y-6">
    <h1 className="text-xl font-bold text-slate-900">Resume & AI ATS Parsing</h1>
    <p className="text-xs text-slate-500">Upload your PDF resume to private Supabase Storage for automatic AI skill extraction.</p>
    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-xs">
      <div className="max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">Upload Verified Resume (PDF)</h3>
        <p className="text-xs text-slate-500 mt-1">Files are validated for PDF format, secure naming, and access control.</p>
      </div>
    </div>
  </div>
);

export const StudentMentor = () => (
  <div className="space-y-6">
    <h1 className="text-xl font-bold text-slate-900">Assigned Faculty Mentor</h1>
    <p className="text-xs text-slate-500">Your mentor faculty guides your career path, reviews placement progress, and verifies applications.</p>
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <h2 className="text-sm font-bold text-slate-900">Prof. Sarah Jenkins</h2>
      <div className="text-xs text-slate-500">Computer Science & Engineering • Faculty ID: FAC-CS-101</div>
    </div>
  </div>
);

export const StudentNotifications = () => (
  <div className="space-y-6">
    <h1 className="text-xl font-bold text-slate-900">Real-time Notifications</h1>
    <p className="text-xs text-slate-500">Recruitment drive alerts, screening results, and mentor messages.</p>
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
        <div className="font-semibold text-slate-800">New Recruitment Opportunity</div>
        <div className="text-slate-600 mt-0.5">Nexus Technologies posted Junior Full Stack Engineer.</div>
      </div>
    </div>
  </div>
);

export const StudentMessages = () => (
  <div className="space-y-6">
    <h1 className="text-xl font-bold text-slate-900">Mentor & Faculty Messages</h1>
    <p className="text-xs text-slate-500">Realtime communication between Student and assigned Faculty Mentor.</p>
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="text-xs text-slate-600">Realtime chat channel active for Alex Rivera ↔ Prof. Sarah Jenkins.</div>
    </div>
  </div>
);

export const StudentProfile = () => (
  <div className="space-y-6">
    <h1 className="text-xl font-bold text-slate-900">Student Profile & Credentials</h1>
    <p className="text-xs text-slate-500">Manage your contact details, academic standing, and account security.</p>
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div><span className="text-slate-400 block font-medium">Full Name</span><span className="font-semibold text-slate-800">Alex Rivera</span></div>
        <div><span className="text-slate-400 block font-medium">Register Number</span><span className="font-semibold text-slate-800 font-mono">REG2024CS088</span></div>
        <div><span className="text-slate-400 block font-medium">Email</span><span className="font-semibold text-slate-800">student@campusconnect.edu</span></div>
        <div><span className="text-slate-400 block font-medium">Department</span><span className="font-semibold text-slate-800">Computer Science & Engineering</span></div>
        <div><span className="text-slate-400 block font-medium">Year</span><span className="font-semibold text-slate-800">4th Year (Class of 2024)</span></div>
        <div><span className="text-slate-400 block font-medium">CGPA</span><span className="font-semibold text-slate-800">8.92 / 10.0</span></div>
      </div>
    </div>
  </div>
);
