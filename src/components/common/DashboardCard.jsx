import React from 'react';

export const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = 'bg-slate-100 text-slate-700',
  iconColor = 'text-brand-600 bg-brand-50 border-brand-200',
  className = ''
}) => {
  return (
    <div className={`bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || badge) && (
        <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          {badge && (
            <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${badgeColor}`}>
              {badge}
            </span>
          )}
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
