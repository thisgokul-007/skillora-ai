import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  CheckSquare, Plus, Trash2, Calendar, Clock,
  Sparkles, Check, AlertCircle, X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudyPlanner() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Data Structures',
    deadline: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    priority: 'Normal',
    notes: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/study-plans/STU1024');
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error('Error fetching study plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await api.put(`/study-plans/${id}/toggle`);
      const updated = res.data.task;
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      if (updated.completed) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 }
        });
      }
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/study-plans/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/study-plans', {
        ...formData,
        student_id: 'STU1024'
      });
      setTasks(prev => [res.data.task, ...prev]);
      setShowAddModal(false);
      setFormData({
        title: '',
        subject: 'Data Structures',
        deadline: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        priority: 'Normal',
        notes: ''
      });
    } catch (err) {
      alert('Failed to add study plan task');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Personal Study Planner & Milestone Tracker
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Organize revision goals, schedule assignment draft deadlines, and celebrate learning milestones.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Study Goal
        </button>
      </div>

      {/* Task Summary Badges */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Goals</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{tasks.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-600">Completed</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{tasks.filter(t => t.completed).length}</p>
        </div>
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-600">Pending</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">{tasks.filter(t => !t.completed).length}</p>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading study goals...</div>
        ) : tasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            No active study goals. Click 'Add Study Goal' to create your first milestone!
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 shadow-xs ${
                task.completed
                  ? 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  type="button"
                  onClick={() => handleToggle(task.id)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 hover:border-blue-600'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${
                      task.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}>
                      {task.title}
                    </span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                      {task.subject}
                    </span>
                    {task.priority === 'High' && (
                      <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400">
                        High Priority
                      </span>
                    )}
                  </div>
                  {task.notes && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{task.notes}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" /> Due {task.deadline}
                </span>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Delete Goal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD GOAL MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Study Milestone</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Milestone Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Solve 5 Dynamic Programming Problems"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes / Reminders</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Focus on memoization table structure"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
