import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import {
  ArrowLeft, BrainCircuit, GraduationCap, CalendarCheck,
  CheckCircle2, AlertTriangle, ShieldAlert, BookOpen,
  UserCheck, Clock, Mail, Phone, Sparkles, Plus,
  FileText, Activity, ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiPrediction, setAiPrediction] = useState(null);
  const [predictLoading, setPredictLoading] = useState(false);

  useEffect(() => {
    fetchStudentProfile();
  }, [id]);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/students/${id}`);
      setStudent(res.data.student);
      // Auto fetch live ML prediction for this student
      if (res.data.student) {
        runLivePrediction(res.data.student);
      }
    } catch (err) {
      console.error('Error fetching student profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const runLivePrediction = async (s) => {
    try {
      setPredictLoading(true);
      const predRes = await api.post('/risk/predict', {
        student_id: s.student_id,
        student_name: s.name,
        attendance_percentage: s.attendance_percentage,
        consecutive_absences: s.consecutive_absences,
        internal_assessment_marks: s.internal_assessment_marks,
        previous_semester_gpa: s.current_gpa,
        assignment_submission_rate: s.assignment_submission_rate || 80,
        learning_engagement_score: s.learning_engagement_score || 75,
        academic_backlogs: s.academic_backlogs || 0
      });
      setAiPrediction(predRes.data);
    } catch (err) {
      console.error('Prediction error:', err);
    } finally {
      setPredictLoading(false);
    }
  };

  if (loading || !student) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const { assessments = [], attendance_history = [], interventions = [], recommendations = [], study_plans = [] } = student;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'academics', label: 'Academic Records' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'learning', label: 'Learning Activity' },
    { id: 'ai-insights', label: 'AI Risk Insights' },
    { id: 'interventions', label: `Interventions (${interventions.length})` }
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-xs text-slate-500">
          <span>Student Directory</span> / <span className="text-slate-900 dark:text-white font-semibold">{student.name}</span>
        </div>
      </div>

      {/* Hero Profile Card */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={student.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={student.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-500/10 shadow-md"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {student.name}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                  student.risk_level === 'High Risk'
                    ? 'badge-high-risk'
                    : student.risk_level === 'Medium Risk'
                    ? 'badge-med-risk'
                    : 'badge-low-risk'
                }`}>
                  {student.risk_level} ({student.risk_confidence}%)
                </span>
              </div>

              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="font-mono text-blue-600 font-bold">{student.student_id}</span>
                <span>•</span>
                <span>{student.department_id.replace('DEP_', '')} (Semester {student.semester})</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {student.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-blue-500" /> Mentor: {student.teacher_name}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stat Badges */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Attendance</span>
              <p className={`text-base font-bold ${student.attendance_percentage < 75 ? 'text-red-600' : 'text-emerald-600'}`}>
                {student.attendance_percentage}%
              </p>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Current GPA</span>
              <p className="text-base font-bold text-slate-900 dark:text-white">{student.current_gpa}</p>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Backlogs</span>
              <p className="text-base font-bold text-red-600">{student.academic_backlogs}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-6 pt-4 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Metrics Matrix */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-[10px] font-semibold uppercase text-slate-400">Internal Marks Avg</span>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{student.internal_assessment_marks} / 100</p>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${student.internal_assessment_marks}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-[10px] font-semibold uppercase text-slate-400">Assignment Rate</span>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{student.assignment_submission_rate}%</p>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${student.assignment_submission_rate}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-[10px] font-semibold uppercase text-slate-400">Learning Engagement</span>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{student.learning_engagement_score}%</p>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: `${student.learning_engagement_score}%` }} />
                </div>
              </div>
            </div>

            {/* Assessment Progress */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Continuous Assessment Breakdown</h3>
              <div className="space-y-3">
                {assessments.slice(0, 4).map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{a.course_name} ({a.course_code})</p>
                      <p className="text-[11px] text-slate-500">{a.assessment_type} • {a.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-extrabold ${a.marks_obtained < 50 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                        {a.marks_obtained} / {a.max_marks}
                      </span>
                      <p className="text-[10px] text-slate-400">{a.remarks}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: AI Warning / Summary */}
          <div className="space-y-6">
            <div className="p-5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-b from-blue-50/40 to-white dark:from-blue-950/20 dark:to-slate-900 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Predictive Verdict</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Classified as <strong className={student.risk_level === 'High Risk' ? 'text-red-600' : 'text-emerald-600'}>{student.risk_level}</strong> with <strong>{student.risk_confidence}%</strong> confidence. Primary attrition risk driven by consecutive lecture absences and low continuous assessment performance.
              </p>
              <button
                onClick={() => setActiveTab('ai-insights')}
                className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                Inspect Contributing Factors
              </button>
            </div>

            {/* Active Interventions */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Active Mentorship Cases</h3>
              {interventions.length === 0 ? (
                <p className="text-xs text-slate-400 py-3">No active intervention cases logged.</p>
              ) : (
                <div className="space-y-2.5">
                  {interventions.map((i) => (
                    <div key={i.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 dark:text-white">{i.category}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                          {i.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{i.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACADEMIC RECORDS */}
      {activeTab === 'academics' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Complete Assessment Scorecard</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Course Code</th>
                    <th className="py-2.5 px-3">Course Name</th>
                    <th className="py-2.5 px-3">Assessment Type</th>
                    <th className="py-2.5 px-3">Marks Obtained</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Faculty Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {assessments.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{a.course_code}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-white">{a.course_name}</td>
                      <td className="py-2.5 px-3 text-slate-500">{a.assessment_type}</td>
                      <td className="py-2.5 px-3 font-bold">
                        <span className={a.marks_obtained < 50 ? 'text-red-600 font-extrabold' : 'text-slate-900 dark:text-white'}>
                          {a.marks_obtained} / {a.max_marks}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{a.date}</td>
                      <td className="py-2.5 px-3 text-slate-500">{a.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Attendance Percentage</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{student.attendance_percentage}%</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Threshold: 75% required</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Current Absence Streak</span>
              <p className="text-2xl font-bold text-red-600 mt-1">{student.consecutive_absences} classes</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Unexcused consecutive sessions</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Eligibility Status</span>
              <p className={`text-base font-bold mt-1 ${student.attendance_percentage >= 75 ? 'text-emerald-600' : 'text-red-600'}`}>
                {student.attendance_percentage >= 75 ? 'Exam Eligible' : 'Eligibility Warning'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Continuous evaluation register</p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Daily Attendance Log (Past 14 Days)</h3>
            <div className="space-y-2">
              {attendance_history.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${log.status === 'Present' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="font-semibold text-slate-800 dark:text-white">{log.date}</span>
                    <span className="text-slate-500">Course: {log.course_code}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                    log.status === 'Present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LEARNING ACTIVITY */}
      {activeTab === 'learning' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Personalized Recommendations & Tasks</h3>
            <div className="space-y-3">
              {recommendations.map((r) => (
                <div key={r.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{r.topic}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                        {r.subject}
                      </span>
                      <span className="text-[10px] text-slate-400">Est: {r.estimated_time}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">{r.reason}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[11px] font-bold shrink-0 ${
                    r.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {r.completed ? 'Completed' : 'Pending Study'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AI RISK INSIGHTS (CORE INNOVATION) */}
      {activeTab === 'ai-insights' && (
        <div className="space-y-6">
          {predictLoading ? (
            <div className="p-12 text-center text-xs text-slate-400">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto mb-2" />
              Running live Random Forest risk inference...
            </div>
          ) : aiPrediction ? (
            <div className="space-y-6">
              {/* Verdict Banner */}
              <div className={`p-6 rounded-2xl border ${
                aiPrediction.risk_level === 'High Risk'
                  ? 'border-red-200 bg-red-50/50 dark:border-red-900/60 dark:bg-red-950/20'
                  : 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Model Classification Outcome
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {aiPrediction.risk_level}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-slate-500">Confidence Score</span>
                    <p className="text-2xl font-mono font-black text-blue-600">{aiPrediction.confidence}%</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 italic">
                  {aiPrediction.disclaimer}
                </p>
              </div>

              {/* Contributing Factors */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Key Contributing Factors</h3>
                <div className="space-y-2.5">
                  {(aiPrediction.contributing_factors || []).map((f, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs flex items-start gap-3">
                      <div className={`p-1.5 rounded-md shrink-0 ${
                        f.impact.includes('Negative') ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {f.impact.includes('Negative') ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 dark:text-white">{f.factor}</p>
                          <span className={`text-[10px] font-semibold px-2 py-0.2 rounded ${
                            f.impact.includes('Negative') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {f.impact}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{f.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Action Roadmap */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Recommended Early-Intervention Plan</h3>
                <div className="space-y-2">
                  {(aiPrediction.recommended_actions || []).map((action, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/40 dark:bg-blue-950/20 text-xs text-slate-800 dark:text-slate-200 border border-blue-100 dark:border-blue-900/40">
                      <span className="flex h-5 w-5 rounded-full bg-blue-600 text-white items-center justify-center text-[10px] font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">Live prediction not available.</div>
          )}
        </div>
      )}

      {/* TAB 6: INTERVENTIONS */}
      {activeTab === 'interventions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Intervention Log & Mentor Notes</h3>
            <button
              onClick={() => navigate('/admin/interventions')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              Open Interventions Desk
            </button>
          </div>

          <div className="space-y-3">
            {interventions.map((i) => (
              <div key={i.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs text-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{i.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      i.priority === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {i.priority} Priority
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Scheduled: {i.scheduled_followup}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{i.notes}</p>
                {i.action_plan && (
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                    <strong>Action Plan:</strong> {i.action_plan}
                  </div>
                )}
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Mentor: {i.teacher_name}</span>
                  <span className="font-semibold text-blue-600">Status: {i.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
