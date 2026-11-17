import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BrainCircuit, Shield, Sparkles, GraduationCap, 
  Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle,
  Users, UserCheck, BookOpen
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoRole, setDemoRole] = useState(null);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setError('');
    setDemoRole(role);
    setLoading(true);
    try {
      const user = await demoLogin(role);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      setError('Demo login failed. Please ensure the backend is running.');
    } finally {
      setLoading(false);
      setDemoRole(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Left Branding Panel */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-[#101B35] via-[#0E172C] to-[#0A1020] text-white p-8 md:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative glow circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight">Skillora</span>
                <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-blue-500/20 text-sky-400 border border-blue-400/30">
                  AI
                </span>
              </div>
              <p className="text-xs text-slate-400">Institutional Intelligence Platform</p>
            </div>
          </div>
        </div>

        {/* Center Tagline & Features */}
        <div className="relative z-10 my-12 md:my-0 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-sky-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering 10,000+ Students Nationwide
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Every Student. <br />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Every Potential.
            </span> <br />
            Every Opportunity.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed mb-8">
            Skillora AI unifies multi-dimensional academic metrics, continuous attendance logs, and machine learning risk classifiers to predict dropout risks weeks before midterm exams and deliver targeted personalized mentoring.
          </p>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center gap-3 text-slate-200">
              <div className="flex h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span><strong>Scikit-Learn Predictive Model:</strong> 88.1% accuracy in early attrition detection</span>
            </div>

            <div className="flex items-center gap-3 text-slate-200">
              <div className="flex h-5 w-5 rounded-full bg-sky-500/20 text-sky-400 items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span><strong>Interconnected Experience:</strong> Institutional Admin, Faculty Advisor & Student Portals</span>
            </div>

            <div className="flex items-center gap-3 text-slate-200">
              <div className="flex h-5 w-5 rounded-full bg-blue-500/20 text-blue-400 items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span><strong>Adaptive Learning Engine:</strong> Bridges specific subject gaps with tailored study roadmaps</span>
            </div>
          </div>
        </div>

        {/* Bottom Institutional Seal */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800 text-xs text-slate-400">
          <span>Skillora Institute of Technology</span>
          <span className="font-mono">Security: SOC2 & FERPA Compliant</span>
        </div>
      </div>

      {/* Right Authentication Panel */}
      <div className="w-full md:w-1/2 p-8 md:p-14 flex items-center justify-center bg-white dark:bg-slate-900 transition-colors">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Sign In to Skillora</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select a 1-click demo role or sign in with your institutional credentials.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Demo Accounts Selector */}
          <div className="mb-6">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              ⚡ 1-Click Instant Demo Portals
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                disabled={loading}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/30 hover:shadow-xs transition-all text-center group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 group-hover:scale-105 transition-transform mb-1.5">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">Admin</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Dean of Academics</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('teacher')}
                disabled={loading}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/30 hover:shadow-xs transition-all text-center group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 group-hover:scale-105 transition-transform mb-1.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">Faculty</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Dr. Sarah Jenkins</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                disabled={loading}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/30 hover:shadow-xs transition-all text-center group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300 group-hover:scale-105 transition-transform mb-1.5">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">Student</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Alex Rivera (STU1024)</span>
              </button>
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                Or Sign In with Email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Institutional Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@skillora.ai"
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Demo Passwords:\n- Admin: admin123\n- Teacher: teacher123\n- Student: student123')}
                  className="text-[11px] text-blue-600 hover:underline dark:text-blue-400 font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Credentials Info Box */}
          <div className="mt-8 p-3 rounded-lg bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
            <p className="font-semibold text-slate-900 dark:text-white mb-1">Standard Demo Credentials:</p>
            <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
              <div>Admin: admin123</div>
              <div>Faculty: teacher123</div>
              <div>Student: student123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
