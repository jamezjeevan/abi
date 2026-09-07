import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, School, Mail, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ManagementProfile = () => {
  const { profile } = useAuth();
  const meta = profile?.meta || {};

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold flex items-center justify-center text-2xl shadow-xs">
            {profile?.full_name?.charAt(0) || 'M'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{profile?.full_name || 'Dean Dr. Arthur Vance'}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold uppercase">
                College Management
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              {meta.title || 'Dean of Academic & Corporate Relations'} • {meta.institution || 'St. Peter Institute of Technology'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <School className="w-4 h-4 text-indigo-600" />
            <span>Institutional Credentials</span>
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Management ID</span>
              <span className="font-semibold text-slate-800 font-mono text-sm">{meta.management_id || 'MGT-001'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Institutional Email</span>
              <span className="font-semibold text-slate-800">{profile?.email || 'management@campusconnect.edu'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Institution</span>
              <span className="font-semibold text-slate-800">{meta.institution || 'St. Peter Institute of Technology'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Authority Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified by System Admin</span>
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Hierarchical Scope & Powers</span>
          </h2>
          <div className="space-y-2 text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">Faculty Governance:</strong>
              Provision, supervise, and coordinate faculty departments across the college.
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">Student Relationship Access:</strong>
              Audit student placement status, CGPA trends, and recruitment eligibility via assigned faculty.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
