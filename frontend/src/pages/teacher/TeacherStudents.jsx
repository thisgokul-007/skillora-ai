import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Users, Search, Eye, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/students', { params: { teacher_id: 'TEA201' } });
      setStudents(res.data.students || []);
    } catch (err) {
      console.error('Error fetching teacher students:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.student_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Mentee Roster
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Students assigned to Dr. Sarah Jenkins (Department of Computer Science)
          </p>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mentees..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Attendance %</th>
                <th className="py-3 px-4">Current GPA</th>
                <th className="py-3 px-4">Risk Classification</th>
                <th className="py-3 px-4">Backlogs</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">Loading assigned mentees...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">No students found.</td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={s.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer" onClick={() => navigate(`/admin/students/${s.id}`)}>
                            {s.name}
                          </p>
                          <span className="font-mono text-[10px] text-blue-600 font-semibold">{s.student_id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      Semester {s.semester}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        s.attendance_percentage < 70 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {s.attendance_percentage}%
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-white">
                      {s.current_gpa}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        s.risk_level === 'High Risk' ? 'badge-high-risk' :
                        s.risk_level === 'Medium Risk' ? 'badge-med-risk' : 'badge-low-risk'
                      }`}>
                        {s.risk_level}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {s.academic_backlogs > 0 ? (
                        <span className="text-red-600 font-bold">{s.academic_backlogs} pending</span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/students/${s.id}`)}
                        className="px-2.5 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 text-[11px] font-semibold cursor-pointer"
                      >
                        Profile & Insights
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
