import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS, ROLES } from '../../config/constants';
import { 
  Bell, 
  Search, 
  Menu, 
  LogOut, 
  User, 
  Shield, 
  CheckCircle2, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Topbar = ({ onMenuClick, unreadCount = 3 }) => {
  const { profile, role, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifPreview, setShowNotifPreview] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    switch (role) {
      case ROLES.ADMIN:
        return { bg: 'bg-red-50 text-red-700 border-red-200', icon: Shield, text: 'Admin' };
      case ROLES.MANAGEMENT:
        return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Building2, text: 'Management' };
      case ROLES.FACULTY:
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: GraduationCap, text: 'Faculty' };
      case ROLES.STUDENT:
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Sparkles, text: 'Student' };
      case ROLES.COMPANY:
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Briefcase, text: 'Company' };
      default:
        return { bg: 'bg-slate-50 text-slate-700 border-slate-200', icon: User, text: role };
    }
  };

  const roleMeta = getRoleBadge();
  const RoleIcon = roleMeta.icon;

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between transition-all">
      {/* Left side: Hamburger button + User Name (explicitly showing student's name on top-left for students, or faculty/user name) */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 md:hidden focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base md:text-lg font-bold tracking-tight text-slate-900">
              {profile?.full_name || 'Welcome'}
            </span>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${roleMeta.bg}`}>
              <RoleIcon className="w-3 h-3" />
              <span>{roleMeta.text}</span>
            </span>
          </div>
          {role === ROLES.STUDENT && profile?.meta?.register_number && (
            <span className="text-xs text-slate-500 font-mono">
              Reg No: {profile.meta.register_number} • {profile.meta.department || 'B.Tech'}
            </span>
          )}
          {role === ROLES.FACULTY && profile?.meta?.faculty_id && (
            <span className="text-xs text-slate-500">
              ID: {profile.meta.faculty_id} • {profile.meta.department}
            </span>
          )}
        </div>
      </div>

      {/* Right side: Global Search / Notifications / User Menu */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifPreview(!showNotifPreview)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 relative transition-colors focus:outline-none"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Quick Notification Dropdown */}
          {showNotifPreview && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200/80 py-2 z-50 text-left animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Recent Notifications</span>
                <span className="text-[11px] text-brand-600 font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-slate-50 transition cursor-pointer">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>New Recruitment Drive</span>
                    <span className="text-[10px] text-slate-400 font-normal">10m ago</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    Nexus Technologies posted: Junior Full Stack Engineer. Check eligibility & apply.
                  </p>
                </div>
                <div className="px-4 py-3 hover:bg-slate-50 transition cursor-pointer">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>System Welcome</span>
                    <span className="text-[10px] text-slate-400 font-normal">1h ago</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    Campus Connect portal initialized successfully. All role services active.
                  </p>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <button 
                  onClick={() => {
                    setShowNotifPreview(false);
                    navigate(`/${role}/notifications`);
                  }}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline"
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="text-sm font-semibold text-slate-900 truncate">{profile?.full_name}</div>
                <div className="text-xs text-slate-500 truncate">{profile?.email}</div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate(`/${role}/profile`);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
