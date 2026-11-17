/**
 * Skillora AI - Seed Generator
 * Generates 150 students, 10 teachers, 5 departments, attendance, assessments,
 * interventions, recommendations, notifications, and study plans.
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const adminHash = bcrypt.hashSync('admin123', salt);
const teacherHash = bcrypt.hashSync('teacher123', salt);
const studentHash = bcrypt.hashSync('student123', salt);

const departments = [
  { id: 'DEP_CS', code: 'CSE', name: 'Computer Science & Engineering', hod_name: 'Prof. Marcus Brody', hod_email: 'm.brody@skillora.ai' },
  { id: 'DEP_AI', code: 'AI&DS', name: 'Artificial Intelligence & Data Science', hod_name: 'Dr. Evelyn Chen', hod_email: 'e.chen@skillora.ai' },
  { id: 'DEP_ECE', code: 'ECE', name: 'Electronics & Communication', hod_name: 'Dr. Rajesh Nair', hod_email: 'r.nair@skillora.ai' },
  { id: 'DEP_IT', code: 'IT', name: 'Information Technology', hod_name: 'Prof. Helen Ross', hod_email: 'h.ross@skillora.ai' },
  { id: 'DEP_MECH', code: 'MECH', name: 'Mechanical & Automation Engineering', hod_name: 'Dr. Robert Miller', hod_email: 'r.miller@skillora.ai' }
];

const teachers = [
  { id: 'TEA201', employee_id: 'FAC-101', name: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@skillora.ai', department_id: 'DEP_CS', designation: 'Associate Professor', phone: '+1 (555) 019-2831' },
  { id: 'TEA202', employee_id: 'FAC-102', name: 'Dr. Evelyn Chen', email: 'evelyn.chen@skillora.ai', department_id: 'DEP_AI', designation: 'Professor & HOD', phone: '+1 (555) 019-4822' },
  { id: 'TEA203', employee_id: 'FAC-103', name: 'Prof. David Zhao', email: 'david.zhao@skillora.ai', department_id: 'DEP_CS', designation: 'Assistant Professor', phone: '+1 (555) 019-3391' },
  { id: 'TEA204', employee_id: 'FAC-104', name: 'Dr. Maya Patel', email: 'maya.patel@skillora.ai', department_id: 'DEP_AI', designation: 'Associate Professor', phone: '+1 (555) 019-7712' },
  { id: 'TEA205', employee_id: 'FAC-105', name: 'Prof. James Wilson', email: 'james.wilson@skillora.ai', department_id: 'DEP_IT', designation: 'Senior Lecturer', phone: '+1 (555) 019-1144' },
  { id: 'TEA206', employee_id: 'FAC-106', name: 'Dr. Rajesh Nair', email: 'rajesh.nair@skillora.ai', department_id: 'DEP_ECE', designation: 'Professor', phone: '+1 (555) 019-5567' },
  { id: 'TEA207', employee_id: 'FAC-107', name: 'Prof. Elena Rostova', email: 'elena.rostova@skillora.ai', department_id: 'DEP_ECE', designation: 'Assistant Professor', phone: '+1 (555) 019-8823' },
  { id: 'TEA208', employee_id: 'FAC-108', name: 'Dr. Robert Miller', email: 'robert.miller@skillora.ai', department_id: 'DEP_MECH', designation: 'Professor', phone: '+1 (555) 019-9941' },
  { id: 'TEA209', employee_id: 'FAC-109', name: 'Prof. Anita Desai', email: 'anita.desai@skillora.ai', department_id: 'DEP_IT', designation: 'Assistant Professor', phone: '+1 (555) 019-2234' },
  { id: 'TEA210', employee_id: 'FAC-110', name: 'Dr. Carlos Mendoza', email: 'carlos.mendoza@skillora.ai', department_id: 'DEP_MECH', designation: 'Associate Professor', phone: '+1 (555) 019-6678' }
];

const firstNames = [
  'Liam', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Sophia', 'Lucas', 'Mia', 'Aiden', 'Ava',
  'Mason', 'Isabella', 'Logan', 'Amelia', 'Oliver', 'Harper', 'Elijah', 'Evelyn', 'James', 'Abigail',
  'Benjamin', 'Emily', 'Alexander', 'Elizabeth', 'Henry', 'Mila', 'Sebastian', 'Ella', 'Daniel', 'Avery',
  'Matthew', 'Sofia', 'Samuel', 'Camila', 'David', 'Aria', 'Joseph', 'Scarlett', 'Carter', 'Victoria',
  'Owen', 'Madison', 'Wyatt', 'Luna', 'John', 'Grace', 'Jack', 'Chloe', 'Luke', 'Penelope',
  'Jayden', 'Layla', 'Dylan', 'Riley', 'Grayson', 'Zoey', 'Levi', 'Nora', 'Isaac', 'Lily',
  'Gabriel', 'Eleanor', 'Julian', 'Hannah', 'Mateo', 'Lillian', 'Anthony', 'Addison', 'Jaxon', 'Aubrey',
  'Lincoln', 'Ellie', 'Joshua', 'Stella', 'Christopher', 'Natalie', 'Andrew', 'Zoe', 'Theodore', 'Leah',
  'Caleb', 'Hazel', 'Ryan', 'Violet', 'Asher', 'Aurora', 'Nathan', 'Savannah', 'Thomas', 'Audrey',
  'Leo', 'Brooklyn', 'Isaiah', 'Bella', 'Charles', 'Claire', 'Josiah', 'Skylar', 'Hudson', 'Lucy'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
  'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper'
];

const coursesByDept = {
  'DEP_CS': [
    { code: 'CS301', name: 'Data Structures & Algorithms', credits: 4 },
    { code: 'CS302', name: 'Database Management Systems', credits: 4 },
    { code: 'CS303', name: 'Operating Systems & Architecture', credits: 3 },
    { code: 'CS304', name: 'Object Oriented Software Design', credits: 3 },
    { code: 'CS305', name: 'Computer Networks', credits: 3 }
  ],
  'DEP_AI': [
    { code: 'AI301', name: 'Machine Learning Foundations', credits: 4 },
    { code: 'AI302', name: 'Deep Learning & Neural Networks', credits: 4 },
    { code: 'AI303', name: 'Data Mining & Predictive Modeling', credits: 3 },
    { code: 'AI304', name: 'Natural Language Processing', credits: 3 },
    { code: 'AI305', name: 'Computer Vision & Robotics', credits: 3 }
  ],
  'DEP_ECE': [
    { code: 'EC301', name: 'Digital Signal Processing', credits: 4 },
    { code: 'EC302', name: 'Microprocessors & Microcontrollers', credits: 4 },
    { code: 'EC303', name: 'VLSI Circuit Design', credits: 3 },
    { code: 'EC304', name: 'Wireless Communication Systems', credits: 3 },
    { code: 'EC305', name: 'Embedded Systems & IoT', credits: 3 }
  ],
  'DEP_IT': [
    { code: 'IT301', name: 'Cloud Computing Architecture', credits: 4 },
    { code: 'IT302', name: 'Full-Stack Web Engineering', credits: 4 },
    { code: 'IT303', name: 'Information Security & Cryptography', credits: 3 },
    { code: 'IT304', name: 'DevOps & Site Reliability', credits: 3 },
    { code: 'IT305', name: 'Big Data Engineering Pipelines', credits: 3 }
  ],
  'DEP_MECH': [
    { code: 'ME301', name: 'Thermodynamics & Heat Transfer', credits: 4 },
    { code: 'ME302', name: 'Fluid Mechanics & Turbomachinery', credits: 4 },
    { code: 'ME303', name: 'Robotics & Industrial Automation', credits: 3 },
    { code: 'ME304', name: 'CAD/CAM Finite Element Modeling', credits: 3 },
    { code: 'ME305', name: 'Manufacturing Processes & Metallurgy', credits: 3 }
  ]
};

// Generate 150 students with balanced risk distribution
// Target: ~30 High Risk (20%), ~50 Medium Risk (33%), ~70 Low Risk (47%)
const students = [];
const users = [
  {
    id: 'USR_ADMIN_01',
    email: 'admin@skillora.ai',
    password_hash: adminHash,
    name: 'Dr. Arthur Vance',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department_id: null
  },
  {
    id: 'USR_TEA_201',
    email: 'sarah.jenkins@skillora.ai',
    password_hash: teacherHash,
    name: 'Dr. Sarah Jenkins',
    role: 'teacher',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department_id: 'DEP_CS'
  },
  {
    id: 'USR_STU_1024',
    email: 'alex.rivera@student.skillora.ai',
    password_hash: studentHash,
    name: 'Alex Rivera',
    role: 'student',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    department_id: 'DEP_CS'
  }
];

// Add teacher user accounts
teachers.forEach((t, idx) => {
  if (t.id !== 'TEA201') {
    users.push({
      id: `USR_${t.id}`,
      email: t.email,
      password_hash: teacherHash,
      name: t.name,
      role: 'teacher',
      avatar_url: `https://images.unsplash.com/photo-${1500000000000 + idx * 12345}?w=150&auto=format&fit=crop&q=80`,
      department_id: t.department_id
    });
  }
});

// Explicit demo student STU1024
students.push({
  id: 'STU1024',
  user_id: 'USR_STU_1024',
  student_id: 'STU1024',
  name: 'Alex Rivera',
  email: 'alex.rivera@student.skillora.ai',
  department_id: 'DEP_CS',
  academic_year: '2024-2025',
  semester: 6,
  current_gpa: 5.85,
  attendance_percentage: 64.2,
  consecutive_absences: 4,
  internal_assessment_marks: 48.5,
  assignment_submission_rate: 58.0,
  learning_engagement_score: 42.0,
  academic_backlogs: 2,
  risk_level: 'High Risk',
  risk_confidence: 94.6,
  teacher_id: 'TEA201',
  teacher_name: 'Dr. Sarah Jenkins',
  phone: '+1 (555) 234-8901',
  status: 'Academic Warning',
  avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  enrollment_date: '2022-09-01'
});

// Generate remaining 149 students
const academicYears = ['2023-2024', '2024-2025', '2025-2026', '2026-2027'];
const yearSemMap = {
  'Year 1': [1, 2],
  'Year 2': [3, 4],
  'Year 3': [5, 6],
  'Year 4': [7, 8]
};

for (let i = 2; i <= 150; i++) {
  const stuNum = 1000 + i;
  const stuId = `STU${stuNum}`;
  const fName = firstNames[(i * 3 + 7) % firstNames.length];
  const lName = lastNames[(i * 5 + 11) % lastNames.length];
  const fullName = `${fName} ${lName}`;
  const email = `${fName.toLowerCase()}.${lName.toLowerCase()}@student.skillora.ai`;
  
  const dept = departments[i % departments.length];
  const deptTeachers = teachers.filter(t => t.department_id === dept.id);
  const assignedTeacher = deptTeachers[i % deptTeachers.length] || teachers[0];
  
  const semester = (i % 8) + 1;
  const academicYear = academicYears[Math.floor(semester / 2.5)];

  // Create intentional distribution
  let riskLevel = 'Low Risk';
  let attendance, consecutiveAbsences, internalMarks, gpa, assignmentRate, engagement, backlogs, riskConf;
  
  if (i <= 32) {
    // High Risk (~20%)
    riskLevel = 'High Risk';
    attendance = +(52 + (i % 18) * 1.05).toFixed(1); // 52 - 69%
    consecutiveAbsences = 3 + (i % 5); // 3 to 7
    internalMarks = +(35 + (i % 20) * 1.1).toFixed(1); // 35 - 57
    gpa = +(4.2 + (i % 18) * 0.12).toFixed(2); // 4.2 - 6.3
    assignmentRate = +(40 + (i % 25) * 1.1).toFixed(1);
    engagement = +(25 + (i % 25) * 1.2).toFixed(1);
    backlogs = 1 + (i % 3); // 1 to 3
    riskConf = +(88 + (i % 11) * 1.0).toFixed(1);
  } else if (i <= 82) {
    // Medium Risk (~33%)
    riskLevel = 'Medium Risk';
    attendance = +(71 + (i % 11) * 0.8).toFixed(1); // 71 - 79%
    consecutiveAbsences = 1 + (i % 3); // 1 to 3
    internalMarks = +(58 + (i % 18) * 0.9).toFixed(1); // 58 - 74
    gpa = +(6.4 + (i % 15) * 0.1).toFixed(2); // 6.4 - 7.9
    assignmentRate = +(68 + (i % 16) * 1.1).toFixed(1);
    engagement = +(55 + (i % 20) * 1.0).toFixed(1);
    backlogs = (i % 4 === 0) ? 1 : 0;
    riskConf = +(74 + (i % 15) * 1.0).toFixed(1);
  } else {
    // Low Risk (~47%)
    riskLevel = 'Low Risk';
    attendance = +(82 + (i % 18) * 0.95).toFixed(1); // 82 - 99%
    if (attendance > 100) attendance = 98.5;
    consecutiveAbsences = (i % 7 === 0) ? 1 : 0;
    internalMarks = +(76 + (i % 22) * 1.0).toFixed(1); // 76 - 98
    gpa = +(8.1 + (i % 18) * 0.1).toFixed(2); // 8.1 - 9.9
    if (gpa > 10.0) gpa = 9.85;
    assignmentRate = +(86 + (i % 14) * 0.9).toFixed(1);
    engagement = +(80 + (i % 18) * 1.0).toFixed(1);
    backlogs = 0;
    riskConf = +(91 + (i % 8) * 1.1).toFixed(1);
  }

  const status = riskLevel === 'High Risk' ? (i % 2 === 0 ? 'Academic Warning' : 'Mentorship Active') : 'Active';

  students.push({
    id: stuId,
    user_id: `USR_${stuId}`,
    student_id: stuId,
    name: fullName,
    email: email,
    department_id: dept.id,
    academic_year: academicYear,
    semester: semester,
    current_gpa: gpa,
    attendance_percentage: attendance,
    consecutive_absences: consecutiveAbsences,
    internal_assessment_marks: internalMarks,
    assignment_submission_rate: assignmentRate,
    learning_engagement_score: engagement,
    academic_backlogs: backlogs,
    risk_level: riskLevel,
    risk_confidence: riskConf,
    teacher_id: assignedTeacher.id,
    teacher_name: assignedTeacher.name,
    phone: `+1 (555) ${100 + (i * 7) % 900}-${1000 + (i * 13) % 9000}`,
    status: status,
    avatar_url: `https://images.unsplash.com/photo-${1500000000000 + i * 3344}?w=150&auto=format&fit=crop&q=80`,
    enrollment_date: '2023-09-01'
  });
}

// Generate Assessments
const assessments = [];
students.forEach((s) => {
  const deptCourses = coursesByDept[s.department_id] || coursesByDept['DEP_CS'];
  deptCourses.slice(0, 4).forEach((c, cIdx) => {
    // Internal 1
    const baseMark = s.internal_assessment_marks;
    const m1 = Math.min(100, Math.max(25, Math.round(baseMark + ((cIdx % 2 === 0 ? 3 : -4)))));
    const m2 = Math.min(100, Math.max(20, Math.round(baseMark + ((cIdx % 3 === 0 ? -6 : 5)))));
    
    assessments.push({
      id: `ASM_${s.id}_${c.code}_1`,
      student_id: s.id,
      course_code: c.code,
      course_name: c.name,
      assessment_type: 'Internal Assessment 1',
      marks_obtained: m1,
      max_marks: 100,
      date: '2026-09-28',
      remarks: m1 < 50 ? 'Needs remedial problem sessions' : 'Satisfactory progress'
    });
    
    assessments.push({
      id: `ASM_${s.id}_${c.code}_2`,
      student_id: s.id,
      course_code: c.code,
      course_name: c.name,
      assessment_type: 'Internal Assessment 2',
      marks_obtained: m2,
      max_marks: 100,
      date: '2026-10-30',
      remarks: m2 < 50 ? 'Immediate advisory required' : 'Solid performance'
    });
  });
});

// Generate Attendance Logs (Recent 14 days)
const attendanceLogs = [];
const dates = [
  '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07',
  '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14',
  '2026-11-17'
];

students.forEach((s) => {
  const deptCourses = coursesByDept[s.department_id] || coursesByDept['DEP_CS'];
  dates.forEach((d, dIdx) => {
    let status = 'Present';
    if (s.risk_level === 'High Risk') {
      if (dIdx >= dates.length - s.consecutive_absences) {
        status = 'Absent';
      } else if (dIdx % 3 === 0) {
        status = 'Absent';
      }
    } else if (s.risk_level === 'Medium Risk') {
      if (dIdx % 5 === 0) status = 'Absent';
    } else {
      if (dIdx === 2 && s.consecutive_absences > 0) status = 'Absent';
    }
    
    attendanceLogs.push({
      id: `ATT_${s.id}_${d}`,
      student_id: s.id,
      course_code: deptCourses[0].code,
      date: d,
      status: status,
      recorded_by: s.teacher_name
    });
  });
});

// Generate Interventions (25+ realistic cases)
const interventionCategories = [
  'Attendance Support',
  'Academic Mentoring',
  'Subject Improvement',
  'Assignment Support',
  'Learning Engagement',
  'General Student Guidance'
];

const interventions = [
  {
    id: 'INT-3001',
    student_id: 'STU1024',
    student_name: 'Alex Rivera',
    teacher_id: 'TEA201',
    teacher_name: 'Dr. Sarah Jenkins',
    category: 'Attendance Support',
    priority: 'Urgent',
    status: 'In Progress',
    notes: 'Alex missed 4 consecutive sessions in CS301 & CS302. Meeting conducted with mentor. Agreed on daily morning check-in and attendance recovery plan.',
    action_plan: '1. Daily attendance verification via portal. 2. Bi-weekly catch-up meetings. 3. Remedial lab exercises for sorting algorithms.',
    scheduled_followup: '2026-11-20',
    created_at: '2026-11-10T10:30:00Z',
    updated_at: '2026-11-14T14:15:00Z'
  },
  {
    id: 'INT-3002',
    student_id: 'STU1024',
    student_name: 'Alex Rivera',
    teacher_id: 'TEA201',
    teacher_name: 'Dr. Sarah Jenkins',
    category: 'Subject Improvement',
    priority: 'High',
    status: 'In Progress',
    notes: 'Scored 42% on Data Structures mid-term test. Enrolled in peer mentoring group led by Liam Johnson.',
    action_plan: 'Complete 5 guided pointer & BST exercises on Skillora Learning Hub by Nov 25.',
    scheduled_followup: '2026-11-22',
    created_at: '2026-11-12T09:00:00Z',
    updated_at: '2026-11-15T11:20:00Z'
  }
];

// Add 25 more interventions for at-risk students
students.slice(1, 26).forEach((s, idx) => {
  const cat = interventionCategories[idx % interventionCategories.length];
  const prio = s.risk_level === 'High Risk' ? (idx % 2 === 0 ? 'Urgent' : 'High') : (idx % 2 === 0 ? 'Medium' : 'Low');
  const stat = idx % 4 === 0 ? 'Completed' : idx % 3 === 0 ? 'Follow-up Required' : idx % 2 === 0 ? 'In Progress' : 'Pending';
  
  interventions.push({
    id: `INT-${3003 + idx}`,
    student_id: s.id,
    student_name: s.name,
    teacher_id: s.teacher_id,
    teacher_name: s.teacher_name,
    category: cat,
    priority: prio,
    status: stat,
    notes: `Initial academic assessment review for ${s.name} regarding ${cat.toLowerCase()}. Performance trends evaluated with department mentor.`,
    action_plan: `Provide structured guidance on course objectives, review pending assignment submissions, and track weekly milestone progression.`,
    scheduled_followup: `2026-11-${20 + (idx % 9)}`,
    created_at: '2026-11-05T08:30:00Z',
    updated_at: '2026-11-16T12:00:00Z'
  });
});

// Recommendations
const learningResources = [
  { id: 'RES01', title: 'Interactive Pointer & Memory Allocation Visualizer', subject: 'Data Structures', topic: 'Pointers & Dynamic Memory', difficulty: 'Intermediate', estimated_time: '45 mins', resource_url: 'https://skillora.ai/hub/ds/pointers', type: 'Interactive Lab' },
  { id: 'RES02', title: 'Tree Traversal: BFS vs DFS Deep Dive', subject: 'Data Structures', topic: 'Trees & Graphs', difficulty: 'Beginner', estimated_time: '30 mins', resource_url: 'https://skillora.ai/hub/ds/trees', type: 'Video' },
  { id: 'RES03', title: 'SQL Joins & Index Optimization Masterclass', subject: 'Database Systems', topic: 'Query Optimization', difficulty: 'Advanced', estimated_time: '50 mins', resource_url: 'https://skillora.ai/hub/db/sql-opt', type: 'Reading' },
  { id: 'RES04', title: 'Operating Systems Virtual Memory & Paging Walkthrough', subject: 'Operating Systems', topic: 'Virtual Memory', difficulty: 'Intermediate', estimated_time: '35 mins', resource_url: 'https://skillora.ai/hub/os/paging', type: 'Reading' },
  { id: 'RES05', title: 'Gradient Descent & Cost Functions in Practice', subject: 'Machine Learning', topic: 'Optimization', difficulty: 'Intermediate', estimated_time: '40 mins', resource_url: 'https://skillora.ai/hub/ai/grad-descent', type: 'Interactive Lab' },
  { id: 'RES06', title: 'Microcontroller Timers and Interrupts Lab', subject: 'Embedded Systems', topic: 'Interrupt Handling', difficulty: 'Intermediate', estimated_time: '55 mins', resource_url: 'https://skillora.ai/hub/ece/timers', type: 'Practice Sheet' }
];

const recommendations = [
  {
    id: 'REC-501',
    student_id: 'STU1024',
    subject: 'Data Structures',
    topic: 'Trees & Graphs Traversal',
    reason: 'Identified deficit in Internal Assessment 2 (scored 42% on Binary Search Tree questions).',
    difficulty: 'Intermediate',
    estimated_time: '45 mins',
    resource_url: 'https://skillora.ai/hub/ds/trees',
    completed: false,
    created_at: '2026-11-10T14:00:00Z'
  },
  {
    id: 'REC-502',
    student_id: 'STU1024',
    subject: 'Database Systems',
    topic: 'SQL Joins & Group By Aggregations',
    reason: 'Assignment 3 submission showed confusion between INNER and LEFT OUTER joins.',
    difficulty: 'Beginner',
    estimated_time: '30 mins',
    resource_url: 'https://skillora.ai/hub/db/sql-opt',
    completed: true,
    created_at: '2026-11-08T10:00:00Z'
  },
  {
    id: 'REC-503',
    student_id: 'STU1024',
    subject: 'Operating Systems',
    topic: 'Page Replacement Algorithms (LRU, FIFO)',
    reason: 'Frequent low scores on memory management quizzes.',
    difficulty: 'Intermediate',
    estimated_time: '40 mins',
    resource_url: 'https://skillora.ai/hub/os/paging',
    completed: false,
    created_at: '2026-11-12T16:30:00Z'
  }
];

// Add recommendations for other students
students.slice(1, 40).forEach((s, idx) => {
  const res = learningResources[idx % learningResources.length];
  recommendations.push({
    id: `REC-${504 + idx}`,
    student_id: s.id,
    subject: res.subject,
    topic: res.topic,
    reason: `Targeted revision recommended based on recent continuous evaluation in ${res.subject}.`,
    difficulty: res.difficulty,
    estimated_time: res.estimated_time,
    resource_url: res.resource_url,
    completed: idx % 3 === 0,
    created_at: '2026-11-11T12:00:00Z'
  });
});

// Notifications
const notifications = [
  {
    id: 'NOTIF-101',
    user_id: 'USR_ADMIN_01',
    title: 'High Dropout Risk Surge Detected',
    message: 'AI Early Warning flagged 32 students with >85% dropout risk in Semester 6 due to post-midterm attendance drops.',
    type: 'risk_alert',
    priority: 'urgent',
    is_read: false,
    link: '/admin/ai-risk',
    created_at: '2026-11-17T09:15:00Z'
  },
  {
    id: 'NOTIF-102',
    user_id: 'USR_ADMIN_01',
    title: 'Department Attendance Warning',
    message: 'Mechanical Engineering 3rd year attendance dipped below the institutional 75% benchmark (current: 72.4%).',
    type: 'attendance_warning',
    priority: 'high',
    is_read: false,
    link: '/admin/attendance',
    created_at: '2026-11-16T16:40:00Z'
  },
  {
    id: 'NOTIF-103',
    user_id: 'USR_ADMIN_01',
    title: 'Faculty Intervention Completed',
    message: 'Dr. Sarah Jenkins successfully closed academic mentoring case for 4 students with verified grade recoveries.',
    type: 'intervention_update',
    priority: 'medium',
    is_read: true,
    link: '/admin/interventions',
    created_at: '2026-11-15T11:00:00Z'
  },
  {
    id: 'NOTIF-104',
    user_id: 'USR_TEA_201',
    title: 'Student Absence Alert: Alex Rivera',
    message: 'Alex Rivera (STU1024) has accumulated 4 consecutive absences in Data Structures lecture.',
    type: 'attendance_warning',
    priority: 'urgent',
    is_read: false,
    link: '/teacher/attendance',
    created_at: '2026-11-17T08:30:00Z'
  },
  {
    id: 'NOTIF-105',
    user_id: 'USR_TEA_201',
    title: 'New Intervention Required',
    message: 'System recommended intervention for 3 students under your mentorship following Internal Assessment 2.',
    type: 'risk_alert',
    priority: 'high',
    is_read: false,
    link: '/teacher/interventions',
    created_at: '2026-11-16T14:20:00Z'
  },
  {
    id: 'NOTIF-106',
    user_id: 'USR_STU_1024',
    title: 'Personalized Study Plan Generated',
    message: 'Skillora AI generated an adaptive 7-day revision schedule for Data Structures & Algorithms.',
    type: 'recommendation',
    priority: 'medium',
    is_read: false,
    link: '/student/planner',
    created_at: '2026-11-16T18:00:00Z'
  },
  {
    id: 'NOTIF-107',
    user_id: 'USR_STU_1024',
    title: 'Mentoring Session Confirmed',
    message: 'Dr. Sarah Jenkins scheduled an academic counseling review on Nov 20, 2026 at 10:30 AM.',
    type: 'intervention_update',
    priority: 'high',
    is_read: false,
    link: '/student/overview',
    created_at: '2026-11-15T10:15:00Z'
  }
];

// Study Plans (for Student STU1024)
const studyPlans = [
  {
    id: 'STP-901',
    student_id: 'STU1024',
    title: 'Complete Binary Search Tree Visualizer Lab',
    subject: 'Data Structures',
    deadline: '2026-11-19',
    completed: true,
    priority: 'High',
    notes: 'Focus on in-order traversal and balancing rotations'
  },
  {
    id: 'STP-902',
    student_id: 'STU1024',
    title: 'Solve 10 SQL Subquery & Join Practice Problems',
    subject: 'Database Systems',
    deadline: '2026-11-21',
    completed: false,
    priority: 'Normal',
    notes: 'Reference Chapter 5 notes on correlated subqueries'
  },
  {
    id: 'STP-903',
    student_id: 'STU1024',
    title: 'Review Operating Systems Virtual Memory Paging Notes',
    subject: 'Operating Systems',
    deadline: '2026-11-23',
    completed: false,
    priority: 'High',
    notes: 'Prepare summary flashcards for FIFO vs LRU page fault calculations'
  },
  {
    id: 'STP-904',
    student_id: 'STU1024',
    title: 'Draft Project Architecture Diagram for Software Design',
    subject: 'Object Oriented Design',
    deadline: '2026-11-25',
    completed: false,
    priority: 'Normal',
    notes: 'Include UML Class diagram and Design Patterns used'
  }
];

// Institution Settings
const settings = {
  institution_name: 'Skillora Institute of Technology',
  academic_year: '2026-2027',
  current_semester: 'Fall 2026 (Semester 6)',
  attendance_threshold: 75.0,
  academic_warning_gpa: 6.0,
  high_risk_threshold: 65,
  email_alerts_enabled: true,
  sms_alerts_enabled: true,
  model_name: 'Scikit-Learn Random Forest Classifier (v1.2)',
  model_last_retrained: '2026-11-17T10:30:00Z'
};

const fullSeed = {
  users,
  teachers,
  departments,
  students,
  courses: [
    ...coursesByDept['DEP_CS'],
    ...coursesByDept['DEP_AI'],
    ...coursesByDept['DEP_ECE'],
    ...coursesByDept['DEP_IT'],
    ...coursesByDept['DEP_MECH']
  ],
  assessments,
  attendance: attendanceLogs,
  interventions,
  learning_resources: learningResources,
  recommendations,
  notifications,
  study_plans: studyPlans,
  settings
};

const outputPath = path.join(__dirname, '..', 'database', 'seed_data.json');
fs.writeFileSync(outputPath, JSON.stringify(fullSeed, null, 2), 'utf-8');

console.log(`Successfully generated seed data at ${outputPath}`);
console.log(`- Students: ${students.length}`);
console.log(`- Teachers: ${teachers.length}`);
console.log(`- Departments: ${departments.length}`);
console.log(`- Assessments: ${assessments.length}`);
console.log(`- Attendance records: ${attendanceLogs.length}`);
console.log(`- Interventions: ${interventions.length}`);
console.log(`- Recommendations: ${recommendations.length}`);
console.log(`- Notifications: ${notifications.length}`);
console.log(`- Study Plans: ${studyPlans.length}`);
console.log(`Risk Distribution:`);
const riskCounts = students.reduce((acc, s) => {
  acc[s.risk_level] = (acc[s.risk_level] || 0) + 1;
  return acc;
}, {});
console.log(riskCounts);
