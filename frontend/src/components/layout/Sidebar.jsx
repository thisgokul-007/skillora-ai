import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, BrainCircuit, GraduationCap,
  CalendarCheck, BarChart3, Lightbulb, UserCheck, Bot,
  FileText, Bell, Settings, BookOpen, Clock, Award,
  Sparkles, CheckSquare, ClipboardCheck, ArrowLeftRight
} from 'lucide-react';

export default function Sidebar({ role = 'admin' }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const adminNav = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Student Directory', path: '/admin/students', icon: Users },
    { name: 'AI Risk Prediction', path: '/admin/ai-risk', icon: BrainCircuit, badge: 'AI Core' },
    { name: 'Academic Performance', path: '/admin/academics', icon: GraduationCap },
    { name: 'Attendance Analytics', path: '/admin/attendance', icon: CalendarCheck },
    { name: 'Learning Analytics', path: '/admin/learning-analytics', icon: BarChart3 },
    { name: 'Personalized Learning', path: '/admin/recommendations', icon: Lightbulb },
    { name: 'Intervention Management', path: '/admin/interventions', icon: UserCheck },
    { name: 'AI Assistant', path: '/admin/ai-assistant', icon: Bot, badge: 'Active' },
    { name: 'Reports & Analytics', path: '/admin/reports', icon: FileText },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const teacherNav = [
    { name: 'Overview', path: '/teacher', icon: LayoutDashboard },
    { name: 'My Students', path: '/teacher/students', icon: Users },
    { name: 'Attendance Marking', path: '/teacher/attendance', icon: CalendarCheck },
    { name: 'Assessment Marks', path: '/teacher/marks', icon: ClipboardCheck },
    { name: 'AI Risk Alerts', path: '/teacher/risk-alerts', icon: BrainCircuit, badge: 'Early Warning' },
    { name: 'Student Interventions', path: '/teacher/interventions', icon: UserCheck },
    { name: 'Recommendations', path: '/teacher/recommendations', icon: Lightbulb },
    { name: 'Reports', path: '/teacher/reports', icon: FileText },
    { name: 'Notifications', path: '/teacher/notifications', icon: Bell },
  ];

  const studentNav = [
    { name: 'My Overview', path: '/student', icon: LayoutDashboard },
    { name: 'Academic Performance', path: '/student/academics', icon: GraduationCap },
    { name: 'Attendance Record', path: '/student/attendance', icon: CalendarCheck },
    { name: 'My Learning Path', path: '/student/learning-path', icon: BookOpen, badge: 'Personalized' },
    { name: 'Recommendations', path: '/student/recommendations', icon: Lightbulb },
    { name: 'AI Study Assistant', path: '/student/assistant', icon: Bot, badge: 'Tutor' },
    { name: 'Study Planner', path: '/student/planner', icon: CheckSquare },
    { name: 'Progress Reports', path: '/student/reports', icon: FileText },
    { name: 'Notifications', path: '/student/notifications', icon: Bell },
  ];

  const navItems = role === 'admin' ? adminNav : role === 'teacher' ? teacherNav : studentNav;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-[#0c1427] flex flex-col transition-colors">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 text-white shadow-md shadow-blue-500/20">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Skillora</span>
            <span className="text-xs font-extrabold uppercase px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              AI
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">Educational Intelligence</p>
        </div>
      </div>

      {/* Role Indicator Banner */}
      <div className="px-4 py-2.5 mx-3 mt-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
        <div className="text-xs">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Workspace</p>
          <p className="font-semibold text-slate-800 dark:text-slate-200 capitalize flex items-center gap-1">
            {role === 'admin' && 'Institutional Admin'}
            {role === 'teacher' && 'Faculty Portal'}
            {role === 'student' && 'Student Portal'}
          </p>
        </div>
        <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 animate-pulse" />
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin' || item.path === '/teacher' || item.path === '/student'}
              className={({ isActive }) => `
                group flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all
                ${isActive
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Institutional Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            System Online
          </span>
          <span className="font-mono text-[10px]">v2.4.0</span>
        </div>
      </div>
    </aside>
  );
}
