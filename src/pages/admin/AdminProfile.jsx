import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Mail, KeyRound, CheckCircle2, Lock } from 'lucide-react';

export const AdminProfile = () => {
  const { profile, user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-extrabold flex items-center justify-center text-2xl shadow-xs">
            {profile?.full_name?.charAt(0) || 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{profile?.full_name || 'System Administrator'}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase">
                Global Admin
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              Super-Administrator with governance over College Management and Corporate Partner entities.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>Account Identifiers</span>
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Login Email</span>
              <span className="font-semibold text-slate-800 font-mono">{profile?.email || 'admin123@gmail.com'}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Authority Role</span>
              <span className="font-semibold text-rose-700 uppercase">admin</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Account Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active & Verified</span>
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            <span>Security & Governance Constraints</span>
          </h2>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>Admin cannot directly create or manage students. This enforces institutional hierarchy.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2">
              <KeyRound className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Row Level Security (RLS) protects cross-tenant isolation in Supabase PostgreSQL.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
