import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import {
  Users, Search, Filter, Plus, Download, Upload,
  Edit, Trash2, Eye, ShieldAlert, CheckCircle,
  AlertTriangle, X, FileSpreadsheet, ChevronRight,
  Sparkles, Check, AlertCircle
} from 'lucide-react';

export default function StudentDirectory() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department_id: 'DEP_CS',
    academic_year: '2026-2027',
    semester: 6,
    current_gpa: 7.5,
    attendance_percentage: 82.0,
    consecutive_absences: 0,
    internal_assessment_marks: 75.0,
    assignment_submission_rate: 85.0,
    learning_engagement_score: 80.0,
    academic_backlogs: 0,
    phone: '+1 (555) 019-0000',
    status: 'Active'
  });

  const [importFile, setImportFile] = useState(null);
  const [importStatus, setImportStatus] = useState('');
  const [importLoading, setImportLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, [search, deptFilter, riskFilter, semesterFilter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/students', {
        params: {
          search,
          department: deptFilter,
          risk_level: riskFilter,
          semester: semesterFilter
        }
      });
      setStudents(res.data.students || []);
    } catch (err) {
      console.error('Error fetching students:', err);
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students', formData);
      setShowAddModal(false);
      resetForm();
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add student');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/students/${selectedStudent.id}`, formData);
      setShowEditModal(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update student');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/students/${deleteTarget.id}`);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete student');
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importFile) return;
    setImportLoading(true);
    setImportStatus('');
    try {
      const data = new FormData();
      data.append('file', importFile);
      const res = await api.post('/students-import/csv', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImportStatus(res.data.message);
      fetchStudents();
      setTimeout(() => {
        setShowImportModal(false);
        setImportFile(null);
        setImportStatus('');
      }, 1500);
    } catch (err) {
      setImportStatus('Error importing CSV file.');
    } finally {
      setImportLoading(false);
    }
  };

  const handleExportCsv = () => {
    const query = new URLSearchParams({
      search,
      department: deptFilter,
      risk_level: riskFilter,
      semester: semesterFilter
    }).toString();
    window.open(`/api/students-export/csv?${query}`, '_blank');
  };

  const openEdit = (s) => {
    setSelectedStudent(s);
    setFormData({
      name: s.name,
      email: s.email,
      department_id: s.department_id,
      academic_year: s.academic_year,
      semester: s.semester,
      current_gpa: s.current_gpa,
      attendance_percentage: s.attendance_percentage,
      consecutive_absences: s.consecutive_absences,
      internal_assessment_marks: s.internal_assessment_marks,
      assignment_submission_rate: s.assignment_submission_rate,
      learning_engagement_score: s.learning_engagement_score,
      academic_backlogs: s.academic_backlogs,
      phone: s.phone,
      status: s.status
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      department_id: 'DEP_CS',
      academic_year: '2026-2027',
      semester: 6,
      current_gpa: 7.5,
      attendance_percentage: 82.0,
      consecutive_absences: 0,
      internal_assessment_marks: 75.0,
      assignment_submission_rate: 85.0,
      learning_engagement_score: 80.0,
      academic_backlogs: 0,
      phone: '+1 (555) 019-0000',
      status: 'Active'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Student Intelligence Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse, manage, and inspect comprehensive academic profiles and ML risk indicators.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            Import CSV
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Filtered
          </button>

          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Student
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID (e.g. STU1024), email..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          {/* Dept Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Risk Levels</option>
            <option value="High Risk">High Risk Only</option>
            <option value="Medium Risk">Medium Risk Only</option>
            <option value="Low Risk">Low Risk Only</option>
          </select>

          {/* Semester Filter */}
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>

          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-2">
            {students.length} Students
          </span>
        </div>
      </div>

      {/* Students Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Department & Sem</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Current GPA</th>
                <th className="py-3 px-4">Backlogs</th>
                <th className="py-3 px-4">AI Risk Classification</th>
                <th className="py-3 px-4">Faculty Advisor</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      <span>Loading student records...</span>
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No students match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Student Name & ID */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={s.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-tight hover:text-blue-600 cursor-pointer" onClick={() => navigate(`/admin/students/${s.id}`)}>
                            {s.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] text-blue-600 font-semibold">{s.student_id}</span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[140px]">{s.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department & Semester */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {s.department_id.replace('DEP_', '')}
                      </span>
                      <p className="text-[10px] text-slate-400">Sem {s.semester} • {s.academic_year}</p>
                    </td>

                    {/* Attendance */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          s.attendance_percentage < 70
                            ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                            : s.attendance_percentage < 80
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        }`}>
                          {s.attendance_percentage}%
                        </span>
                        {s.consecutive_absences > 0 && (
                          <span className="text-[10px] text-red-500 font-bold" title={`${s.consecutive_absences} consecutive absences`}>
                            ({s.consecutive_absences} abs)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* GPA */}
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {s.current_gpa} / 10.0
                    </td>

                    {/* Backlogs */}
                    <td className="py-3 px-4">
                      {s.academic_backlogs > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
                          {s.academic_backlogs} pending
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">None</span>
                      )}
                    </td>

                    {/* Risk Badge */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        s.risk_level === 'High Risk'
                          ? 'badge-high-risk'
                          : s.risk_level === 'Medium Risk'
                          ? 'badge-med-risk'
                          : 'badge-low-risk'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          s.risk_level === 'High Risk' ? 'bg-red-600' : s.risk_level === 'Medium Risk' ? 'bg-amber-600' : 'bg-emerald-600'
                        }`} />
                        {s.risk_level}
                        <span className="font-mono text-[9px] opacity-75">({s.risk_confidence}%)</span>
                      </span>
                    </td>

                    {/* Faculty Mentor */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-[11px]">
                      {s.teacher_name || 'Dr. Sarah Jenkins'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/admin/students/${s.id}`)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 transition-colors"
                          title="View Complete Profile & AI Insights"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 transition-colors"
                          title="Edit Student Information"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget(s);
                            setShowDeleteModal(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD STUDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Student Record</h3>
                <p className="text-xs text-slate-500">The ML model will automatically compute risk factors and confidence.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Current GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formData.current_gpa}
                    onChange={(e) => setFormData({ ...formData, current_gpa: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Attendance %</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.attendance_percentage}
                    onChange={(e) => setFormData({ ...formData, attendance_percentage: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Consecutive Absences</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.consecutive_absences}
                    onChange={(e) => setFormData({ ...formData, consecutive_absences: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Internal Marks (100)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.internal_assessment_marks}
                    onChange={(e) => setFormData({ ...formData, internal_assessment_marks: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Academic Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.academic_backlogs}
                    onChange={(e) => setFormData({ ...formData, academic_backlogs: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Save & Predict Risk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Student: {selectedStudent?.name}</h3>
                <p className="text-xs text-slate-500">ID: {selectedStudent?.student_id}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Academic Warning">Academic Warning</option>
                    <option value="Mentorship Active">Mentorship Active</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Current GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formData.current_gpa}
                    onChange={(e) => setFormData({ ...formData, current_gpa: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Attendance %</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.attendance_percentage}
                    onChange={(e) => setFormData({ ...formData, attendance_percentage: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Consecutive Absences</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.consecutive_absences}
                    onChange={(e) => setFormData({ ...formData, consecutive_absences: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-red-200 dark:border-red-900/60 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="p-2.5 rounded-full bg-red-100 dark:bg-red-950/60">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Student Record?</h3>
            </div>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Are you sure you want to permanently delete <strong>{deleteTarget?.name}</strong> ({deleteTarget?.student_id})? This will also remove their associated interventions, attendance records, and personalized learning history.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Batch Import CSV</h3>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <p className="text-xs text-slate-500">
                Upload a CSV file containing student columns: <code>student_id, name, email, department_id, semester, gpa, attendance_percentage</code>.
              </p>

              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  required
                  onChange={(e) => setImportFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                {importFile && (
                  <p className="text-xs text-emerald-600 font-medium mt-2">
                    Selected: {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              {importStatus && (
                <div className={`p-3 rounded-lg text-xs font-semibold ${
                  importStatus.includes('Error') 
                    ? 'bg-red-50 text-red-600 dark:bg-red-950/50' 
                    : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50'
                }`}>
                  {importStatus}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={importLoading || !importFile}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {importLoading ? 'Importing...' : 'Upload & Process'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
