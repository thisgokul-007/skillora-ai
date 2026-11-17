import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  BarChart3, Activity, CheckSquare, Clock,
  Users, Award, BookOpen, TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

export default function LearningAnalytics() {
  const [data, setData] = useState({
    engagement_trends: [
      { day: 'Mon', logins: 142, hours_spent: 420 },
      { day: 'Tue', logins: 148, hours_spent: 450 },
      { day: 'Wed', logins: 139, hours_spent: 410 },
      { day: 'Thu', logins: 145, hours_spent: 460 },
      { day: 'Fri', logins: 130, hours_spent: 380 },
      { day: 'Sat', logins: 95, hours_spent: 240 },
      { day: 'Sun', logins: 110, hours_spent: 290 }
    ],
    submission_rates: [
      { module: 'Module 1 (Basics)', submitted: 96.5, on_time: 92.0 },
      { module: 'Module 2 (Core Concepts)', submitted: 89.2, on_time: 84.1 },
      { module: 'Module 3 (Intermediate)', submitted: 81.4, on_time: 73.5 },
      { module: 'Module 4 (Advanced)', submitted: 74.0, on_time: 65.2 },
      { module: 'Module 5 (Capstone)', submitted: 68.5, on_time: 58.0 }
    ]
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Learning Behavior & LMS Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Tracking digital classroom participation, continuous assignment deadlines, and student study cadence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Avg Weekly Study Time</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">18.4 hrs</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">+2.1 hrs vs last month</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">On-Time Assignment Rate</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">79.2%</p>
          <p className="text-[10px] text-slate-400 mt-0.5">85% benchmark</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active LMS Daily Users</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">138 / 150</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">92% daily participation</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Digital Resource Views</span>
          <p className="text-2xl font-bold text-indigo-600 mt-1">2,840</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Lectures & interactive labs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Logins & Hours */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Weekly Platform Study Cadence</h3>
          <p className="text-[11px] text-slate-500 mb-4">Total platform study hours across days of the week</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.engagement_trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="hours_spent" name="Study Hours Logged" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assignment Submission & Dropoff */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Continuous Assessment Progression</h3>
          <p className="text-[11px] text-slate-500 mb-4">Comparing submission % vs on-time delivery across progressive modules</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.submission_rates}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="module" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => val.split(' ')[0] + ' ' + val.split(' ')[1]} />
                <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="submitted" name="Submitted %" stroke="#2563EB" strokeWidth={2.5} />
                <Line type="monotone" dataKey="on_time" name="On-Time %" stroke="#10B981" strokeWidth={2.5} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
