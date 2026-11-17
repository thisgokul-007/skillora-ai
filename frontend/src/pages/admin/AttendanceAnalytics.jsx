import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  CalendarCheck, AlertTriangle, UserCheck, Plus,
  Upload, CheckCircle, XCircle, Search, Filter
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function AttendanceAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [markForm, setMarkForm] = useState({
    student_id: 'STU1024',
    status: 'Present',
    course_code: 'CS301',
    date: new Date().toISOString().split('T')[0]
  });
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await api.get('/attendance');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching attendance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/attendance/record', markForm);
      setShowMarkModal(false);
      fetchAttendance();
      alert('Attendance recorded successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to record attendance');
    }
  };

  if (loading || !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const { threshold = 75, low_attendance_students = [], consecutive_absences_students = [], overall_rate = 78.3, monthly_summary = [] } = data;

  const filteredLow = low_attendance_students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.student_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Attendance Analytics & Monitoring
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Institutional tracking, consecutive absence surveillance, and mandatory exam eligibility enforcement.
          </p>
        </div>

        <button
          onClick={() => setShowMarkModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Record Attendance Entry
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Overall Attendance Rate</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{overall_rate}%</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">Across all 5 departments</p>
        </div>

        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/20 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-red-600">Below 75% Threshold</span>
          <p className="text-2xl font-bold text-red-600 mt-1">{low_attendance_students.length}</p>
          <p className="text-[10px] text-red-500 mt-0.5">Ineligible for final exams</p>
        </div>

        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-600">Critical Absence Streaks</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">{consecutive_absences_students.length}</p>
          <p className="text-[10px] text-amber-600 mt-0.5">≥3 consecutive missed lectures</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Institutional Threshold</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">{threshold}%</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Configured in settings</p>
        </div>
      </div>

      {/* Row 2: Monthly Trends Area Chart */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">6-Month Aggregate Attendance Trend</h3>
            <p className="text-[11px] text-slate-500">Monthly attendance percentage tracking</p>
          </div>
          <span className="text-xs font-mono text-blue-600 font-bold">Target: 80%</span>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthly_summary}>
              <defs>
                <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
              <Area type="monotone" dataKey="percentage" name="Attendance %" stroke="#2563EB" strokeWidth={2.5} fill="url(#attGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Critical Low Attendance Warning Roster */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Low Attendance Alert Roster (&lt; {threshold}%)
              </h3>
            </div>
            <p className="text-[11px] text-slate-500">
              Immediate counseling and parent/guardian communication required
            </p>
          </div>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter at-risk students..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Attendance %</th>
                <th className="py-2.5 px-3">Consecutive Absences</th>
                <th className="py-2.5 px-3">Deficit to 75%</th>
                <th className="py-2.5 px-3">Faculty Advisor</th>
                <th className="py-2.5 px-3 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLow.map((s) => {
                const deficit = +(threshold - s.attendance_percentage).toFixed(1);
                return (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                      <span className="font-mono text-blue-600 mr-2">{s.student_id}</span>
                      {s.name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{s.department_id.replace('DEP_', '')} (Sem {s.semester})</td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-red-600">{s.attendance_percentage}%</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-red-500">{s.consecutive_absences} missed</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-red-600 font-bold">
                      -{deficit}%
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{s.teacher_name}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => navigate(`/admin/students/${s.id}`)}
                        className="px-2.5 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 text-[11px] font-semibold cursor-pointer"
                      >
                        Send Warning
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD ATTENDANCE MODAL */}
      {showMarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Record Attendance Entry</h3>
            <form onSubmit={handleMarkSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Student ID</label>
                <input
                  type="text"
                  required
                  value={markForm.student_id}
                  onChange={(e) => setMarkForm({ ...markForm, student_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select
                  value={markForm.status}
                  onChange={(e) => setMarkForm({ ...markForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Excused">Excused (Medical / Official)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  value={markForm.date}
                  onChange={(e) => setMarkForm({ ...markForm, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMarkModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
