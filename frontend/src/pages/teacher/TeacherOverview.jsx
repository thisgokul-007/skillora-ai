import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import {
  Users, AlertTriangle, CalendarCheck, GraduationCap,
  UserCheck, ArrowRight, CheckCircle2, ShieldAlert,
  Plus, ClipboardCheck, Sparkles, BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TeacherOverview() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeacherData();
  }, [user]);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      // Dr. Sarah Jenkins is TEA201
      const teacherId = 'TEA201';
      const [stuRes, intRes] = await Promise.all([
        api.get('/students', { params: { teacher_id: teacherId } }),
        api.get('/interventions', { params: { teacher_id: teacherId } })
      ]);
      setStudents(stuRes.data.students || []);
      setInterventions(intRes.data.interventions || []);
    } catch (err) {
      console.error('Error fetching teacher data:', err);
    } finally {
      setLoading(false);
    }
  };

  const atRisk = students.filter(s => s.risk_level === 'High Risk');
  const avgAtt = students.length > 0 ? +(students.reduce((a, s) => a + s.attendance_percentage, 0) / students.length).toFixed(1) : 0;
  const avgGpa = students.length > 0 ? +(students.reduce((a, s) => a + s.current_gpa, 0) / students.length).toFixed(2) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white">
              Faculty Advisory Portal
            </span>
            <h1 className="text-2xl font-black tracking-tight mt-1">
              Welcome back, Dr. Sarah Jenkins
            </h1>
            <p className="text-xs text-blue-100 mt-1 max-w-xl">
              Department of Computer Science & Engineering. You have <strong>{atRisk.length} students</strong> currently flagged with high academic risk requiring proactive intervention.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/teacher/attendance')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" /> Record Today's Lecture
            </button>
            <button
              onClick={() => navigate('/teacher/marks')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-800/80 hover:bg-blue-900 text-white text-xs font-bold border border-white/20 transition-colors cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4" /> Enter Marks
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Mentee Students</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{students.length}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Under direct advisory</p>
        </div>

        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/20 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-red-600">High Risk Mentees</span>
          <p className="text-2xl font-bold text-red-600 mt-1">{atRisk.length}</p>
          <p className="text-[10px] text-red-500 mt-0.5">Need immediate advisory</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Class Average Attendance</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">{avgAtt}%</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Prerequisite: 75%</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Class Average GPA</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{avgGpa}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">CS Core Cohort</p>
        </div>
      </div>

      {/* Main Section: Assigned Students & Early Warning Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Students Roster (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Assigned Mentee Cohort</h3>
              <p className="text-[11px] text-slate-500">Live monitoring of your designated students</p>
            </div>
            <button
              onClick={() => navigate('/teacher/students')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Attendance</th>
                  <th className="py-2.5 px-3">GPA</th>
                  <th className="py-2.5 px-3">Risk Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.slice(0, 7).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-blue-600 font-bold">{s.student_id}</span>
                        <span>{s.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        s.attendance_percentage < 70 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {s.attendance_percentage}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-white">{s.current_gpa}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.risk_level === 'High Risk' ? 'badge-high-risk' :
                        s.risk_level === 'Medium Risk' ? 'badge-med-risk' : 'badge-low-risk'
                      }`}>
                        {s.risk_level}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => navigate(`/admin/students/${s.id}`)}
                        className="px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-semibold cursor-pointer"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* High Risk Alerts Right Column */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-red-200 dark:border-red-900/60 bg-gradient-to-b from-red-50/40 to-white dark:from-red-950/20 dark:to-slate-900 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Early-Warning Flags</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              Students under your advisory displaying rapid score declines:
            </p>

            <div className="space-y-2">
              {atRisk.slice(0, 3).map((s) => (
                <div key={s.id} className="p-3 rounded-lg border border-red-100 dark:border-red-900/40 bg-white/80 dark:bg-slate-800/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">{s.name} ({s.student_id})</span>
                    <span className="text-[10px] font-bold text-red-600">{s.attendance_percentage}% Att</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {s.consecutive_absences} consecutive absences • {s.academic_backlogs} pending backlogs
                  </p>
                  <button
                    onClick={() => navigate(`/admin/students/${s.id}`)}
                    className="mt-2 text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Initiate Mentoring Session <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Interventions */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">My Active Interventions</h3>
            <p className="text-[11px] text-slate-500 mb-3">{interventions.length} ongoing cases</p>

            <div className="space-y-2 text-xs">
              {interventions.slice(0, 3).map((i) => (
                <div key={i.id} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-slate-800 dark:text-white">{i.student_name}</span>
                    <span className="text-[10px] font-bold text-amber-600">{i.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{i.category}: {i.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  );
}
