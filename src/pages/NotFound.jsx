import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export const NotFound = () => {
  const { getHomeRoute } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-850 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">404 — Page Not Found</h1>
        <p className="text-sm text-slate-400 mt-2">
          The requested route does not exist or has been relocated within Campus Connect.
        </p>
        <div className="mt-6">
          <Link
            to={getHomeRoute()}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to Safe Workspace</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
