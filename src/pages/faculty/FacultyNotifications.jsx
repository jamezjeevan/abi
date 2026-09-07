import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { campusStore } from '../../services/campusStore';
import { Bell, CheckCircle2, Clock, CheckCheck } from 'lucide-react';

export const FacultyNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const loadNotifs = async () => {
    const list = await notificationService.getNotifications(user?.id || '33333333-3333-3333-3333-333333333333');
    setNotifications(list || []);
  };

  useEffect(() => {
    loadNotifs();
    const unsub = campusStore.subscribe(loadNotifs);
    return () => unsub();
  }, [user]);

  const handleMarkAllRead = async () => {
    await notificationService.markAllRead(user?.id || '33333333-3333-3333-3333-333333333333');
    loadNotifs();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>Placement & Mentee Alerts</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Faculty Notifications
          </h1>
        </div>

        {notifications.some(n => !n.is_read) && (
          <button
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all ${
                n.is_read
                  ? 'bg-white border-slate-200/80 text-slate-700'
                  : 'bg-emerald-50/50 border-emerald-200 text-slate-900 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">{n.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No notifications at this time.
          </div>
        )}
      </div>
    </div>
  );
};
