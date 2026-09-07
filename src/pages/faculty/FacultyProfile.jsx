import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, BookOpen, Mail, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const FacultyProfile = () => {
  const { profile } = useAuth();
  const meta = profile?.meta || {};

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold flex items-center justify-center text-2xl shadow-xs">
            {profile?.full_name?.charAt(0) || 'F'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{profile?.full_name || 'Prof. Sarah Jenkins'}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase">
                Faculty Mentor
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              Department of {meta.department || 'Computer Science & Engineering'} • Faculty ID: <span className="font-mono text-emerald-700 font-bold">{meta.faculty_id || 'FAC-CS-101'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Academic Credentials</span>
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Faculty Identifier</span>
              <span className="font-semibold text-slate-800 font-mono text-sm">{meta.faculty_id || 'FAC-CS-101'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Institutional Email</span>
              <span className="font-semibold text-slate-800">{profile?.email || 'faculty@campusconnect.edu'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Department</span>
              <span className="font-semibold text-slate-800">{meta.department || 'Computer Science & Engineering'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Phone</span>
              <span className="font-semibold text-slate-800">{meta.phone || '+1 (555) 345-6789'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Mentorship Authority</span>
          </h2>
          <div className="space-y-2 text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">Automatic Mentorship Binding:</strong>
              When you enroll a student, your faculty ID is automatically set as their mentor_id.
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">Recruitment Oversight:</strong>
              Monitor mentee application statuses, review corporate shortlist notifications, and provide placement guidance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
