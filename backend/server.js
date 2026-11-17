/**
 * Skillora AI - Centralized Educational Intelligence Platform
 * Express.js REST API Server
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');

const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'skillora-ai-super-secret-key-2026';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure multer for CSV uploads
const upload = multer({ dest: path.join(__dirname, 'uploads/') });
if (!fs.existsSync(path.join(__dirname, 'uploads/'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads/'), { recursive: true });
}

// -------------------------------------------------------------
// JWT Middleware
// -------------------------------------------------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) req.user = null;
    else req.user = user;
    next();
  });
}

app.use(authenticateToken);

// -------------------------------------------------------------
// 1. AUTHENTICATION & DEMO ROLES
// -------------------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    let profile = null;
    if (user.role === 'student') {
      profile = await db.getStudentById(user.id.replace('USR_', ''));
    }

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar_url: user.avatar_url,
        department_id: user.department_id,
        student_profile: profile
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Demo 1-Click Login for Hackathon Presentation
app.post('/api/auth/demo-login', async (req, res) => {
  try {
    const { role } = req.body; // 'admin' | 'teacher' | 'student'
    let targetEmail = 'admin@skillora.ai';
    if (role === 'teacher') targetEmail = 'sarah.jenkins@skillora.ai';
    if (role === 'student') targetEmail = 'alex.rivera@student.skillora.ai';

    const user = await db.findUserByEmail(targetEmail);
    if (!user) {
      return res.status(404).json({ error: `Demo user for role ${role} not found` });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    let studentProfile = null;
    if (role === 'student') {
      studentProfile = await db.getStudentById('STU1024');
    }

    let teacherProfile = null;
    if (role === 'teacher') {
      const teachers = await db.getTeachers();
      teacherProfile = teachers.find(t => t.id === 'TEA201');
    }

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar_url: user.avatar_url,
        department_id: user.department_id,
        student_profile: studentProfile,
        teacher_profile: teacherProfile
      }
    });
  } catch (err) {
    console.error('Demo login error:', err);
    res.status(500).json({ error: 'Demo login failed' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, department_id } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Account with this email already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const newUser = await db.createUser({
      name,
      email,
      password_hash,
      role,
      department_id: department_id || 'DEP_CS',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        avatar_url: newUser.avatar_url
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const user = await db.findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

// -------------------------------------------------------------
// 2. DASHBOARD OVERVIEW & METRICS
// -------------------------------------------------------------
app.get('/api/dashboard/metrics', async (req, res) => {
  try {
    const { department, semester, academic_year } = req.query;
    const students = await db.getStudents({ department, semester, academic_year });
    const interventions = await db.getInterventions();
    const settings = await db.getSettings();

    const totalStudents = students.length;
    const atRiskStudents = students.filter(s => s.risk_level === 'High Risk').length;
    const mediumRiskStudents = students.filter(s => s.risk_level === 'Medium Risk').length;
    const lowRiskStudents = students.filter(s => s.risk_level === 'Low Risk').length;

    const avgAttendance = totalStudents > 0
      ? +(students.reduce((acc, s) => acc + s.attendance_percentage, 0) / totalStudents).toFixed(1)
      : 0;

    const avgGpa = totalStudents > 0
      ? +(students.reduce((acc, s) => acc + s.current_gpa, 0) / totalStudents).toFixed(2)
      : 0;

    const avgInternalMarks = totalStudents > 0
      ? +(students.reduce((acc, s) => acc + s.internal_assessment_marks, 0) / totalStudents).toFixed(1)
      : 0;

    const requiringIntervention = students.filter(
      s => s.risk_level === 'High Risk' || s.attendance_percentage < (settings.attendance_threshold || 75)
    ).length;

    const avgEngagement = totalStudents > 0
      ? +(students.reduce((acc, s) => acc + s.learning_engagement_score, 0) / totalStudents).toFixed(1)
      : 0;

    // Department comparison data
    const departments = await db.getDepartments();
    const deptStats = departments.map(d => {
      const deptStudents = students.filter(s => s.department_id === d.id);
      const dTotal = deptStudents.length;
      const dAtt = dTotal > 0 ? +(deptStudents.reduce((a, s) => a + s.attendance_percentage, 0) / dTotal).toFixed(1) : 0;
      const dGpa = dTotal > 0 ? +(deptStudents.reduce((a, s) => a + s.current_gpa, 0) / dTotal).toFixed(2) : 0;
      const dRisk = deptStudents.filter(s => s.risk_level === 'High Risk').length;
      return {
        id: d.id,
        name: d.name,
        code: d.code,
        student_count: dTotal,
        avg_attendance: dAtt,
        avg_gpa: dGpa,
        high_risk_count: dRisk
      };
    });

    // Attendance trends (past 6 months)
    const attendanceTrends = [
      { month: 'Jun', attendance: 84.5, target: 80 },
      { month: 'Jul', attendance: 86.2, target: 80 },
      { month: 'Aug', attendance: 82.1, target: 80 },
      { month: 'Sep', attendance: 79.4, target: 80 },
      { month: 'Oct', attendance: 76.8, target: 80 },
      { month: 'Nov', attendance: avgAttendance, target: 80 }
    ];

    // Performance progression across semesters
    const semesterTrends = [
      { semester: 'Sem 1', avg_gpa: 7.82, pass_rate: 94.2 },
      { semester: 'Sem 2', avg_gpa: 7.64, pass_rate: 91.5 },
      { semester: 'Sem 3', avg_gpa: 7.41, pass_rate: 88.0 },
      { semester: 'Sem 4', avg_gpa: 7.35, pass_rate: 86.7 },
      { semester: 'Sem 5', avg_gpa: 7.18, pass_rate: 83.4 },
      { semester: 'Sem 6', avg_gpa: avgGpa, pass_rate: 85.1 }
    ];

    // Immediate Risk Alerts
    const immediateAlerts = students
      .filter(s => s.risk_level === 'High Risk')
      .slice(0, 6)
      .map(s => ({
        id: s.id,
        student_id: s.student_id,
        name: s.name,
        department_id: s.department_id,
        attendance: s.attendance_percentage,
        gpa: s.current_gpa,
        consecutive_absences: s.consecutive_absences,
        backlogs: s.academic_backlogs,
        confidence: s.risk_confidence,
        teacher: s.teacher_name
      }));

    // AI Insight highlights
    const aiInsights = [
      {
        title: 'Midterm Attendance Dip in Mechanical & CSE',
        severity: 'warning',
        description: 'Consecutive absence rates surged by 18% in Week 10 post-internal exams. 14 students risk missing eligibility criteria.'
      },
      {
        title: 'Intervention Efficacy: +14.2% Grade Rebound',
        severity: 'positive',
        description: 'Students who completed structured mentoring with Dr. Sarah Jenkins and Prof. David Zhao saw a 1.2 point GPA recovery.'
      },
      {
        title: 'Core Subject Bottleneck Identified',
        severity: 'info',
        description: 'Data Structures (CS301) accounts for 44% of all active high-risk classification triggers across Semester 6.'
      }
    ];

    res.json({
      cards: {
        total_students: { value: totalStudents, change: '+12%', trend: 'up' },
        students_at_risk: { value: atRiskStudents, change: '+4 this month', trend: 'down', critical: true },
        avg_attendance: { value: avgAttendance, change: '-1.8%', trend: 'down', threshold: 75 },
        avg_performance: { value: `${avgGpa} / 10.0`, change: '+0.15', trend: 'up' },
        requiring_intervention: { value: requiringIntervention, change: '18 active cases', trend: 'neutral' },
        student_engagement: { value: `${avgEngagement}%`, change: '+3.4%', trend: 'up' }
      },
      risk_distribution: [
        { name: 'Low Risk', value: lowRiskStudents, color: '#16A34A' },
        { name: 'Medium Risk', value: mediumRiskStudents, color: '#F59E0B' },
        { name: 'High Risk', value: atRiskStudents, color: '#EF4444' }
      ],
      department_performance: deptStats,
      attendance_trends: attendanceTrends,
      semester_trends: semesterTrends,
      immediate_alerts: immediateAlerts,
      recent_activities: interventions.slice(0, 5),
      ai_insights: aiInsights
    });
  } catch (err) {
    console.error('Dashboard metrics error:', err);
    res.status(500).json({ error: 'Failed to compute dashboard metrics' });
  }
});

// -------------------------------------------------------------
// 3. STUDENT DIRECTORY & CRUD
// -------------------------------------------------------------
app.get('/api/students', async (req, res) => {
  try {
    const students = await db.getStudents(req.query);
    res.json({ students, count: students.length });
  } catch (err) {
    console.error('Get students error:', err);
    res.status(500).json({ error: 'Failed to retrieve students' });
  }
});

app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await db.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ student });
  } catch (err) {
    console.error('Get student details error:', err);
    res.status(500).json({ error: 'Failed to retrieve student profile' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { name, department_id, semester, current_gpa, attendance_percentage } = req.body;
    if (!name || !department_id) {
      return res.status(400).json({ error: 'Name and Department are required' });
    }

    // Call AI predictor to auto-calculate risk level
    let risk_level = 'Low Risk';
    let risk_confidence = 85.0;
    try {
      const predRes = await axios.post(`${AI_SERVICE_URL}/api/predict`, {
        attendance_percentage: parseFloat(attendance_percentage) || 85,
        consecutive_absences: parseInt(req.body.consecutive_absences) || 0,
        internal_assessment_marks: parseFloat(req.body.internal_assessment_marks) || 75,
        previous_semester_gpa: parseFloat(current_gpa) || 7.5,
        assignment_submission_rate: parseFloat(req.body.assignment_submission_rate) || 85,
        learning_engagement_score: parseFloat(req.body.learning_engagement_score) || 80,
        academic_backlogs: parseInt(req.body.academic_backlogs) || 0
      });
      risk_level = predRes.data.risk_level;
      risk_confidence = predRes.data.confidence;
    } catch (e) {
      console.log('AI Service offline during create, using fallback rule');
      if (parseFloat(attendance_percentage) < 70) risk_level = 'High Risk';
      else if (parseFloat(attendance_percentage) < 80) risk_level = 'Medium Risk';
    }

    const created = await db.addStudent({
      ...req.body,
      risk_level,
      risk_confidence
    });

    res.status(201).json({ student: created, message: 'Student created successfully' });
  } catch (err) {
    console.error('Create student error:', err);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const updated = await db.updateStudent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ student: updated, message: 'Student updated successfully' });
  } catch (err) {
    console.error('Update student error:', err);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const success = await db.deleteStudent(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Delete student error:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// CSV Export
app.get('/api/students-export/csv', async (req, res) => {
  try {
    const students = await db.getStudents(req.query);
    let csv = 'Student ID,Name,Email,Department,Semester,GPA,Attendance %,Consecutive Absences,Risk Level,Status\n';
    students.forEach(s => {
      csv += `"${s.student_id}","${s.name}","${s.email}","${s.department_id}",${s.semester},${s.current_gpa},${s.attendance_percentage},${s.consecutive_absences},"${s.risk_level}","${s.status}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`skillora_students_${Date.now()}.csv`);
    return res.send(csv);
  } catch (err) {
    console.error('CSV Export error:', err);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

// CSV Import
app.post('/api/students-import/csv', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded' });
    }
    const content = fs.readFileSync(req.file.path, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());

    const imported = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 3) {
        imported.push({
          student_id: parts[0] || `STU_IMP_${Date.now()}_${i}`,
          name: parts[1],
          email: parts[2] || `${parts[1].toLowerCase().replace(/\s+/g, '.')}@student.skillora.ai`,
          department_id: parts[3] || 'DEP_CS',
          semester: parseInt(parts[4]) || 1,
          current_gpa: parseFloat(parts[5]) || 7.0,
          attendance_percentage: parseFloat(parts[6]) || 80.0,
          consecutive_absences: parseInt(parts[7]) || 0,
          risk_level: parts[8] || (parseFloat(parts[6]) < 70 ? 'High Risk' : 'Low Risk')
        });
      }
    }

    const count = await db.importStudents(imported);
    fs.unlinkSync(req.file.path); // cleanup

    res.json({ message: `Successfully imported ${count} students.`, count });
  } catch (err) {
    console.error('CSV Import error:', err);
    res.status(500).json({ error: 'Failed to parse CSV file' });
  }
});

// -------------------------------------------------------------
// 4. AI RISK PREDICTION & MODEL METRICS
// -------------------------------------------------------------
app.get('/api/risk/metrics', async (req, res) => {
  try {
    const aiRes = await axios.get(`${AI_SERVICE_URL}/api/metrics`, { timeout: 3000 });
    res.json(aiRes.data);
  } catch (err) {
    // Fallback if AI service is starting
    const localMetricsPath = path.join(__dirname, '..', 'ai-service', 'metrics.json');
    if (fs.existsSync(localMetricsPath)) {
      const data = JSON.parse(fs.readFileSync(localMetricsPath, 'utf-8'));
      return res.json(data);
    }
    res.status(500).json({ error: 'Model metrics not available' });
  }
});

app.post('/api/risk/predict', async (req, res) => {
  try {
    const aiRes = await axios.post(`${AI_SERVICE_URL}/api/predict`, req.body, { timeout: 4000 });
    res.json(aiRes.data);
  } catch (err) {
    console.error('AI Service predict proxy failed, generating fallback prediction');
    const { attendance_percentage = 80, consecutive_absences = 0, internal_assessment_marks = 70 } = req.body;
    let risk = 'Low Risk';
    let conf = 88.0;
    if (attendance_percentage < 65 || consecutive_absences >= 4 || internal_assessment_marks < 45) {
      risk = 'High Risk';
      conf = 94.5;
    } else if (attendance_percentage < 78 || consecutive_absences >= 2 || internal_assessment_marks < 60) {
      risk = 'Medium Risk';
      conf = 84.0;
    }

    res.json({
      risk_level: risk,
      confidence: conf,
      probabilities: {
        'Low Risk': risk === 'Low Risk' ? 88.0 : 10.0,
        'Medium Risk': risk === 'Medium Risk' ? 84.0 : 25.0,
        'High Risk': risk === 'High Risk' ? 94.5 : 5.0
      },
      contributing_factors: [
        { factor: 'Attendance Evaluation', impact: attendance_percentage < 75 ? 'Negative' : 'Positive', detail: `Attendance: ${attendance_percentage}%` },
        { factor: 'Absence Streak', impact: consecutive_absences > 2 ? 'Negative' : 'Normal', detail: `${consecutive_absences} consecutive missed sessions` }
      ],
      recommended_actions: [
        'Schedule advisory mentoring session with assigned faculty.',
        'Review recent continuous assessments and provide remedial practice.'
      ],
      disclaimer: 'Early-warning indicator based on academic behavioral indicators.'
    });
  }
});

// -------------------------------------------------------------
// 5. ACADEMIC PERFORMANCE ANALYTICS
// -------------------------------------------------------------
app.get('/api/academic/performance', async (req, res) => {
  try {
    const { department, semester } = req.query;
    const students = await db.getStudents({ department, semester });

    const topPerformers = [...students].sort((a, b) => b.current_gpa - a.current_gpa).slice(0, 8);
    const needSupport = [...students].sort((a, b) => a.current_gpa - b.current_gpa).slice(0, 8);

    // Subject breakdown
    const subjectAverages = [
      { subject: 'Data Structures & Algorithms', avg_marks: 68.4, pass_rate: 81.2, at_risk_count: 24 },
      { subject: 'Database Management Systems', avg_marks: 74.2, pass_rate: 89.5, at_risk_count: 12 },
      { subject: 'Operating Systems', avg_marks: 71.8, pass_rate: 86.0, at_risk_count: 16 },
      { subject: 'Object Oriented Software Design', avg_marks: 77.5, pass_rate: 92.4, at_risk_count: 8 },
      { subject: 'Computer Networks', avg_marks: 73.1, pass_rate: 87.8, at_risk_count: 14 }
    ];

    res.json({
      top_performers: topPerformers,
      requiring_support: needSupport,
      subject_averages: subjectAverages,
      distribution: [
        { range: '9.0 - 10.0', count: students.filter(s => s.current_gpa >= 9.0).length },
        { range: '8.0 - 8.9', count: students.filter(s => s.current_gpa >= 8.0 && s.current_gpa < 9.0).length },
        { range: '7.0 - 7.9', count: students.filter(s => s.current_gpa >= 7.0 && s.current_gpa < 8.0).length },
        { range: '6.0 - 6.9', count: students.filter(s => s.current_gpa >= 6.0 && s.current_gpa < 7.0).length },
        { range: '< 6.0', count: students.filter(s => s.current_gpa < 6.0).length }
      ]
    });
  } catch (err) {
    console.error('Academic performance error:', err);
    res.status(500).json({ error: 'Failed to retrieve academic performance' });
  }
});

// -------------------------------------------------------------
// 6. ATTENDANCE MANAGEMENT & ANALYTICS
// -------------------------------------------------------------
app.get('/api/attendance', async (req, res) => {
  try {
    const { department, semester } = req.query;
    const students = await db.getStudents({ department, semester });
    const settings = await db.getSettings();
    const threshold = settings.attendance_threshold || 75;

    const lowAttendanceList = students
      .filter(s => s.attendance_percentage < threshold)
      .sort((a, b) => a.attendance_percentage - b.attendance_percentage);

    const consecutiveAbsenceList = students
      .filter(s => s.consecutive_absences >= 3)
      .sort((a, b) => b.consecutive_absences - a.consecutive_absences);

    res.json({
      threshold,
      low_attendance_students: lowAttendanceList,
      consecutive_absences_students: consecutiveAbsenceList,
      overall_rate: students.length > 0 ? +(students.reduce((a, s) => a + s.attendance_percentage, 0) / students.length).toFixed(1) : 0,
      monthly_summary: [
        { month: 'Jun', percentage: 86.4 },
        { month: 'Jul', percentage: 84.1 },
        { month: 'Aug', percentage: 81.5 },
        { month: 'Sep', percentage: 79.2 },
        { month: 'Oct', percentage: 76.5 },
        { month: 'Nov', percentage: 78.3 }
      ]
    });
  } catch (err) {
    console.error('Attendance error:', err);
    res.status(500).json({ error: 'Failed to fetch attendance analytics' });
  }
});

app.post('/api/attendance/record', async (req, res) => {
  try {
    const { student_id, status, course_code, date, recorded_by } = req.body;
    if (!student_id || !status) {
      return res.status(400).json({ error: 'student_id and status are required' });
    }

    const record = await db.recordAttendance({
      student_id,
      status,
      course_code: course_code || 'CS301',
      date: date || new Date().toISOString().split('T')[0],
      recorded_by: recorded_by || 'Faculty Advisor'
    });

    res.status(201).json({ record, message: 'Attendance recorded successfully' });
  } catch (err) {
    console.error('Record attendance error:', err);
    res.status(500).json({ error: 'Failed to record attendance' });
  }
});

// -------------------------------------------------------------
// 7. INTERVENTIONS MANAGEMENT
// -------------------------------------------------------------
app.get('/api/interventions', async (req, res) => {
  try {
    const list = await db.getInterventions(req.query);
    res.json({ interventions: list, count: list.length });
  } catch (err) {
    console.error('Interventions error:', err);
    res.status(500).json({ error: 'Failed to load interventions' });
  }
});

app.post('/api/interventions', async (req, res) => {
  try {
    const { student_id, student_name, teacher_id, teacher_name, category, priority, notes, action_plan, scheduled_followup } = req.body;
    if (!student_id || !category) {
      return res.status(400).json({ error: 'student_id and category are required' });
    }

    const newInt = await db.createIntervention({
      student_id,
      student_name: student_name || 'Student',
      teacher_id: teacher_id || 'TEA201',
      teacher_name: teacher_name || 'Dr. Sarah Jenkins',
      category,
      priority: priority || 'Medium',
      notes: notes || '',
      action_plan: action_plan || '',
      scheduled_followup: scheduled_followup || '2026-11-25',
      status: 'In Progress'
    });

    res.status(201).json({ intervention: newInt, message: 'Intervention case created successfully' });
  } catch (err) {
    console.error('Create intervention error:', err);
    res.status(500).json({ error: 'Failed to create intervention' });
  }
});

app.put('/api/interventions/:id', async (req, res) => {
  try {
    const updated = await db.updateIntervention(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Intervention not found' });
    res.json({ intervention: updated, message: 'Intervention updated successfully' });
  } catch (err) {
    console.error('Update intervention error:', err);
    res.status(500).json({ error: 'Failed to update intervention' });
  }
});

app.delete('/api/interventions/:id', async (req, res) => {
  try {
    const success = await db.deleteIntervention(req.params.id);
    if (!success) return res.status(404).json({ error: 'Intervention not found' });
    res.json({ message: 'Intervention deleted successfully' });
  } catch (err) {
    console.error('Delete intervention error:', err);
    res.status(500).json({ error: 'Failed to delete intervention' });
  }
});

// -------------------------------------------------------------
// 8. PERSONALIZED LEARNING RECOMMENDATIONS
// -------------------------------------------------------------
app.get('/api/recommendations', async (req, res) => {
  try {
    const { student_id } = req.query;
    const recs = await db.getRecommendations(student_id);
    res.json({ recommendations: recs });
  } catch (err) {
    console.error('Recommendations error:', err);
    res.status(500).json({ error: 'Failed to retrieve recommendations' });
  }
});

app.put('/api/recommendations/:id/toggle', async (req, res) => {
  try {
    const updated = await db.toggleRecommendation(req.params.id);
    if (!updated) return res.status(404).json({ error: 'Recommendation not found' });
    res.json({ recommendation: updated });
  } catch (err) {
    console.error('Toggle recommendation error:', err);
    res.status(500).json({ error: 'Failed to toggle recommendation status' });
  }
});

// -------------------------------------------------------------
// 9. STUDY PLANNER
// -------------------------------------------------------------
app.get('/api/study-plans/:studentId', async (req, res) => {
  try {
    const tasks = await db.getStudyPlans(req.params.studentId);
    res.json({ tasks });
  } catch (err) {
    console.error('Get study plans error:', err);
    res.status(500).json({ error: 'Failed to fetch study plans' });
  }
});

app.post('/api/study-plans', async (req, res) => {
  try {
    const { student_id, title, subject, deadline, priority, notes } = req.body;
    if (!student_id || !title) {
      return res.status(400).json({ error: 'student_id and title are required' });
    }

    const task = await db.addStudyPlan({
      student_id,
      title,
      subject: subject || 'General',
      deadline: deadline || new Date().toISOString().split('T')[0],
      priority: priority || 'Normal',
      notes: notes || ''
    });

    res.status(201).json({ task, message: 'Study task added successfully' });
  } catch (err) {
    console.error('Add study plan error:', err);
    res.status(500).json({ error: 'Failed to add study plan' });
  }
});

app.put('/api/study-plans/:id/toggle', async (req, res) => {
  try {
    const task = await db.toggleStudyPlan(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ task });
  } catch (err) {
    console.error('Toggle task error:', err);
    res.status(500).json({ error: 'Failed to toggle task' });
  }
});

app.delete('/api/study-plans/:id', async (req, res) => {
  try {
    const success = await db.deleteStudyPlan(req.params.id);
    if (!success) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// -------------------------------------------------------------
// 10. AI ASSISTANT CHAT
// -------------------------------------------------------------
app.post('/api/chat', async (req, res) => {
  try {
    const aiRes = await axios.post(`${AI_SERVICE_URL}/api/chat`, req.body, { timeout: 5000 });
    res.json(aiRes.data);
  } catch (err) {
    console.log('Chat proxying failed, falling back to local academic assistant');
    const msg = (req.body.message || '').toLowerCase();
    let reply = "Hello! I am your Skillora AI Academic Tutor. How can I assist your learning today?";
    if (msg.includes('study plan') || msg.includes('schedule')) {
      reply = "### 📅 5-Day Targeted Study Routine\n- **Day 1**: 45m Data Structures (Trees & BST)\n- **Day 2**: 40m Database SQL Joins & Normalization\n- **Day 3**: 30m Active Recall Quiz\n- **Day 4**: Practice Midterm Problems\n- **Day 5**: Review & Consolidation";
    } else if (msg.includes('tree') || msg.includes('algorithm')) {
      reply = "A **Binary Search Tree** ensures for every node: all values in the left subtree are smaller, and all values in the right subtree are larger. This guarantees average $O(\\log n)$ search time!";
    }
    res.json({
      reply,
      sender: 'Skillora AI Tutor (Fallback)',
      timestamp: 'Just now'
    });
  }
});

// -------------------------------------------------------------
// 11. NOTIFICATIONS
// -------------------------------------------------------------
app.get('/api/notifications', async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.query.user_id;
    const notifs = await db.getNotifications(userId);
    res.json({ notifications: notifs });
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const notif = await db.markNotificationRead(req.params.id);
    res.json({ notification: notif });
  } catch (err) {
    console.error('Mark notification read error:', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

app.post('/api/notifications/read-all', async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.body.user_id;
    await db.markAllNotificationsRead(userId);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Mark all read error:', err);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// -------------------------------------------------------------
// 12. REPORTS & ANALYTICS
// -------------------------------------------------------------
app.get('/api/reports/summary', async (req, res) => {
  try {
    const students = await db.getStudents();
    const interventions = await db.getInterventions();
    const depts = await db.getDepartments();

    res.json({
      institution: 'Skillora Institute of Technology',
      generated_at: new Date().toISOString(),
      report_period: 'Academic Year 2026-2027 (Semester 6)',
      key_findings: {
        total_enrolled: students.length,
        retention_rate: '94.2%',
        attrition_prevented_cases: 19,
        active_interventions: interventions.filter(i => i.status !== 'Completed').length,
        average_attendance: +(students.reduce((a, s) => a + s.attendance_percentage, 0) / students.length).toFixed(1),
        overall_gpa: +(students.reduce((a, s) => a + s.current_gpa, 0) / students.length).toFixed(2)
      },
      department_breakdown: depts
    });
  } catch (err) {
    console.error('Reports error:', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// -------------------------------------------------------------
// 13. SETTINGS & REFERENCE DATA
// -------------------------------------------------------------
app.get('/api/departments', async (req, res) => {
  const list = await db.getDepartments();
  res.json({ departments: list });
});

app.get('/api/teachers', async (req, res) => {
  const list = await db.getTeachers();
  res.json({ teachers: list });
});

app.get('/api/settings', async (req, res) => {
  const settings = await db.getSettings();
  res.json({ settings });
});

app.put('/api/settings', async (req, res) => {
  try {
    const updated = await db.updateSettings(req.body);
    res.json({ settings: updated, message: 'Settings updated successfully' });
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Skillora AI Backend Server running on port ${PORT}`);
  console.log(` AI Service configured at: ${AI_SERVICE_URL}`);
  console.log(`====================================================`);
});
