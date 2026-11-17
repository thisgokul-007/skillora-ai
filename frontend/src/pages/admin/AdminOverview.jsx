import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import {
  Users, AlertTriangle, CalendarCheck, GraduationCap,
  UserCheck, Activity, ArrowUpRight, ArrowDownRight,
  Sparkles, Filter, ChevronRight, ShieldAlert, CheckCircle2,
  TrendingDown, TrendingUp, Info
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function AdminOverview() {
  const { filters, updateFilters } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchDepartments();
  }, [filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/metrics', { params: filters });
      setData(res.data);
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data.departments || []);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs text-slate-500 font-medium">Aggregating Institutional Intelligence...</p>
        </div>
      </div>
    );
  }

  const { cards, risk_distribution, department_performance, attendance_trends, semester_trends, immediate_alerts, recent_activities, ai_insights } = data;

  return (
    <div className="space-y-6">
      {/* Title & Institutional Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Institutional Command Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time multi-dimensional student retention and predictive performance intelligence.
          </p>
        </div>

        {/* Dynamic Filter Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs shadow-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.department}
              onChange={(e) => updateFilters({ department: e.target.value })}
              className="bg-transparent text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs shadow-xs">
            <select
              value={filters.semester}
              onChange={(e) => updateFilters({ semester: e.target.value })}
              className="bg-transparent text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => updateFilters({ department: 'all', semester: 'all' })}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Students */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{cards.total_students.value}</span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> {cards.total_students.change}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Active enrollment across all programs</p>
        </div>

        {/* At Academic Risk */}
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 shadow-xs">
          <div className="flex items-center justify-between text-red-600 dark:text-red-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Students at Risk</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-red-600 dark:text-red-400">{cards.students_at_risk.value}</span>
            <span className="text-[11px] font-semibold text-red-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> {cards.students_at_risk.change}
            </span>
          </div>
          <p className="text-[10px] text-red-500/80 mt-1">High early dropout probability</p>
        </div>

        {/* Average Attendance */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Attendance</span>
            <CalendarCheck className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{cards.avg_attendance.value}%</span>
            <span className="text-[11px] font-semibold text-amber-500 flex items-center">
              <ArrowDownRight className="w-3 h-3" /> {cards.avg_attendance.change}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Institutional Threshold: 75%</p>
        </div>

        {/* Average GPA */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Performance</span>
            <GraduationCap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{cards.avg_performance.value}</span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> {cards.avg_performance.change}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Continuous grading index</p>
        </div>

        {/* Requiring Intervention */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Need Intervention</span>
            <UserCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{cards.requiring_intervention.value}</span>
            <span className="text-[11px] font-semibold text-slate-500 flex items-center">
              {cards.requiring_intervention.change}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Pending mentor allocation</p>
        </div>

        {/* Student Engagement */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Engagement Rate</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{cards.student_engagement.value}</span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> {cards.student_engagement.change}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">LMS & Assignment submissions</p>
        </div>
      </div>

      {/* Main Charts Row 1: Academic Line Chart + Risk Doughnut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Performance Overview (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Academic Performance Across Semesters</h3>
              <p className="text-[11px] text-slate-500">Historical GPA progression vs target passing benchmarks</p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              Interactive Trend
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={semester_trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="semester" stroke="#94a3b8" fontSize={11} />
                <YAxis yAxisId="left" domain={[5, 10]} stroke="#94a3b8" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" domain={[70, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line yAxisId="left" type="monotone" dataKey="avg_gpa" name="Average GPA" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="pass_rate" name="Pass Rate %" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Risk Distribution (Doughnut) */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Student Risk Distribution</h3>
              <span className="text-[10px] font-semibold text-slate-400">Random Forest</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">ML predictive classification based on 7 indicators</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={risk_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {risk_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{cards.total_students.value}</span>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Evaluated</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            {risk_distribution.map((r) => (
              <div key={r.name} className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] font-medium text-slate-500 block truncate">{r.name}</span>
                <span className="text-xs font-bold" style={{ color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Charts Row 2: Attendance Trends + Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Institutional Attendance Trends</h3>
              <p className="text-[11px] text-slate-500">6-Month rolling average compared against the 75% threshold</p>
            </div>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">Current: {cards.avg_attendance.value}%</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendance_trends}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Area type="monotone" dataKey="attendance" name="Attendance %" stroke="#0284C7" fillOpacity={1} fill="url(#colorAtt)" strokeWidth={2.5} />
                <Line type="monotone" dataKey="target" name="Benchmark Target" stroke="#EF4444" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Comparison (Horizontal Bar Chart) */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Department Performance Comparison</h3>
              <p className="text-[11px] text-slate-500">Average GPA across departments</p>
            </div>
            <button
              onClick={() => navigate('/admin/academics')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              Full Details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={department_performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis type="number" domain={[0, 10]} stroke="#94a3b8" fontSize={11} />
                <YAxis type="category" dataKey="code" stroke="#94a3b8" fontSize={11} width={50} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="avg_gpa" name="Avg GPA" fill="#2563EB" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Section 3: AI Insights + Academic Risk Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dedicated AI Insights Panel (1 col) */}
        <div className="p-5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-blue-950/20 dark:via-slate-900 dark:to-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-blue-600 text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Skillora AI Insights</h3>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                  Real-Time Behavioral Analytics
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {ai_insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-800/60 text-xs shadow-2xs"
                >
                  <div className="flex items-start gap-2">
                    {insight.severity === 'warning' ? (
                      <TrendingDown className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : insight.severity === 'positive' ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white leading-tight">{insight.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400">Confidence Threshold: 85%</span>
            <button
              onClick={() => navigate('/admin/ai-assistant')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Consult AI Tutor <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Academic Risk Alerts (Immediate Attention Table) (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Early-Warning Risk Alerts (Immediate Priority)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500">
                Students exhibiting severe attendance deficits and assessment deterioration
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/ai-risk')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View Full Risk Matrix <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Attendance</th>
                  <th className="py-2.5 px-3">GPA</th>
                  <th className="py-2.5 px-3">Consecutive Absences</th>
                  <th className="py-2.5 px-3">Risk Confidence</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {immediate_alerts.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-blue-600 font-bold">{s.student_id}</span>
                        <span>{s.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        s.attendance < 65 
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                      }`}>
                        {s.attendance}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {s.gpa}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-red-600 font-bold">{s.consecutive_absences} classes</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        {s.confidence}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => navigate(`/admin/students/${s.id}`)}
                        className="px-2.5 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Intervene
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
