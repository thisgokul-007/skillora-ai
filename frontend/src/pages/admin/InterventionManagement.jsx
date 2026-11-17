import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  UserCheck, Plus, Search, Filter, AlertTriangle,
  Clock, CheckCircle, Calendar, Edit, Trash2, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InterventionManagement() {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    student_id: 'STU1024',
    student_name: 'Alex Rivera',
    teacher_id: 'TEA201',
    teacher_name: 'Dr. Sarah Jenkins',
    category: 'Attendance Support',
    priority: 'Urgent',
    notes: 'Immediate attendance intervention required after 4 consecutive missed classes.',
    action_plan: '1. Daily morning portal check-in. 2. Weekly advisory touchpoint.',
    scheduled_followup: '2026-11-25'
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchInterventions();
    fetchTeachers();
  }, [statusFilter, categoryFilter]);

  const fetchInterventions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/interventions', {
        params: { status: statusFilter, category: categoryFilter }
      });
      setInterventions(res.data.interventions || []);
    } catch (err) {
      console.error('Error fetching interventions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/teachers');
      setTeachers(res.data.teachers || []);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/interventions', formData);
      setShowCreateModal(false);
      fetchInterventions();
      alert('Intervention case created successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create intervention case');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/interventions/${id}`, { status: newStatus });
      fetchInterventions();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this intervention case?')) return;
    try {
      await api.delete(`/interventions/${id}`);
      fetchInterventions();
    } catch (err) {
      console.error('Error deleting intervention:', err);
    }
  };

  const filtered = interventions.filter(i =>
    i.student_name.toLowerCase().includes(search.toLowerCase()) ||
    i.student_id.toLowerCase().includes(search.toLowerCase()) ||
    i.teacher_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Intervention & Mentorship Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Centralized institutional tracking for student advisory cases, action plans, and resolution outcomes.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Open Intervention Case
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Cases</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{interventions.length}</p>
        </div>

        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20">
          <span className="text-[10px] uppercase font-bold text-amber-600">In Progress</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {interventions.filter(i => i.status === 'In Progress').length}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/20">
          <span className="text-[10px] uppercase font-bold text-blue-600">Follow-up Required</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {interventions.filter(i => i.status === 'Follow-up Required').length}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20">
          <span className="text-[10px] uppercase font-bold text-emerald-600">Successfully Closed</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {interventions.filter(i => i.status === 'Completed').length}
          </p>
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
            placeholder="Search by student, ID, or mentor..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Follow-up Required">Follow-up Required</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Attendance Support">Attendance Support</option>
            <option value="Academic Mentoring">Academic Mentoring</option>
            <option value="Subject Improvement">Subject Improvement</option>
            <option value="Assignment Support">Assignment Support</option>
            <option value="Learning Engagement">Learning Engagement</option>
            <option value="General Student Guidance">General Student Guidance</option>
          </select>
        </div>
      </div>

      {/* Interventions Cases Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Case ID & Student</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Faculty Mentor</th>
                <th className="py-3 px-4">Follow-Up Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">Loading cases...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">No intervention cases found.</td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-blue-600 font-bold">{item.id}</span>
                          <span className="font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer" onClick={() => navigate(`/admin/students/${item.student_id}`)}>
                            {item.student_name}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.student_id}</p>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {item.category}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.priority === 'Urgent'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/60'
                          : item.priority === 'High'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60'
                      }`}>
                        {item.priority}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {item.teacher_name}
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {item.scheduled_followup}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className="px-2 py-1 text-[11px] font-semibold rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Follow-up Required">Follow-up Required</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/students/${item.student_id}`)}
                          className="text-[11px] font-semibold text-blue-600 hover:underline"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete Case"
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

      {/* CREATE INTERVENTION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Mentorship Case</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Student ID</label>
                  <input
                    type="text"
                    required
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    value={formData.student_name}
                    onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Attendance Support">Attendance Support</option>
                    <option value="Academic Mentoring">Academic Mentoring</option>
                    <option value="Subject Improvement">Subject Improvement</option>
                    <option value="Assignment Support">Assignment Support</option>
                    <option value="Learning Engagement">Learning Engagement</option>
                    <option value="General Student Guidance">General Student Guidance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Faculty Mentor</label>
                <select
                  value={formData.teacher_id}
                  onChange={(e) => {
                    const t = teachers.find(teach => teach.id === e.target.value);
                    setFormData({
                      ...formData,
                      teacher_id: e.target.value,
                      teacher_name: t ? t.name : 'Faculty Mentor'
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.department_id.replace('DEP_', '')})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Observations & Diagnostic Notes</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
