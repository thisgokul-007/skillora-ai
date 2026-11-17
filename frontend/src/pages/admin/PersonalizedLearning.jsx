import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Lightbulb, BookOpen, CheckCircle2, Clock,
  ExternalLink, Filter, Check, Sparkles, AlertCircle
} from 'lucide-react';

export default function PersonalizedLearning() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recommendations');
      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await api.put(`/recommendations/${id}/toggle`);
      setRecommendations(prev => prev.map(r => r.id === id ? res.data.recommendation : r));
    } catch (err) {
      console.error('Error toggling recommendation:', err);
    }
  };

  const filtered = recommendations.filter(r => {
    if (filterSubject !== 'all' && r.subject !== filterSubject) return false;
    if (filterDifficulty !== 'all' && r.difficulty !== filterDifficulty) return false;
    return true;
  });

  const subjects = [...new Set(recommendations.map(r => r.subject))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Personalized Learning Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Targeted study modules mapped directly to detected student assessment gaps and continuous quiz results.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2.5">
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Grid of Recommended Learning Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-xs text-slate-400">Loading recommendations...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-xs text-slate-400">No recommendations match the filter.</div>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-xs ${
                r.completed
                  ? 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                    {r.subject}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    r.difficulty === 'Advanced' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40' :
                    r.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40' :
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40'
                  }`}>
                    {r.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-2">
                  {r.topic}
                </h3>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 mb-4">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-600" /> Gap Analysis Trigger:
                  </p>
                  {r.reason}
                </div>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {r.estimated_time}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-blue-600">Student: {r.student_id}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <a
                  href={r.resource_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Open Resource <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => handleToggle(r.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    r.completed
                      ? 'bg-emerald-600 text-white'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {r.completed ? 'Completed' : 'Mark Completed'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
