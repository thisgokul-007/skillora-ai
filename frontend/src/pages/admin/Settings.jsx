import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Settings as SettingsIcon, Save, CheckCircle,
  Bell, Shield, Sliders, Building
} from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    institution_name: 'Skillora Institute of Technology',
    academic_year: '2026-2027',
    current_semester: 'Fall 2026 (Semester 6)',
    attendance_threshold: 75.0,
    academic_warning_gpa: 6.0,
    high_risk_threshold: 65,
    email_alerts_enabled: true,
    sms_alerts_enabled: false
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      if (res.data.settings) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/settings', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('Failed to save settings');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Institutional Settings & Benchmarks
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure threshold rules, machine learning alerting tolerances, and grading policies.
          </p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold">
            <CheckCircle className="w-4 h-4" /> Changes Persisted
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Institution Info */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Building className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Institution Profile</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institution Name
              </label>
              <input
                type="text"
                value={settings.institution_name}
                onChange={(e) => setSettings({ ...settings, institution_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Academic Year</label>
                <input
                  type="text"
                  value={settings.academic_year}
                  onChange={(e) => setSettings({ ...settings, academic_year: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Active Semester</label>
                <input
                  type="text"
                  value={settings.current_semester}
                  onChange={(e) => setSettings({ ...settings, current_semester: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Predictive & Regulatory Thresholds */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Academic Thresholds & Rules</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mandatory Attendance %
              </label>
              <input
                type="number"
                min="50"
                max="90"
                step="0.5"
                value={settings.attendance_threshold}
                onChange={(e) => setSettings({ ...settings, attendance_threshold: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Institutional exam prerequisite</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Warning GPA
              </label>
              <input
                type="number"
                min="4"
                max="8"
                step="0.1"
                value={settings.academic_warning_gpa}
                onChange={(e) => setSettings({ ...settings, academic_warning_gpa: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Triggers mentorship alert</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                High Risk AI Confidence %
              </label>
              <input
                type="number"
                min="50"
                max="95"
                value={settings.high_risk_threshold}
                onChange={(e) => setSettings({ ...settings, high_risk_threshold: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Flag threshold for ML model</span>
            </div>
          </div>
        </div>

        {/* Notifications & Alert Preferences */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Bell className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Alert Dispatch Automation</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email_alerts_enabled}
                onChange={(e) => setSettings({ ...settings, email_alerts_enabled: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <div>
                <span className="font-semibold text-slate-800 dark:text-white block">Automated Faculty Advisory Emails</span>
                <span className="text-[11px] text-slate-400">Send immediate digest when student flags high risk in model inference</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sms_alerts_enabled}
                onChange={(e) => setSettings({ ...settings, sms_alerts_enabled: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <div>
                <span className="font-semibold text-slate-800 dark:text-white block">SMS Attendance Warnings to Students</span>
                <span className="text-[11px] text-slate-400">Dispatch SMS alert after 3 consecutive unexcused lecture absences</span>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Configuration Parameters
        </button>
      </form>
    </div>
  );
}
