import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_HOME_ROUTES } from '../../config/constants';
import { 
  GraduationCap, 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  KeyRound,
  Layers,
  CheckCircle2,
  Info
} from 'lucide-react';

export const Login = () => {
  const [selectedRole, setSelectedRole] = useState(ROLES.STUDENT);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isLiveSupabase, isAuthenticated, role, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect already authenticated users directly to their portal dashboard
  React.useEffect(() => {
    if (!loading && isAuthenticated && role) {
      const destination = location.state?.from?.pathname || ROLE_HOME_ROUTES[role] || '/';
      navigate(destination, { replace: true });
    }
  }, [loading, isAuthenticated, role, navigate, location.state]);

  const roleConfigs = {
    [ROLES.ADMIN]: {
      label: 'Admin',
      icon: ShieldCheck,
      identifierLabel: 'Email',
      placeholder: 'e.g. admin123@gmail.com',
      demoIdentifier: 'admin123@gmail.com',
      helper: 'Global platform super-administrator login.'
    },
    [ROLES.MANAGEMENT]: {
      label: 'College Management',
      icon: Building2,
      identifierLabel: 'Management ID',
      placeholder: 'e.g. MGT-001 or management@campusconnect.edu',
      demoIdentifier: 'MGT-001',
      helper: 'Institution administration identifier issued by Admin.'
    },
    [ROLES.FACULTY]: {
      label: 'Faculty',
      icon: GraduationCap,
      identifierLabel: 'Faculty ID',
      placeholder: 'e.g. FAC-CS-101 or faculty@campusconnect.edu',
      demoIdentifier: 'FAC-CS-101',
      helper: 'Assigned faculty ID issued by College Management.'
    },
    [ROLES.STUDENT]: {
      label: 'Student',
      icon: Sparkles,
      identifierLabel: 'Register Number',
      placeholder: 'e.g. REG2024CS088 or student@campusconnect.edu',
      demoIdentifier: 'REG2024CS088',
      helper: 'Enter your institutional registration number or student email.'
    },
    [ROLES.COMPANY]: {
      label: 'Company',
      icon: Briefcase,
      identifierLabel: 'Company ID / Email',
      placeholder: 'e.g. company@nexus-tech.io or Nexus Technologies',
      demoIdentifier: 'company@nexus-tech.io',
      helper: 'Corporate recruiter credentials verified by Admin.'
    }
  };

  const currentRoleConfig = roleConfigs[selectedRole];

  const handleQuickDemoFill = (roleKey) => {
    setSelectedRole(roleKey);
    const target = roleConfigs[roleKey];
    setIdentifier(target.demoIdentifier);
    setPassword(roleKey === ROLES.ADMIN ? 'admin123' : 'password123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const session = await login({
        identifier,
        password,
        selectedRole
      });

      // Navigate to user's authorized role home
      const destination = location.state?.from?.pathname || ROLE_HOME_ROUTES[session.role] || '/';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email/ID or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-sm font-medium tracking-wide text-slate-300">
            Checking authentication session...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand header */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-brand-500/25 mb-3">
            <Layers className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-center">
            CAMPUS <span className="text-brand-400">CONNECT</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400 text-center">
            Unified College, Faculty, Student & Recruiter Platform
          </p>
        </div>

        {/* Backend Connectivity Status Pill */}
        <div className="mt-4 flex justify-center">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
            isLiveSupabase 
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80' 
              : 'bg-blue-950/60 text-blue-300 border-blue-800/80'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isLiveSupabase ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`}></span>
            {isLiveSupabase ? 'Connected to Supabase PostgreSQL' : 'Local Sandbox Mode (Interactive)'}
          </span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4 sm:px-0">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-100/20 text-slate-900">
          
          {/* Role Switcher Tabs */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Login Type
              </label>
              <span className="text-xs text-brand-600 font-medium">Single Shared Auth</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-xl">
              {Object.keys(roleConfigs).map((roleKey) => {
                const config = roleConfigs[roleKey];
                const Icon = config.icon;
                const isSelected = selectedRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => {
                      setSelectedRole(roleKey);
                      setError('');
                    }}
                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-white text-brand-600 shadow-sm shadow-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-brand-600' : 'text-slate-500'}`} />
                    <span className="truncate w-full text-center text-[11px] sm:text-xs">
                      {config.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
                <div className="leading-snug">{error}</div>
              </div>
            )}

            {/* Dynamic Identifier Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {currentRoleConfig.identifierLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={currentRoleConfig.placeholder}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400 font-sans"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{currentRoleConfig.helper}</p>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all pr-10 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-600/25 transition-all focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying Credentials...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In to {currentRoleConfig.label} Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Panel */}
          <div className="mt-8 pt-6 border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <KeyRound className="w-3.5 h-3.5 text-brand-600" />
                <span>Quick Fill Demo Accounts</span>
              </div>
              <span className="text-[11px] text-slate-500">Demo Password: password123</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoFill(ROLES.STUDENT)}
                className="text-left p-2 rounded-lg bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 transition-all text-xs"
              >
                <div className="font-semibold text-slate-900 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>Student</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono truncate">REG2024CS088</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoFill(ROLES.FACULTY)}
                className="text-left p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all text-xs"
              >
                <div className="font-semibold text-slate-900 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-emerald-600" />
                  <span>Faculty</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono truncate">FAC-CS-101</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoFill(ROLES.MANAGEMENT)}
                className="text-left p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-all text-xs"
              >
                <div className="font-semibold text-slate-900 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-indigo-600" />
                  <span>Management</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono truncate">MGT-001</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoFill(ROLES.COMPANY)}
                className="text-left p-2 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 transition-all text-xs"
              >
                <div className="font-semibold text-slate-900 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-amber-600" />
                  <span>Company</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">company@nexus-tech.io</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoFill(ROLES.ADMIN)}
                className="text-left p-2 rounded-lg bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 transition-all text-xs col-span-2 sm:col-span-1"
              >
                <div className="font-semibold text-slate-900 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-rose-600" />
                  <span>Admin</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">admin123@gmail.com</div>
              </button>
            </div>
          </div>

        </div>

        {/* Security Notice */}
        <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Strict PostgreSQL Row Level Security (RLS) & Role Route Isolation Active</span>
        </p>
      </div>
    </div>
  );
};
