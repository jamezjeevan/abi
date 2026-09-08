import React from 'react';
import { Briefcase, Filter, Search, MapPin, DollarSign, Calendar, Sparkles } from 'lucide-react';

export { StudentJobs } from './StudentJobs';

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
