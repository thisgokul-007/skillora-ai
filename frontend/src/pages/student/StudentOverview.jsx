import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import {
  GraduationCap, CalendarCheck, BookOpen, CheckSquare,
  Sparkles, Award, ArrowRight, UserCheck, Clock,
  ChevronRight, ExternalLink, Lightbulb, HeartHandshake
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StudentOverview() {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      // Student demo profile is Alex Rivera STU1024
      const res = await api.get('/students/STU1024');
      setStudent(res.data.student);
    } catch (err) {
      console.error('Error fetching student profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !student) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Motivating Student Welcome Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#101B35] via-[#16274D] to-[#1E3A8A] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={student.avatar_url}
              alt={student.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-400/30 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome back, {student.name}! 👋
                </h1>
              </div>
              <p className="text-xs text-blue-200 mt-1">
                Computer Science & Engineering • Semester 6 • Faculty Mentor: <strong>{student.teacher_name}</strong>
              </p>

              {/* Constructive, Non-Stigmatizing Status Indicator */}
              <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-200 text-xs font-semibold">
                <HeartHandshake className="w-3.5 h-3.5 text-sky-300" />
                <span>Academic Mentorship Active • Focused Support Mode</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/student/planner')}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Open Study Planner
            </button>
            <button
              onClick={() => navigate('/student/assistant')}
              className="px-4 py-2.5 rounded-xl bg-blue-600/60 hover:bg-blue-600 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
            >
              Ask AI Tutor
            </button>
          </div>
        </div>
      </div>

      {/* 4 Personal Growth KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Attendance */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Attendance Status</span>
            <CalendarCheck className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{student.attendance_percentage}%</p>
          <div className="mt-2 text-[11px] flex items-center justify-between text-slate-500">
            <span>Threshold: 75%</span>
            <span className="text-red-500 font-semibold font-mono">Needs +10.8%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${student.attendance_percentage}%` }} />
          </div>
        </div>

        {/* Current GPA */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Current GPA</span>
            <GraduationCap className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{student.current_gpa} <span className="text-xs font-normal text-slate-400">/ 10.0</span></p>
          <p className="text-[11px] text-slate-500 mt-2">Target for Semester 6: <strong>7.00</strong></p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(student.current_gpa / 10) * 100}%` }} />
          </div>
        </div>

        {/* Assignments Submitted */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Coursework Rate</span>
            <CheckSquare className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{student.assignment_submission_rate}%</p>
          <p className="text-[11px] text-emerald-600 mt-2">12 of 15 tasks completed</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${student.assignment_submission_rate}%` }} />
          </div>
        </div>

        {/* Learning Badges */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Study Streaks</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-500">4 Badges</p>
          <p className="text-[11px] text-slate-400 mt-2">Active Study Hub member</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: '80%' }} />
          </div>
        </div>
      </div>

      {/* Row 2: Personalized Adaptive Learning Path + Upcoming Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Learning Path (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  My Personalized Adaptive Learning Path
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                AI-selected review modules generated to prepare you for upcoming final examinations
              </p>
            </div>
            <button
              onClick={() => navigate('/student/learning-path')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              View Full Path <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {(student.recommendations || []).map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{rec.topic}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                      {rec.subject}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{rec.reason}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {rec.estimated_time}</span>
                    <span>•</span>
                    <span className="text-blue-600 font-semibold">{rec.difficulty} Level</span>
                  </div>
                </div>

                <a
                  href={rec.resource_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold shrink-0 shadow-xs flex items-center gap-1"
                >
                  Start <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Mentorship & Upcoming Activities (1 col) */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Faculty Mentoring</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              One-on-one academic check-in with <strong>Dr. Sarah Jenkins</strong>:
            </p>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/40 text-xs">
              <span className="font-semibold text-blue-600 block">Nov 20, 2026 at 10:30 AM</span>
              <span className="text-slate-500 block mt-0.5">Location: Faculty Office Block B-204</span>
              <p className="text-[11px] text-slate-400 mt-2 italic">
                Agenda: Review sorting algorithm lab notes and attendance recovery roadmap.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Recent Study Tasks</h3>
            <div className="space-y-2 text-xs">
              {(student.study_plans || []).slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className={`text-slate-700 dark:text-slate-300 ${task.completed ? 'line-through text-slate-400' : 'font-medium'}`}>
                    {task.title}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${task.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {task.completed ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
