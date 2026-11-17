import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Bell, ShieldAlert, AlertTriangle, CheckCircle2,
  Check, Filter, Trash2, Clock
} from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Error marking all read:', err);
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'urgent') return n.priority === 'urgent';
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Institutional Notification Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time automated alerts for academic warnings, threshold violations, and intervention outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer shadow-xs"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Alerts ({notifications.length})
        </button>

        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            filter === 'unread'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Unread ({notifications.filter(n => !n.is_read).length})
        </button>

        <button
          onClick={() => setFilter('urgent')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            filter === 'urgent'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Urgent ({notifications.filter(n => n.priority === 'urgent').length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading notifications...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            No notifications in this view.
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 shadow-xs ${
                n.is_read
                  ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  : 'border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                  n.priority === 'urgent' ? 'bg-red-100 text-red-600 dark:bg-red-950/60' :
                  n.priority === 'high' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/60' :
                  'bg-blue-100 text-blue-600 dark:bg-blue-950/60'
                }`}>
                  {n.priority === 'urgent' ? <ShieldAlert className="w-4 h-4" /> :
                   n.priority === 'high' ? <AlertTriangle className="w-4 h-4" /> :
                   <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h3>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>

              {!n.is_read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="px-2.5 py-1 rounded text-[11px] font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 shrink-0 cursor-pointer"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
