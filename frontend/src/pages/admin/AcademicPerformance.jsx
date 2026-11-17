import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  GraduationCap, Award, AlertTriangle, TrendingUp,
  BarChart2, BookOpen, ChevronRight, Filter
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function AcademicPerformance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAcademicData();
    fetchDepartments();
  }, [deptFilter, semesterFilter]);

  const fetchAcademicData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/academic/performance', {
        params: { department: deptFilter, semester: semesterFilter }
      });
      setData(res.data);
    } catch (err) {
      console.error('Error fetching academic performance:', err);
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

  if (loading || !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const { top_performers = [], requiring_support = [], subject_averages = [], distribution = [] } = data;

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Academic Performance Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Subject-wise learning gaps, grade distributions, and honor rolls across academic departments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 1: Subject Performance Comparison + Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Comparison (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Subject-Wise Assessment Averages</h3>
              <p className="text-[11px] text-slate-500">Average test scores vs overall pass rate</p>
            </div>
            <span className="text-xs font-semibold text-blue-600">Core Curriculum</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subject_averages}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="subject" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => val.split(' ')[0]} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="avg_marks" name="Average Marks (100)" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pass_rate" name="Pass Rate %" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">GPA Distribution Curve</h3>
            <p className="text-[11px] text-slate-500 mb-4">Student density across grade tiers</p>

            <div className="space-y-3">
              {distribution.map((tier) => (
                <div key={tier.range}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">GPA {tier.range}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{tier.count} students</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${(tier.count / 150) * 100 * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
            Median Institution GPA: <strong>7.45</strong>
          </div>
        </div>
      </div>

      {/* Row 2: Top Performers vs Students Requiring Support */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers (Honor Roll) */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top-Performing Students</h3>
          </div>

          <div className="space-y-2">
            {top_performers.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => navigate(`/admin/students/${s.id}`)}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{s.name}</span>
                    <p className="text-[10px] text-slate-400">{s.department_id.replace('DEP_', '')} • Sem {s.semester}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600 text-sm">{s.current_gpa}</span>
                  <p className="text-[10px] text-slate-400">Attendance: {s.attendance_percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requiring Academic Mentoring */}
        <div className="p-5 rounded-xl border border-red-200 dark:border-red-900/60 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Students Requiring Academic Support</h3>
          </div>

          <div className="space-y-2">
            {requiring_support.map((s) => (
              <div
                key={s.id}
                onClick={() => navigate(`/admin/students/${s.id}`)}
                className="flex items-center justify-between p-2.5 rounded-lg border border-red-100 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/20 text-xs hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{s.name}</span>
                  <p className="text-[10px] text-red-500 font-medium">
                    {s.academic_backlogs} Backlogs • Attendance: {s.attendance_percentage}%
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-red-600 text-sm">{s.current_gpa}</span>
                  <button className="block text-[10px] text-blue-600 font-semibold hover:underline">
                    Assign Mentor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
