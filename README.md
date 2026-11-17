# Skillora AI 🎓⚡
### AI-Powered Student Success, Personalized Learning & Early Dropout Prevention Platform

> **"Every Student. Every Potential. Every Opportunity."**

Skillora AI is an enterprise educational intelligence SaaS platform engineered for colleges, universities, and polytechnics. It unifies multi-dimensional academic records, continuous attendance logs, and machine learning risk classifiers to predict dropout risks weeks before midterm exams and deliver targeted personalized mentoring.

---

## 🌟 Key Innovations & Architecture

- **Machine Learning Dropout Predictor (Scikit-Learn Random Forest Classifier)**:
  - **88.14% Accuracy**, **88.41% Precision**, **88.14% Recall**, **88.21% F1-Score**.
  - Evaluates 7 core academic and behavioral indicators:
    1. `attendance_percentage` (24.9% Gini weight)
    2. `previous_semester_gpa` (18.3% Gini weight)
    3. `internal_assessment_marks` (14.1% Gini weight)
    4. `assignment_submission_rate` (14.0% Gini weight)
    5. `academic_backlogs` (11.8% Gini weight)
    6. `consecutive_absences` (10.0% Gini weight)
    7. `learning_engagement_score` (6.9% Gini weight)
  - Full **3x3 Confusion Matrix** and **Interactive "What-If" Risk Simulator** in UI.
- **Interconnected Multi-Role Portals**:
  - **Administrator Command Center**: Institutional KPI cards, interactive line/area/bar charts, department comparisons, early-warning alert rosters, AI insight digests, and regulatory accreditation reports.
  - **Teacher / Faculty Workspace**: Assigned mentee surveillance, live lecture attendance marking register, assessment marks entry with automated ML recalculation, and intervention case management.
  - **Student Personalized Learning Portal**: Constructive support indicators, personal attendance & GPA trackers, adaptive learning paths, milestone study planner (with confetti rewards), and AI Academic Companion.
- **AI Academic Assistant**:
  - Context-aware tutor for study planning, conceptual explanations (e.g. Data Structures, BSTs, Big-O), formula sheets, and exam revision.
- **Persistent Data Tier**:
  - Full MySQL 8.0 schema (`backend/database/schema.sql`) with foreign keys, indexes, and zero-config local persistent storage adapter (`data_store.json`) seeded with 150 realistic students, 10 faculty members, 5 departments, 1,200 assessments, and 1,650 attendance logs.

---

## 🚀 Instant 1-Click Demo Credentials

You can log in directly using the 1-click demo role switcher on the login screen or top navigation bar, or enter these credentials:

| Role | Email | Password | Persona & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@skillora.ai` | `admin123` | Dr. Arthur Vance (Dean of Academics) - Institutional overview & governance |
| **Teacher / Faculty** | `sarah.jenkins@skillora.ai` | `teacher123` | Dr. Sarah Jenkins (Associate Professor, CSE) - Mentee oversight & marks entry |
| **Student** | `alex.rivera@student.skillora.ai` | `student123` | Alex Rivera (STU1024, Semester 6) - Learning roadmap & study planner |

---

## 🛠️ Project Structure

```text
skillora-ai/
├── ai-service/                  # Python FastAPI & Scikit-Learn Machine Learning Service
│   ├── train_model.py           # Reproducible ML training pipeline (3,500 samples)
│   ├── model.joblib             # Serialized Random Forest Classifier
│   ├── scaler.joblib            # StandardScaler feature normalization artifact
│   ├── metrics.json             # Model evaluation metrics & 3x3 confusion matrix
│   └── api.py                   # FastAPI prediction, metrics, and chat endpoints (Port 8000)
│
├── backend/                     # Node.js & Express.js REST API Server (Port 5000)
│   ├── database/
│   │   ├── schema.sql           # MySQL 8.0 production DDL schema
│   │   ├── db.js                # Database abstraction layer (MySQL & Persistent Store)
│   │   ├── seed_data.json       # 150 students, 10 faculty, 5 depts, 1,200 assessments
│   │   └── data_store.json      # Persistent local store (updated upon mutations)
│   ├── scripts/
│   │   └── generate_seed.js     # Deterministic realistic seed generator
│   ├── server.js                # Express API with JWT auth, CRUD, CSV import/export
│   ├── package.json
│   └── .env.example
│
└── frontend/                    # Modern React 19 + Vite 8 + Tailwind CSS 4 Application (Port 3000)
    ├── src/
    │   ├── api/client.js        # Axios client with JWT interceptors & proxy config
    │   ├── context/
    │   │   └── AuthContext.jsx  # Auth state, theme (light/dark), and global filters
    │   ├── components/layout/   # TopNav, Sidebar (12 modules), Admin/Teacher/Student layouts
    │   ├── pages/
    │   │   ├── auth/            # Split-screen Login with 1-click demo access
    │   │   ├── admin/           # Overview, Directory, Profile, AI Risk, Academics, Attendance...
    │   │   ├── teacher/         # TeacherOverview, Mentees, Attendance Marking, Marks Entry...
    │   │   └── student/         # StudentOverview, Learning Path, Study Planner, AI Assistant...
    │   ├── App.jsx              # Role-protected routing engine
    │   ├── index.css            # Tailwind theme, typography, dark mode, glass cards
    │   └── main.jsx
    ├── vite.config.js
    └── package.json
```

---

## ⚡ Setup & Execution Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **Python**: v3.10+ (tested on Python 3.14)
- **MySQL** *(Optional)*: If running with MySQL, import `backend/database/schema.sql` and set credentials in `.env`. By default, Skillora AI runs seamlessly with the zero-config persistent store!

### 2. Quick Start Commands

#### A. Start the AI Service (Port 8000)
```powershell
cd skillora-ai/ai-service
python -m uvicorn api:app --host 127.0.0.1 --port 8000
```

#### B. Start the Express Backend (Port 5000)
```powershell
cd skillora-ai/backend
node server.js
```

#### C. Start the Frontend (Port 3000)
```powershell
cd skillora-ai/frontend
npm run dev
```

Open your browser to: **`http://localhost:3000`**

---

## 📊 Model Evaluation Summary

```json
{
  "model_type": "Random Forest Classifier (Scikit-Learn)",
  "accuracy": 0.8814,
  "precision": 0.8841,
  "recall": 0.8814,
  "f1_score": 0.8821,
  "confusion_matrix": [
    [215, 26, 0],
    [14, 241, 18],
    [0, 25, 161]
  ],
  "feature_importances": {
    "attendance_percentage": 0.2495,
    "previous_semester_gpa": 0.1830,
    "internal_assessment_marks": 0.1409,
    "assignment_submission_rate": 0.1401,
    "academic_backlogs": 0.1181,
    "consecutive_absences": 0.0995,
    "learning_engagement_score": 0.0690
  }
}
```

---

## 🔒 Security & Privacy Notice
Predictions generated by Skillora AI are **early-warning pedagogical indicators** designed to assist academic mentors in providing timely tutoring and counseling. They are non-punitive and compliant with student privacy best practices.
