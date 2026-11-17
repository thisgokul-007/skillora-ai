import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { BookOpen, Check, ExternalLink, Clock, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudentLearningPath() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPath();
  }, []);

  const fetchPath = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recommendations', { params: { student_id: 'STU1024' } });
      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      console.error('Error fetching learning path:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await api.put(`/recommendations/${id}/toggle`);
      const updated = res.data.recommendation;
      setRecommendations(prev => prev.map(r => r.id === id ? updated : r));
      if (updated.completed) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    } catch (err) {
      console.error('Error toggling recommendation:', err);
    }
  };

  const completedCount = recommendations.filter(r => r.completed).length;
  const progressPercent = recommendations.length > 0 ? Math.round((completedCount / recommendations.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              My Adaptive Learning Path
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Personalized learning modules tailored directly to your recent assessment challenges.
          </p>
        </div>

        {/* Path Progress Pill */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="font-bold text-slate-900 dark:text-white">{completedCount} of {recommendations.length} Completed</span>
            <p className="text-[10px] text-slate-400">Adaptive Completion</p>
          </div>
          <div className="relative w-10 h-10 flex items-center justify-center font-bold text-xs text-blue-600 font-mono">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-600 to-sky-400 h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
              rec.completed
                ? 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
            }`}
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  {rec.subject}
                </span>
                <span className="text-xs font-semibold text-slate-400">•</span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {rec.estimated_time}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40">
                  {rec.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {rec.topic}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {rec.reason}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href={rec.resource_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
              >
                Launch Study Material <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => handleToggle(rec.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  rec.completed
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                }`}
              >
                <Check className="w-4 h-4" />
                {rec.completed ? 'Mastered' : 'Mark Completed'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
