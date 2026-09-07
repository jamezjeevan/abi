import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../config/constants';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Send, 
  Bell, 
  UserCheck, 
  MessageSquare, 
  User, 
  Users, 
  UserPlus, 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  X,
  Layers,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { role, profile } = useAuth();

  const getNavigationLinks = () => {
    switch (role) {
      case ROLES.STUDENT:
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { name: 'Opportunities & Jobs', path: '/student/jobs', icon: Briefcase },
          { name: 'My Applications', path: '/student/applications', icon: Send },
          { name: 'Resume & AI ATS', path: '/student/resume', icon: FileText },
          { name: 'My Mentor', path: '/student/mentor', icon: UserCheck },
          { name: 'Notifications', path: '/student/notifications', icon: Bell },
          { name: 'Messages', path: '/student/messages', icon: MessageSquare },
          { name: 'My Profile', path: '/student/profile', icon: User },
        ];

      case ROLES.FACULTY:
        return [
          { name: 'Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
          { name: 'My Students', path: '/faculty/students', icon: Users },
          { name: 'Student Applications', path: '/faculty/applications', icon: Send },
          { name: 'Notifications', path: '/faculty/notifications', icon: Bell },
          { name: 'Messages', path: '/faculty/messages', icon: MessageSquare },
          { name: 'My Profile', path: '/faculty/profile', icon: User },
        ];

      case ROLES.MANAGEMENT:
        return [
          { name: 'Dashboard', path: '/management/dashboard', icon: LayoutDashboard },
          { name: 'Faculty Directory', path: '/management/faculty', icon: GraduationCap },
          { name: 'Student Body', path: '/management/students', icon: Users },
          { name: 'Placement Drives', path: '/management/applications', icon: Briefcase },
          { name: 'Messages', path: '/management/messages', icon: MessageSquare },
          { name: 'Institution Profile', path: '/management/profile', icon: Building2 },
        ];

      case ROLES.COMPANY:
        return [
          { name: 'Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
          { name: 'Job Postings', path: '/company/jobs', icon: Briefcase },
          { name: 'Candidate Screening', path: '/company/applicants', icon: Users },
          { name: 'Notifications', path: '/company/notifications', icon: Bell },
          { name: 'Company Profile', path: '/company/profile', icon: Building2 },
        ];

      case ROLES.ADMIN:
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'College Management', path: '/admin/management', icon: Building2 },
          { name: 'Company Partners', path: '/admin/companies', icon: Briefcase },
          { name: 'Admin Profile', path: '/admin/profile', icon: ShieldCheck },
        ];

      default:
        return [];
    }
  };

  const links = getNavigationLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity" 
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 border-r border-slate-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-base tracking-tight leading-none font-sans">
                CAMPUS<span className="text-brand-400">CONNECT</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
                Enterprise Portal
              </div>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-white rounded-lg md:hidden focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hierarchy Indicator */}
        <div className="px-4 py-3 bg-slate-950/50 border-b border-slate-800/80">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Active Workspace
          </div>
          <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5 capitalize">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            {role} Portal
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`
                }
              >
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 text-center">
          <div className="font-medium text-slate-300">Campus Connect Platform</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Unified RBAC • PostgreSQL RLS</div>
        </div>
      </aside>
    </>
  );
};
