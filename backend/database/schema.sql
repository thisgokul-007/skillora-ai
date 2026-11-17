-- ====================================================================
-- SKILLORA AI: Database Schema (MySQL 8.0+)
-- AI-Powered Student Success, Personalized Learning & Early Dropout Prevention
-- ====================================================================

CREATE DATABASE IF NOT EXISTS skillora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skillora_db;

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(16) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    hod_name VARCHAR(128) NOT NULL,
    hod_email VARCHAR(128),
    student_count INT DEFAULT 0,
    faculty_count INT DEFAULT 0,
    avg_attendance DECIMAL(5,2) DEFAULT 80.00,
    avg_gpa DECIMAL(4,2) DEFAULT 7.50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(128) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(128) NOT NULL,
    role ENUM('admin', 'teacher', 'student') NOT NULL,
    avatar_url VARCHAR(255),
    department_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- 3. Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE,
    employee_id VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL,
    department_id VARCHAR(36),
    designation VARCHAR(64) DEFAULT 'Assistant Professor',
    phone VARCHAR(32),
    assigned_students_count INT DEFAULT 0,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- 4. Students Table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE,
    student_id VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL,
    department_id VARCHAR(36) NOT NULL,
    academic_year VARCHAR(32) NOT NULL,
    semester INT NOT NULL,
    current_gpa DECIMAL(4,2) DEFAULT 0.00,
    attendance_percentage DECIMAL(5,2) DEFAULT 0.00,
    consecutive_absences INT DEFAULT 0,
    internal_assessment_marks DECIMAL(5,2) DEFAULT 0.00,
    assignment_submission_rate DECIMAL(5,2) DEFAULT 0.00,
    learning_engagement_score DECIMAL(5,2) DEFAULT 0.00,
    academic_backlogs INT DEFAULT 0,
    risk_level ENUM('Low Risk', 'Medium Risk', 'High Risk') DEFAULT 'Low Risk',
    risk_confidence DECIMAL(5,2) DEFAULT 0.00,
    teacher_id VARCHAR(36),
    phone VARCHAR(32),
    status ENUM('Active', 'Academic Warning', 'Mentorship Active', 'On Leave') DEFAULT 'Active',
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

-- 5. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    department_id VARCHAR(36) NOT NULL,
    semester INT NOT NULL,
    credits INT DEFAULT 3,
    teacher_id VARCHAR(36),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

-- 6. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    course_code VARCHAR(32) NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Excused') NOT NULL,
    recorded_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 7. Assessments Table
CREATE TABLE IF NOT EXISTS assessments (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    course_code VARCHAR(32) NOT NULL,
    assessment_type VARCHAR(64) NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    max_marks DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    date DATE NOT NULL,
    remarks VARCHAR(255),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 8. Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    course_code VARCHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    submission_status ENUM('Submitted', 'Pending', 'Late') DEFAULT 'Pending',
    marks_obtained DECIMAL(5,2) DEFAULT NULL,
    max_marks DECIMAL(5,2) DEFAULT 100.00,
    submitted_at DATETIME DEFAULT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 9. Learning Resources Table
CREATE TABLE IF NOT EXISTS learning_resources (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(128) NOT NULL,
    topic VARCHAR(128) NOT NULL,
    difficulty ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Intermediate',
    estimated_time VARCHAR(64) NOT NULL,
    resource_url VARCHAR(255) NOT NULL,
    type ENUM('Video', 'Interactive Lab', 'Reading', 'Quiz', 'Practice Sheet') DEFAULT 'Reading',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    subject VARCHAR(128) NOT NULL,
    topic VARCHAR(128) NOT NULL,
    reason TEXT NOT NULL,
    difficulty ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Intermediate',
    estimated_time VARCHAR(64) NOT NULL,
    resource_url VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 11. Interventions Table
CREATE TABLE IF NOT EXISTS interventions (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    teacher_id VARCHAR(36) NOT NULL,
    category ENUM('Attendance Support', 'Academic Mentoring', 'Subject Improvement', 'Assignment Support', 'Learning Engagement', 'General Student Guidance') NOT NULL,
    priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
    status ENUM('Pending', 'In Progress', 'Follow-up Required', 'Completed') DEFAULT 'Pending',
    notes TEXT,
    action_plan TEXT,
    scheduled_followup DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

-- 12. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('risk_alert', 'attendance_warning', 'academic_drop', 'assignment_due', 'recommendation', 'intervention_update', 'system') NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 13. Study Plans Table
CREATE TABLE IF NOT EXISTS study_plans (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(128) NOT NULL,
    deadline DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    priority ENUM('Normal', 'High') DEFAULT 'Normal',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 14. Chat History Table
CREATE TABLE IF NOT EXISTS chat_history (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    role ENUM('user', 'assistant') NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 15. Institution Settings Table
CREATE TABLE IF NOT EXISTS institution_settings (
    id VARCHAR(36) PRIMARY KEY,
    institution_name VARCHAR(255) DEFAULT 'Skillora Institute of Technology',
    attendance_threshold DECIMAL(5,2) DEFAULT 75.00,
    academic_warning_gpa DECIMAL(4,2) DEFAULT 6.00,
    high_risk_threshold INT DEFAULT 65,
    email_alerts_enabled BOOLEAN DEFAULT TRUE,
    sms_alerts_enabled BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for high-speed queries
CREATE INDEX idx_students_dept ON students(department_id);
CREATE INDEX idx_students_risk ON students(risk_level);
CREATE INDEX idx_students_teacher ON students(teacher_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_interventions_student ON interventions(student_id);
CREATE INDEX idx_interventions_status ON interventions(status);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
