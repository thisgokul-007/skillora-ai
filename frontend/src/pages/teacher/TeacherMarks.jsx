import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { ClipboardCheck, Save, CheckCircle, Search } from 'lucide-react';

export default function TeacherMarks() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assessmentType, setAssessmentType] = useState('Internal Assessment 2');
  const [courseCode, setCourseCode] = useState('CS301');
  const [marksMap, setMarksMap] = useState({});
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

      const initial = {};
      list.forEach(s => {
        initial[s.id] = s.internal_assessment_marks || 70;
      });
      setMarksMap(initial);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (id, val) => {
    setMarksMap(prev => ({ ...prev, [id]: parseFloat(val) || 0 }));
  };

  const handleSaveMarks = async () => {
    try {
      for (const s of students.slice(0, 15)) {
        await api.put(`/students/${s.id}`, {
          internal_assessment_marks: marksMap[s.id]
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed to save assessment marks');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Assessment Marks Entry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter marks to trigger automated machine learning recalculation of student academic risk.
          </p>
        </div>

        <button
          onClick={handleSaveMarks}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" /> Save Scorecard
        </button>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Marks submitted! AI Risk predictions have been updated for this cohort.
        </div>
      )}

      {/* Selectors */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center gap-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Course</label>
          <select
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
          >
            <option value="CS301">CS301 - Data Structures & Algorithms</option>
            <option value="CS302">CS302 - Database Management Systems</option>
            <option value="CS303">CS303 - Operating Systems</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Evaluation Cycle</label>
          <select
            value={assessmentType}
            onChange={(e) => setAssessmentType(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
          >
            <option value="Internal Assessment 1">Internal Assessment 1</option>
            <option value="Internal Assessment 2">Internal Assessment 2</option>
            <option value="Model Examination">Model Examination</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Student Name & ID</th>
                <th className="py-3 px-4">Current GPA</th>
                <th className="py-3 px-4">Current Risk Level</th>
                <th className="py-3 px-4 text-right">Marks Obtained (/100)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.slice(0, 15).map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    <span className="font-mono text-blue-600 mr-2">{s.student_id}</span>
                    {s.name}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{s.current_gpa}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.risk_level === 'High Risk' ? 'badge-high-risk' :
                      s.risk_level === 'Medium Risk' ? 'badge-med-risk' : 'badge-low-risk'
                    }`}>
                      {s.risk_level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marksMap[s.id] ?? 70}
                      onChange={(e) => handleMarkChange(s.id, e.target.value)}
                      className={`w-24 px-3 py-1 text-right font-bold font-mono text-xs rounded-lg border ${
                        (marksMap[s.id] || 0) < 50
                          ? 'border-red-300 text-red-600 bg-red-50/50'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white'
                      }`}
                    />
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
