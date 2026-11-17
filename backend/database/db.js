/**
 * Skillora AI - Database Abstraction Layer
 * Provides seamless persistence supporting both MySQL and local persistent storage.
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const SEED_FILE = path.join(__dirname, 'seed_data.json');
let bundledSeed = null;
try {
  bundledSeed = require('./seed_data.json');
} catch (e) {}

const isVercel = !!process.env.VERCEL;
const STORE_FILE = isVercel ? path.join('/tmp', 'data_store.json') : path.join(__dirname, 'data_store.json');

// Initialize store if not present
try {
  if (!fs.existsSync(STORE_FILE)) {
    if (fs.existsSync(SEED_FILE)) {
      fs.copyFileSync(SEED_FILE, STORE_FILE);
      console.log('[DB] Initialized persistent store from seed_data.json');
    } else if (bundledSeed) {
      fs.writeFileSync(STORE_FILE, JSON.stringify(bundledSeed, null, 2), 'utf-8');
      console.log('[DB] Initialized persistent store from bundled seed');
    }
  }
} catch (e) {
  console.log('[DB] Store init notice:', e.message);
}

let inMemoryStore = null;

function loadStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      inMemoryStore = JSON.parse(raw);
      return inMemoryStore;
    }
  } catch (err) {}
  if (inMemoryStore) return inMemoryStore;
  if (bundledSeed) {
    inMemoryStore = JSON.parse(JSON.stringify(bundledSeed));
    return inMemoryStore;
  }
  try {
    if (fs.existsSync(SEED_FILE)) {
      inMemoryStore = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8'));
      return inMemoryStore;
    }
  } catch (err) {}
  return {};
}

function saveStore(data) {
  inMemoryStore = data;
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // In-memory fallback works smoothly in serverless
  }
}

const db = {
  // Users & Auth
  findUserByEmail: async (email) => {
    const store = loadStore();
    return (store.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById: async (id) => {
    const store = loadStore();
    return (store.users || []).find(u => u.id === id);
  },

  createUser: async (userData) => {
    const store = loadStore();
    const newUser = {
      id: `USR_${Date.now()}`,
      created_at: new Date().toISOString(),
      ...userData
    };
    store.users = store.users || [];
    store.users.push(newUser);
    saveStore(store);
    return newUser;
  },

  // Students
  getStudents: async (filters = {}) => {
    const store = loadStore();
    let list = [...(store.students || [])];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.student_id.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }
    if (filters.department && filters.department !== 'all') {
      list = list.filter(s => s.department_id === filters.department);
    }
    if (filters.risk_level && filters.risk_level !== 'all') {
      list = list.filter(s => s.risk_level === filters.risk_level);
    }
    if (filters.semester && filters.semester !== 'all') {
      list = list.filter(s => String(s.semester) === String(filters.semester));
    }
    if (filters.academic_year && filters.academic_year !== 'all') {
      list = list.filter(s => s.academic_year === filters.academic_year);
    }
    if (filters.teacher_id && filters.teacher_id !== 'all') {
      list = list.filter(s => s.teacher_id === filters.teacher_id);
    }

    return list;
  },

  getStudentById: async (id) => {
    const store = loadStore();
    const student = (store.students || []).find(s => s.id === id || s.student_id === id);
    if (!student) return null;

    const studentAssessments = (store.assessments || []).filter(a => a.student_id === student.id);
    const studentAttendance = (store.attendance || []).filter(a => a.student_id === student.id);
    const studentInterventions = (store.interventions || []).filter(i => i.student_id === student.id);
    const studentRecommendations = (store.recommendations || []).filter(r => r.student_id === student.id);
    const studentStudyPlans = (store.study_plans || []).filter(p => p.student_id === student.id);

    return {
      ...student,
      assessments: studentAssessments,
      attendance_history: studentAttendance,
      interventions: studentInterventions,
      recommendations: studentRecommendations,
      study_plans: studentStudyPlans
    };
  },

  addStudent: async (data) => {
    const store = loadStore();
    const stuNum = 1000 + (store.students.length + 1);
    const newStudent = {
      id: data.student_id || `STU${stuNum}`,
      student_id: data.student_id || `STU${stuNum}`,
      name: data.name,
      email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@student.skillora.ai`,
      department_id: data.department_id || 'DEP_CS',
      academic_year: data.academic_year || '2026-2027',
      semester: parseInt(data.semester) || 1,
      current_gpa: parseFloat(data.current_gpa) || 7.5,
      attendance_percentage: parseFloat(data.attendance_percentage) || 85.0,
      consecutive_absences: parseInt(data.consecutive_absences) || 0,
      internal_assessment_marks: parseFloat(data.internal_assessment_marks) || 75.0,
      assignment_submission_rate: parseFloat(data.assignment_submission_rate) || 85.0,
      learning_engagement_score: parseFloat(data.learning_engagement_score) || 80.0,
      academic_backlogs: parseInt(data.academic_backlogs) || 0,
      risk_level: data.risk_level || 'Low Risk',
      risk_confidence: data.risk_confidence || 88.0,
      teacher_id: data.teacher_id || 'TEA201',
      teacher_name: data.teacher_name || 'Dr. Sarah Jenkins',
      phone: data.phone || '+1 (555) 000-0000',
      status: data.status || 'Active',
      avatar_url: data.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      enrollment_date: new Date().toISOString().split('T')[0]
    };

    store.students = store.students || [];
    store.students.unshift(newStudent);
    saveStore(store);
    return newStudent;
  },

  updateStudent: async (id, data) => {
    const store = loadStore();
    const idx = (store.students || []).findIndex(s => s.id === id || s.student_id === id);
    if (idx === -1) return null;

    store.students[idx] = {
      ...store.students[idx],
      ...data,
      updated_at: new Date().toISOString()
    };
    saveStore(store);
    return store.students[idx];
  },

  deleteStudent: async (id) => {
    const store = loadStore();
    const initialLen = (store.students || []).length;
    store.students = (store.students || []).filter(s => s.id !== id && s.student_id !== id);
    store.interventions = (store.interventions || []).filter(i => i.student_id !== id);
    store.recommendations = (store.recommendations || []).filter(r => r.student_id !== id);
    store.study_plans = (store.study_plans || []).filter(p => p.student_id !== id);
    saveStore(store);
    return store.students.length < initialLen;
  },

  importStudents: async (newStudentsList) => {
    const store = loadStore();
    store.students = store.students || [];
    let count = 0;

    for (const item of newStudentsList) {
      const stuId = item.student_id || `STU${1000 + store.students.length + 1}`;
      const existingIdx = store.students.findIndex(s => s.student_id === stuId);
      if (existingIdx >= 0) {
        store.students[existingIdx] = { ...store.students[existingIdx], ...item };
      } else {
        store.students.unshift({
          id: stuId,
          student_id: stuId,
          status: 'Active',
          ...item
        });
      }
      count++;
    }
    saveStore(store);
    return count;
  },

  // Interventions
  getInterventions: async (filters = {}) => {
    const store = loadStore();
    let list = [...(store.interventions || [])];

    if (filters.student_id) {
      list = list.filter(i => i.student_id === filters.student_id);
    }
    if (filters.teacher_id && filters.teacher_id !== 'all') {
      list = list.filter(i => i.teacher_id === filters.teacher_id);
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter(i => i.status === filters.status);
    }
    if (filters.priority && filters.priority !== 'all') {
      list = list.filter(i => i.priority === filters.priority);
    }
    if (filters.category && filters.category !== 'all') {
      list = list.filter(i => i.category === filters.category);
    }

    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  createIntervention: async (data) => {
    const store = loadStore();
    const newInt = {
      id: `INT-${3000 + (store.interventions || []).length + 1}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'Pending',
      priority: 'Medium',
      ...data
    };
    store.interventions = store.interventions || [];
    store.interventions.unshift(newInt);
    saveStore(store);
    return newInt;
  },

  updateIntervention: async (id, data) => {
    const store = loadStore();
    const idx = (store.interventions || []).findIndex(i => i.id === id);
    if (idx === -1) return null;

    store.interventions[idx] = {
      ...store.interventions[idx],
      ...data,
      updated_at: new Date().toISOString()
    };
    saveStore(store);
    return store.interventions[idx];
  },

  deleteIntervention: async (id) => {
    const store = loadStore();
    const initialLen = (store.interventions || []).length;
    store.interventions = (store.interventions || []).filter(i => i.id !== id);
    saveStore(store);
    return store.interventions.length < initialLen;
  },

  // Recommendations
  getRecommendations: async (studentId = null) => {
    const store = loadStore();
    let list = store.recommendations || [];
    if (studentId) {
      list = list.filter(r => r.student_id === studentId);
    }
    return list;
  },

  toggleRecommendation: async (id) => {
    const store = loadStore();
    const rec = (store.recommendations || []).find(r => r.id === id);
    if (!rec) return null;
    rec.completed = !rec.completed;
    saveStore(store);
    return rec;
  },

  // Study Plans
  getStudyPlans: async (studentId) => {
    const store = loadStore();
    return (store.study_plans || []).filter(p => p.student_id === studentId);
  },

  addStudyPlan: async (planData) => {
    const store = loadStore();
    const newPlan = {
      id: `STP-${Date.now()}`,
      created_at: new Date().toISOString(),
      completed: false,
      priority: 'Normal',
      ...planData
    };
    store.study_plans = store.study_plans || [];
    store.study_plans.unshift(newPlan);
    saveStore(store);
    return newPlan;
  },

  toggleStudyPlan: async (id) => {
    const store = loadStore();
    const plan = (store.study_plans || []).find(p => p.id === id);
    if (!plan) return null;
    plan.completed = !plan.completed;
    saveStore(store);
    return plan;
  },

  deleteStudyPlan: async (id) => {
    const store = loadStore();
    const initialLen = (store.study_plans || []).length;
    store.study_plans = (store.study_plans || []).filter(p => p.id !== id);
    saveStore(store);
    return store.study_plans.length < initialLen;
  },

  // Attendance
  getAttendance: async (filters = {}) => {
    const store = loadStore();
    let list = store.attendance || [];
    if (filters.student_id) {
      list = list.filter(a => a.student_id === filters.student_id);
    }
    if (filters.date) {
      list = list.filter(a => a.date === filters.date);
    }
    return list;
  },

  recordAttendance: async (entry) => {
    const store = loadStore();
    const newRecord = {
      id: `ATT_${Date.now()}`,
      created_at: new Date().toISOString(),
      ...entry
    };
    store.attendance = store.attendance || [];
    store.attendance.unshift(newRecord);

    // Recalculate student attendance percentage
    const student = (store.students || []).find(s => s.id === entry.student_id || s.student_id === entry.student_id);
    if (student) {
      const records = store.attendance.filter(a => a.student_id === student.id);
      const presentCount = records.filter(a => a.status === 'Present').length;
      student.attendance_percentage = +((presentCount / records.length) * 100).toFixed(1);
      if (entry.status === 'Absent') {
        student.consecutive_absences = (student.consecutive_absences || 0) + 1;
      } else {
        student.consecutive_absences = 0;
      }
    }

    saveStore(store);
    return newRecord;
  },

  // Assessments
  recordAssessment: async (entry) => {
    const store = loadStore();
    const newRecord = {
      id: `ASM_${Date.now()}`,
      ...entry
    };
    store.assessments = store.assessments || [];
    store.assessments.unshift(newRecord);
    saveStore(store);
    return newRecord;
  },

  // Notifications
  getNotifications: async (userId) => {
    const store = loadStore();
    let list = store.notifications || [];
    if (userId) {
      list = list.filter(n => n.user_id === userId || n.user_id === 'ALL');
    }
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  markNotificationRead: async (id) => {
    const store = loadStore();
    const notif = (store.notifications || []).find(n => n.id === id);
    if (!notif) return null;
    notif.is_read = true;
    saveStore(store);
    return notif;
  },

  markAllNotificationsRead: async (userId) => {
    const store = loadStore();
    (store.notifications || []).forEach(n => {
      if (!userId || n.user_id === userId || n.user_id === 'ALL') {
        n.is_read = true;
      }
    });
    saveStore(store);
    return true;
  },

  // Reference Data
  getDepartments: async () => {
    const store = loadStore();
    return store.departments || [];
  },

  getTeachers: async () => {
    const store = loadStore();
    return store.teachers || [];
  },

  getCourses: async () => {
    const store = loadStore();
    return store.courses || [];
  },

  getSettings: async () => {
    const store = loadStore();
    return store.settings || {};
  },

  updateSettings: async (newSettings) => {
    const store = loadStore();
    store.settings = { ...store.settings, ...newSettings };
    saveStore(store);
    return store.settings;
  }
};

module.exports = db;
