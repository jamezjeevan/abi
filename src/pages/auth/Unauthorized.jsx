import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_HOME_ROUTES } from '../../config/constants';
import { ShieldAlert, ArrowLeft, Home, LogOut } from 'lucide-react';

export const Unauthorized = () => {
  const { role, logout, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const attemptedPath = location.state?.attemptedPath || 'restricted area';
  const homeRoute = role ? ROLE_HOME_ROUTES[role] : '/login';

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-850 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight">
          Access Restricted (403)
        </h1>

        <p className="text-sm text-slate-400 mt-2">
          Your current account role <span className="font-semibold text-brand-400 uppercase">({role})</span> is not authorized to access <code className="bg-slate-800 text-rose-300 px-2 py-0.5 rounded text-xs">{attemptedPath}</code>.
        </p>

        <div className="mt-6 p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 text-left text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-slate-200">Security Policy Enforcement:</div>
          <div>• Campus Connect enforces strict multi-role URL and PostgreSQL Row Level isolation.</div>
          <div>• Direct URL tampering across portals is logged and blocked.</div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to={homeRoute}
            className="flex-1 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
          >
            <Home className="w-4 h-4" />
            <span>Go to My Dashboard</span>
          </Link>
          <button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch Role</span>
          </button>
        </div>
      </div>
    </div>
  );
};
