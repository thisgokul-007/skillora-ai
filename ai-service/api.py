"""
Skillora AI - FastAPI Machine Learning & Academic Assistant Service
Provides endpoints for student risk prediction, model metrics, batch inferences,
and pedagogical AI assistant interactions.
"""

import os
import json
import numpy as np
import pandas as pd
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib

app = FastAPI(
    title="Skillora AI ML Service",
    description="Intelligent Student Risk Prediction & Learning Analytics Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DIR_PATH = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(DIR_PATH, "model.joblib")
SCALER_PATH = os.path.join(DIR_PATH, "scaler.joblib")
METRICS_PATH = os.path.join(DIR_PATH, "metrics.json")

# Load artifacts
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    with open(METRICS_PATH, "r") as f:
        metrics_data = json.load(f)
    print("AI Model and Metrics loaded successfully.")
except Exception as e:
    print(f"Warning: Model artifacts not found or could not be loaded: {e}")
    model = None
    scaler = None
    metrics_data = {}

class StudentFeatures(BaseModel):
    student_id: Optional[str] = "STU_TEMP"
    student_name: Optional[str] = "Student"
    attendance_percentage: float = Field(..., ge=0, le=100)
    consecutive_absences: int = Field(0, ge=0, le=30)
    internal_assessment_marks: float = Field(..., ge=0, le=100)
    previous_semester_gpa: float = Field(..., ge=0, le=10)
    assignment_submission_rate: float = Field(..., ge=0, le=100)
    learning_engagement_score: float = Field(..., ge=0, le=100)
    academic_backlogs: int = Field(0, ge=0, le=10)

class BatchStudentFeatures(BaseModel):
    students: List[StudentFeatures]

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    student_context: Optional[Dict[str, Any]] = None
    history: Optional[List[ChatMessage]] = []

def analyze_contributing_factors(data: StudentFeatures) -> List[Dict[str, Any]]:
    factors = []
    
    # Attendance
    if data.attendance_percentage < 70:
        factors.append({
            "factor": "Critical Attendance Deficit",
            "impact": "High Negative",
            "detail": f"Current attendance is {data.attendance_percentage:.1f}%, well below the mandatory 75% institutional threshold."
        })
    elif data.attendance_percentage < 80:
        factors.append({
            "factor": "Borderline Attendance",
            "impact": "Moderate Negative",
            "detail": f"Attendance at {data.attendance_percentage:.1f}% requires monitoring to avoid falling below prerequisite requirements."
        })
    else:
        factors.append({
            "factor": "Consistent Attendance",
            "impact": "Positive",
            "detail": f"Strong attendance pattern of {data.attendance_percentage:.1f}% supports positive academic retention."
        })

    # Consecutive Absences
    if data.consecutive_absences >= 4:
        factors.append({
            "factor": "Unexcused Absence Streak",
            "impact": "High Negative",
            "detail": f"{data.consecutive_absences} consecutive missed sessions indicate immediate risk of course disengagement."
        })
    elif data.consecutive_absences >= 2:
        factors.append({
            "factor": "Minor Absence Sequence",
            "impact": "Moderate Negative",
            "detail": f"{data.consecutive_absences} consecutive absences recorded in recent lectures."
        })

    # Internal Assessments
    if data.internal_assessment_marks < 45:
        factors.append({
            "factor": "Low Assessment Scores",
            "impact": "High Negative",
            "detail": f"Internal test average is {data.internal_assessment_marks:.1f}/100, indicating severe foundational comprehension gaps."
        })
    elif data.internal_assessment_marks < 60:
        factors.append({
            "factor": "Below-Average Assessments",
            "impact": "Moderate Negative",
            "detail": f"Internal test score of {data.internal_assessment_marks:.1f}/100 suggests need for guided practice and targeted revision."
        })

    # Backlogs
    if data.academic_backlogs >= 2:
        factors.append({
            "factor": "Multiple Active Backlogs",
            "impact": "High Negative",
            "detail": f"{data.academic_backlogs} unresolved prior semester subjects are compounding workload pressure."
        })
    elif data.academic_backlogs == 1:
        factors.append({
            "factor": "Active Backlog",
            "impact": "Moderate Negative",
            "detail": "1 previous subject backlog pending re-examination."
        })

    # Assignment Submission
    if data.assignment_submission_rate < 60:
        factors.append({
            "factor": "Deficient Assignment Completion",
            "impact": "Moderate Negative",
            "detail": f"Only {data.assignment_submission_rate:.1f}% of continuous coursework submitted on schedule."
        })

    # Learning Engagement
    if data.learning_engagement_score < 40:
        factors.append({
            "factor": "Low Platform Engagement",
            "impact": "Moderate Negative",
            "detail": f"Learning platform activity score is {data.learning_engagement_score:.1f}/100."
        })
        
    return factors

def generate_recommendations(risk_level: str, factors: List[Dict[str, Any]], data: StudentFeatures) -> List[str]:
    recs = []
    if risk_level == "High Risk":
        recs.append("Initiate immediate counselor check-in and faculty advisory intervention.")
        recs.append("Enroll student into structured remedial tutoring for subjects with sub-50% assessment marks.")
        recs.append("Implement automated attendance SMS/Email alerts to student and academic mentor.")
        if data.academic_backlogs > 0:
            recs.append(f"Develop a customized backlog clearance roadmap for the {data.academic_backlogs} pending subject(s).")
    elif risk_level == "Medium Risk":
        recs.append("Schedule bi-weekly academic mentoring check-in with assigned department faculty.")
        recs.append("Provide targeted practice modules and interactive revision quizzes for weaker concepts.")
        recs.append("Monitor attendance trends over the upcoming 14-day cycle.")
        recs.append("Encourage participation in collaborative peer-study groups.")
    else:
        recs.append("Maintain positive learning trajectory and regular continuous assessment performance.")
        recs.append("Offer advanced elective challenge modules or undergraduate research opportunities.")
        recs.append("Encourage student to mentor peers in core subjects where they excel.")
    return recs

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Skillora AI Predictive Engine",
        "model_loaded": model is not None
    }

