import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import TeacherLayout from './components/layout/TeacherLayout';
import StudentLayout from './components/layout/StudentLayout';

// Auth
import Login from './pages/auth/Login';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';
import StudentDirectory from './pages/admin/StudentDirectory';
import StudentProfile from './pages/admin/StudentProfile';
import AIRiskPrediction from './pages/admin/AIRiskPrediction';
import AcademicPerformance from './pages/admin/AcademicPerformance';
import AttendanceAnalytics from './pages/admin/AttendanceAnalytics';
import LearningAnalytics from './pages/admin/LearningAnalytics';
import PersonalizedLearning from './pages/admin/PersonalizedLearning';
import InterventionManagement from './pages/admin/InterventionManagement';
import AIAssistant from './pages/admin/AIAssistant';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';
import Notifications from './pages/admin/Notifications';
import Settings from './pages/admin/Settings';

// Teacher Pages
import TeacherOverview from './pages/teacher/TeacherOverview';
import TeacherStudents from './pages/teacher/TeacherStudents';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import TeacherMarks from './pages/teacher/TeacherMarks';

// Student Pages
import StudentOverview from './pages/student/StudentOverview';
import StudentLearningPath from './pages/student/StudentLearningPath';
import StudyPlanner from './pages/student/StudyPlanner';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Root Redirection */}
      <Route
        path="/"
        element={
          user ? (
            user.role === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : user.role === 'teacher' ? (
              <Navigate to="/teacher" replace />
            ) : (
              <Navigate to="/student" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Admin Workspace (12 Modules) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="students" element={<StudentDirectory />} />
        <Route path="students/:id" element={<StudentProfile />} />
        <Route path="ai-risk" element={<AIRiskPrediction />} />
        <Route path="academics" element={<AcademicPerformance />} />
        <Route path="attendance" element={<AttendanceAnalytics />} />
        <Route path="learning-analytics" element={<LearningAnalytics />} />
        <Route path="recommendations" element={<PersonalizedLearning />} />
        <Route path="interventions" element={<InterventionManagement />} />
        <Route path="ai-assistant" element={<AIAssistant />} />
        <Route path="reports" element={<ReportsAnalytics />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Teacher Workspace */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherOverview />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="marks" element={<TeacherMarks />} />
        <Route path="risk-alerts" element={<AIRiskPrediction />} />
        <Route path="interventions" element={<InterventionManagement />} />
        <Route path="recommendations" element={<PersonalizedLearning />} />
        <Route path="reports" element={<ReportsAnalytics />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Student Workspace */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentOverview />} />
        <Route path="academics" element={<AcademicPerformance />} />
        <Route path="attendance" element={<AttendanceAnalytics />} />
        <Route path="learning-path" element={<StudentLearningPath />} />
        <Route path="recommendations" element={<StudentLearningPath />} />
        <Route path="assistant" element={<AIAssistant />} />
        <Route path="planner" element={<StudyPlanner />} />
        <Route path="reports" element={<ReportsAnalytics />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
