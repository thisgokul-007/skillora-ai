import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { CalendarCheck, Save, CheckCircle, Clock } from 'lucide-react';

export default function TeacherAttendance() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [courseCode, setCourseCode] = useState('CS301');
  const [attendanceMap, setAttendanceMap] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/students', { params: { department: 'DEP_CS', semester: 6 } });
      const list = res.data.students || [];
      setStudents(list);

      // Default attendance state
      const initial = {};
      list.forEach(s => {
        initial[s.id] = 'Present';
      });
      setAttendanceMap(initial);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, status) => {
    setAttendanceMap(prev => ({ ...prev, [id]: status }));
  };

  const handleSaveSession = async () => {
    try {
      for (const s of students) {
        await api.post('/attendance/record', {
          student_id: s.id,
          status: attendanceMap[s.id] || 'Present',
          course_code: courseCode,
          date: selectedDate,
          recorded_by: 'Dr. Sarah Jenkins'
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed to save session');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Daily Lecture Attendance Register
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Record continuous presence and absence patterns for CS301 Data Structures & Algorithms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
          />
          <button
            onClick={handleSaveSession}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> Commit Session
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Attendance records saved to database and student percentages updated!
        </div>
      )}

      {/* Roster Grid */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Student Name & ID</th>
                <th className="py-3 px-4">Historical Attendance</th>
                <th className="py-3 px-4">Streak</th>
                <th className="py-3 px-4 text-right">Today's Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.slice(0, 15).map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    <span className="font-mono text-blue-600 mr-2">{s.student_id}</span>
                    {s.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      s.attendance_percentage < 70 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {s.attendance_percentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {s.consecutive_absences > 0 ? (
                      <span className="text-red-600 font-bold">{s.consecutive_absences} missed</span>
                    ) : (
                      'Clean'
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(s.id, 'Present')}
                        className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                          attendanceMap[s.id] === 'Present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(s.id, 'Absent')}
                        className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                          attendanceMap[s.id] === 'Absent'
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(s.id, 'Excused')}
                        className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                          attendanceMap[s.id] === 'Excused'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Excused
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