@app.get("/api/metrics")
def get_metrics():
    if not metrics_data:
        raise HTTPException(status_code=503, detail="Model metrics not available.")
    return metrics_data

@app.post("/api/predict")
def predict_risk(student: StudentFeatures):
    if model is None or scaler is None:
        raise HTTPException(status_code=503, detail="ML model is not loaded. Please run train_model.py first.")
    
    # Feature DataFrame matching training columns
    feature_names = metrics_data.get('features', [
        'attendance_percentage', 'consecutive_absences', 'internal_assessment_marks',
        'previous_semester_gpa', 'assignment_submission_rate', 'learning_engagement_score',
        'academic_backlogs'
    ])
    df_features = pd.DataFrame([[
        student.attendance_percentage,
        student.consecutive_absences,
        student.internal_assessment_marks,
        student.previous_semester_gpa,
        student.assignment_submission_rate,
        student.learning_engagement_score,
        student.academic_backlogs
    ]], columns=feature_names)
    
    scaled = scaler.transform(df_features)
    pred_class_idx = int(model.predict(scaled)[0])
    probabilities = model.predict_proba(scaled)[0]
    
    class_labels = ["Low Risk", "Medium Risk", "High Risk"]
    risk_level = class_labels[pred_class_idx]
    confidence = float(np.max(probabilities))
    
    factors = analyze_contributing_factors(student)
    recommendations = generate_recommendations(risk_level, factors, student)
    
    return {
        "student_id": student.student_id,
        "student_name": student.student_name,
        "risk_level": risk_level,
        "confidence": round(confidence * 100, 1),
        "confidence_score": round(confidence, 4),
        "probabilities": {
            "Low Risk": round(float(probabilities[0]) * 100, 1),
            "Medium Risk": round(float(probabilities[1]) * 100, 1),
            "High Risk": round(float(probabilities[2]) * 100, 1)
        },
        "contributing_factors": factors,
        "recommended_actions": recommendations,
        "disclaimer": "This prediction is an early-warning indicator based on historical academic behavioral patterns, intended for timely mentoring and student support, not as a final academic judgment."
    }

@app.post("/api/batch-predict")
def batch_predict(batch: BatchStudentFeatures):
    results = []
    for s in batch.students:
        res = predict_risk(s)
        results.append(res)
    return {"results": results, "total": len(results)}

