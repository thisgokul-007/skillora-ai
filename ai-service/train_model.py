"""
Skillora AI - Machine Learning Pipeline
Trains a Random Forest Classifier to predict Academic Risk Level (Low, Medium, High)
based on multi-dimensional academic, attendance, and behavioral indicators.
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
import joblib

def generate_synthetic_dataset(num_samples=3000, random_state=42):
    np.random.seed(random_state)
    
    # 1. Attendance percentage (normally distributed around 78% with variance)
    attendance = np.clip(np.random.normal(loc=76, scale=14, size=num_samples), 35, 100)
    
    # 2. Consecutive absences (correlated negatively with attendance)
    consecutive_absences = np.clip(
        np.round((100 - attendance) / 10 + np.random.poisson(lam=1.2, size=num_samples)),
        0, 15
    ).astype(int)
    
    # 3. Internal assessment marks (out of 100)
    internal_assessment = np.clip(
        0.5 * attendance + np.random.normal(loc=32, scale=12, size=num_samples),
        20, 98
    )
    
    # 4. Previous semester GPA (0.0 to 10.0 scale)
    gpa = np.clip(
        0.06 * internal_assessment + 0.03 * attendance + np.random.normal(loc=0.5, scale=0.8, size=num_samples),
        2.5, 9.9
    )
    
    # 5. Assignment submission rate (0 to 100%)
    assignment_rate = np.clip(
        0.6 * attendance + 0.3 * (gpa * 10) + np.random.normal(loc=5, scale=10, size=num_samples),
        25, 100
    )
    
    # 6. Learning engagement score (0 to 100, LMS platform interactions & time spent)
    engagement_score = np.clip(
        0.4 * assignment_rate + 0.4 * attendance + np.random.normal(loc=10, scale=12, size=num_samples),
        15, 100
    )
    
    # 7. Academic backlogs (0 to 5 courses)
    backlog_prob = np.clip((100 - internal_assessment) / 100 * 0.7 + (consecutive_absences / 15) * 0.3, 0.05, 0.95)
    backlogs = np.random.binomial(n=4, p=backlog_prob, size=num_samples)
    
    # Ground truth risk scoring formula to simulate real student attrition patterns
    # Higher score = higher risk
    risk_score = (
        (100 - attendance) * 0.28 +
        consecutive_absences * 2.5 +
        (100 - internal_assessment) * 0.25 +
        (10 - gpa) * 3.5 +
        (100 - assignment_rate) * 0.20 +
        (100 - engagement_score) * 0.15 +
        backlogs * 6.0 +
        np.random.normal(0, 3.5, size=num_samples)
    )
    
    # Thresholding for 3 classes: Low, Medium, High
    # Low: score < 42, Medium: 42 <= score < 64, High: score >= 64
    labels = []
    for score in risk_score:
        if score < 42:
            labels.append(0)  # Low Risk
        elif score < 64:
            labels.append(1)  # Medium Risk
        else:
            labels.append(2)  # High Risk
            
    df = pd.DataFrame({
        'attendance_percentage': attendance,
        'consecutive_absences': consecutive_absences,
        'internal_assessment_marks': internal_assessment,
        'previous_semester_gpa': gpa,
        'assignment_submission_rate': assignment_rate,
        'learning_engagement_score': engagement_score,
        'academic_backlogs': backlogs,
        'risk_label': labels
    })
    
    return df

def train_and_evaluate():
    print("Generating synthetic institutional dataset...")
    df = generate_synthetic_dataset(num_samples=3500)
    
    feature_cols = [
        'attendance_percentage',
        'consecutive_absences',
        'internal_assessment_marks',
        'previous_semester_gpa',
        'assignment_submission_rate',
        'learning_engagement_score',
        'academic_backlogs'
    ]
    
    X = df[feature_cols]
    y = df['risk_label']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=150,
        max_depth=10,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        class_weight='balanced'
    )
    model.fit(X_train_scaled, y_train)
    
    # Predictions
    y_pred = model.predict(X_test_scaled)
    y_pred_proba = model.predict_proba(X_test_scaled)
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average='weighted')
    rec = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    feature_importance_dict = dict(zip(feature_cols, model.feature_importances_.round(4).tolist()))
    
    # Class distribution in test set
    class_names = ["Low Risk", "Medium Risk", "High Risk"]
    
    metrics = {
        "accuracy": round(float(acc), 4),
        "precision": round(float(prec), 4),
        "recall": round(float(rec), 4),
        "f1_score": round(float(f1), 4),
        "confusion_matrix": {
            "matrix": cm,
            "labels": class_names
        },
        "feature_importances": feature_importance_dict,
        "sample_count": len(df),
        "test_count": len(X_test),
        "model_type": "Random Forest Classifier (Scikit-Learn)",
        "features": feature_cols,
        "class_labels": class_names
    }
    
    # Save artifacts
    output_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(output_dir, "model.joblib")
    scaler_path = os.path.join(output_dir, "scaler.joblib")
    metrics_path = os.path.join(output_dir, "metrics.json")
    
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)
        
    print(f"Model saved to {model_path}")
    print(f"Metrics saved to {metrics_path}")
    print(f"Accuracy: {acc:.4f}, Precision: {prec:.4f}, Recall: {rec:.4f}, F1: {f1:.4f}")
    print("Confusion Matrix:")
    print(cm)
    print("Feature Importances:")
    for k, v in feature_importance_dict.items():
        print(f"  {k}: {v}")

if __name__ == "__main__":
    train_and_evaluate()