@app.post("/api/chat")
def academic_assistant(req: ChatRequest):
    msg = req.message.strip().lower()
    student = req.student_context or {}
    student_name = student.get("name", "Student")
    gpa = student.get("gpa", "N/A")
    attendance = student.get("attendance", "N/A")
    weak_subjects = student.get("weak_subjects", ["Data Structures", "Database Systems"])
    
    # Context-aware intelligent educational assistant response
    if any(k in msg for k in ["study plan", "schedule", "routine", "planner"]):
        content = (
            f"### 📅 Personalized 7-Day Academic Study Plan for {student_name}\n\n"
            f"Based on your current attendance ({attendance}%) and focus areas, here is an optimized spaced-repetition plan:\n\n"
            f"- **Day 1 & 2 (Foundations)**: 45 mins on **{weak_subjects[0] if weak_subjects else 'Core Subject'}** — Focus on algorithmic complexity & pointer manipulation. Solve 3 guided problems.\n"
            f"- **Day 3 (Applied Practice)**: 50 mins on continuous assignment prep. Submit 1 draft early for peer feedback.\n"
            f"- **Day 4 & 5 (Concept Reinforcement)**: 60 mins on **{weak_subjects[1] if len(weak_subjects) > 1 else 'Advanced Topic'}** — Review lecture notes, build a visual summary diagram.\n"
            f"- **Day 6 (Self-Assessment)**: 30-minute timed mock test on recent lecture topics.\n"
            f"- **Day 7 (Rest & Review)**: 20-minute review of flashcards and rest to consolidate memory.\n\n"
            f"💡 *Tip: Study in 25-minute Pomodoro intervals to maximize retention.*"
        )
    elif any(k in msg for k in ["data structure", "array", "linked list", "tree", "graph", "stack", "queue"]):
        content = (
            "### 🌳 Core Computer Science Concept: Data Structures Breakdown\n\n"
            "**Data Structures** organize data for efficient access and modification:\n\n"
            "1. **Arrays & Vectors**: Contiguous memory, $O(1)$ random access, $O(n)$ insertion/deletion.\n"
            "2. **Linked Lists**: Node-based chaining, $O(1)$ dynamic insertions, $O(n)$ sequential search.\n"
            "3. **Hash Tables**: Key-value pairs with near $O(1)$ average lookup using hash functions.\n"
            "4. **Trees & Binary Search Trees (BST)**: Hierarchical data. A balanced BST gives $O(\\log n)$ search, insert, and delete operations.\n\n"
            "**Quick Quiz Question:** *What happens to BST search time complexity if elements are inserted in strictly sorted ascending order?*\n"
            "*(Hint: It degenerates into a singly linked list with $O(n)$ time! Balanced trees like AVL or Red-Black prevent this).* "
        )
    elif any(k in msg for k in ["attendance", "absence", "missed class", "threshold"]):
        content = (
            f"### 📊 Attendance Recovery Strategy\n\n"
            f"Your current attendance is recorded at **{attendance}%**.\n\n"
            "**Steps to stay above institutional threshold (75%):**\n"
            "1. **Never miss lab sessions**: Labs typically carry 2x credit weight in internal assessment criteria.\n"
            "2. **Pre-plan attendance buffer**: Calculate the exact number of remaining lecture hours. Attending the next 6 consecutive sessions will raise your average by ~3.8%.\n"
            "3. **Medical or Official Leave**: Submit verified documentation within 48 hours to the department coordinator."
        )
    elif any(k in msg for k in ["revision", "notes", "summary", "exam"]):
        content = (
            "### 📝 Quick High-Yield Revision Summary\n\n"
            "Here is the active recall blueprint for upcoming midterm assessments:\n\n"
            "1. **The 80/20 Rule**: 80% of test questions stem from high-weightage topics (Theorem proofs, complexity analysis, SQL joins).\n"
            "2. **Feynman Technique**: Explain each concept aloud in plain English without looking at your slides. If you hit a roadblock, reopen the textbook for that specific paragraph.\n"
            "3. **Formula / Schema Sheet**: Keep a 1-page cheat sheet of all formulas and definitions and review it right before sleep."
        )
    elif any(k in msg for k in ["risk", "prediction", "dropout", "score", "why am i"]):
        content = (
            f"### 🛡️ Understanding Academic Risk Assessment\n\n"
            f"Skillora AI assesses learning risk not to penalize, but to **empower you before exams**.\n\n"
            f"- **How it works**: Our Random Forest model evaluates 7 non-judgmental indicators including attendance consistency, assignment completion, and continuous assessments.\n"
            f"- **Your status**: You currently have an average GPA of **{gpa}** with attendance at **{attendance}%**.\n"
            f"- **Recommended Next Step**: Book a quick 10-minute coffee chat with your subject mentor or activate the study modules in 'My Learning Path'."
        )
    else:
        content = (
            f"Hello {student_name}! I am your **Skillora AI Academic Learning Companion**.\n\n"
            "I'm here to support your educational journey. Here are some things you can ask me:\n"
            "- 📚 *'Explain Big-O notation and Time Complexity with examples'*\n"
            "- 📅 *'Generate a 5-day study plan for Database Systems'*\n"
            "- 📝 *'Create a practice quiz on Object-Oriented Programming'*\n"
            "- 💡 *'How can I improve my internal assessment marks?'*\n"
            "- 🎯 *'Explain how my attendance impacts my academic risk score'* \n\n"
            "What would you like to explore or practice right now?"
        )
        
    return {
        "reply": content,
        "sender": "Skillora AI Tutor",
        "timestamp": "Just now",
        "context_applied": bool(student)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
