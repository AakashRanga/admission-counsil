import datetime
from typing import List, Optional
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db
import models
import schemas

# Initial Seed Users for Different System Roles
INITIAL_ROLE_USERS = [
    {
        "name": "Student Affairs",
        "email": "council@simats.edu",
        "hashed_password": "council123",
        "role": "student_council",
        "department": "Student Affairs Desk"
    },
    {
        "name": "Academic",
        "email": "academic@simats.edu",
        "hashed_password": "academic123",
        "role": "ad_academic",
        "department": "Associate Dean Academic"
    },
    {
        "name": "Maintenance",
        "email": "estate@simats.edu",
        "hashed_password": "estate123",
        "role": "ad_maintenance",
        "department": "Associate Dean Maintenance"
    },
    {
        "name": "Associate Dean",
        "email": "welfare@simats.edu",
        "hashed_password": "welfare123",
        "role": "ad_students",
        "department": "Associate Dean Student Welfare"
    },
    {
        "name": "Super Admin",
        "email": "admin@simats.edu",
        "hashed_password": "admin123",
        "role": "admin",
        "department": "Executive Operations"
    }
]

INITIAL_GRIEVANCES = []

INITIAL_DEPARTMENTS = [
    {"id": "dept-1", "name": "Computer Science & Engineering", "code": "CSE", "head_name": "Dr. Aris Thorne"},
    {"id": "dept-2", "name": "Electrical & Electronics Eng.", "code": "EEE", "head_name": "Dr. Elena Vance"},
    {"id": "dept-3", "name": "Mechanical Engineering", "code": "MECH", "head_name": "Prof. Marcus Vance"},
    {"id": "dept-4", "name": "Biotechnology & Bioengineering", "code": "BIO", "head_name": "Dr. Sophia Lin"},
    {"id": "dept-5", "name": "School of Architecture & Design", "code": "ARCH", "head_name": "Prof. David Miller"},
    {"id": "dept-6", "name": "School of Management & Business", "code": "SMB", "head_name": "Dr. Rachel Green"}
]

INITIAL_AUDIT_LOGS = [
    {
        "id": "log-101",
        "action": "CREATE_COMPLAINT",
        "performed_by": "Siddharth Rao (Student Council)",
        "role": "student_council",
        "target_id": "GRV-2026-101",
        "timestamp": "2026-07-23 09:00:15",
        "details": "Registered Academic Complaint for Mechanical Lab Timetable clash."
    },
    {
        "id": "log-102",
        "action": "ASSIGN_STAFF",
        "performed_by": "Eng. Rajesh Verma (AD Maintenance)",
        "role": "ad_maintenance",
        "target_id": "GRV-2026-102",
        "timestamp": "2026-07-22 13:30:00",
        "details": "Assigned NetOps Team - Tech Alok to Wi-Fi issue in Library 2nd Floor."
    },
    {
        "id": "log-103",
        "action": "VERIFY_RESOLUTION",
        "performed_by": "Prof. Ananya Roy (AD Students)",
        "role": "ad_students",
        "target_id": "GRV-2026-105",
        "timestamp": "2026-07-22 17:10:00",
        "details": "Verified repair with student feedback (5 stars) and closed grievance."
    },
    {
        "id": "log-104",
        "action": "UPDATE_STATUS",
        "performed_by": "Dr. Ramesh Kumar (AD Academic)",
        "role": "ad_academic",
        "target_id": "GRV-2026-103",
        "timestamp": "2026-07-22 18:45:00",
        "details": "Marked grade dispute ticket under active investigation."
    }
]

from sqlalchemy import text

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Migrates tables every time app.py runs and seeds default role users, grievances, departments, and audit logs into academic_council DB."""
    print("[*] Running table auto-migrations for database: academic_council")
    Base.metadata.create_all(bind=engine)
    
    # Auto-migrate missing columns for existing MySQL table 'grievances'
    with engine.connect() as conn:
        for col_name, col_type in [
            ("assigned_staff_name", "VARCHAR(100) NULL"),
            ("assigned_staff_mobile", "VARCHAR(30) NULL"),
            ("special_instructions", "TEXT NULL"),
            ("rating", "INT NULL"),
            ("satisfied", "TINYINT(1) NULL"),
            ("feedback_comments", "TEXT NULL"),
            ("final_remarks", "TEXT NULL"),
            ("closed_at", "VARCHAR(100) NULL")
        ]:
            try:
                conn.execute(text(f"ALTER TABLE grievances ADD COLUMN {col_name} {col_type}"))
                conn.commit()
                print(f"[*] Auto-migrated: Added column '{col_name}' to MySQL grievances table.")
            except Exception:
                pass

    db = next(get_db())
    try:
        for seed_user in INITIAL_ROLE_USERS:
            existing = db.query(models.User).filter(models.User.email == seed_user["email"]).first()
            if not existing:
                user_obj = models.User(**seed_user)
                db.add(user_obj)
        
        # Seed grievances if database table is empty
        if db.query(models.Grievance).count() == 0:
            for seed_grv in INITIAL_GRIEVANCES:
                grv_obj = models.Grievance(**seed_grv)
                db.add(grv_obj)
            print("[*] Auto-seed complete: Initial grievance tickets inserted into MySQL Workbench academic_council database.")

        # Seed departments if database table is empty
        if db.query(models.Department).count() == 0:
            for seed_dept in INITIAL_DEPARTMENTS:
                dept_obj = models.Department(**seed_dept)
                db.add(dept_obj)
            print("[*] Auto-seed complete: Initial departments inserted into MySQL Workbench academic_council database.")

        # Seed audit logs if database table is empty
        if db.query(models.AuditLog).count() == 0:
            for seed_log in INITIAL_AUDIT_LOGS:
                log_obj = models.AuditLog(**seed_log)
                db.add(log_obj)
            print("[*] Auto-seed complete: Initial audit logs inserted into MySQL Workbench academic_council database.")
        
        db.commit()
        print("[*] Auto-seed complete: Role users, grievances, departments & audit logs verified in database.")
    except Exception as e:
        print(f"[!] Error during database seeding: {e}")
        db.rollback()
    finally:
        db.close()
    yield


app = FastAPI(
    title="SIMATS Academic Council ERP Backend API",
    description="FastAPI Backend connected to MySQL Workbench (academic_council database)",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Frontend Development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "SIMATS Academic Council FastAPI Server Connected to MySQL Workbench (academic_council)",
        "docs": "/docs"
    }

@app.api_route("/api/health", methods=["GET", "HEAD"])
def health_check():
    return {"status": "ok", "database": "academic_council"}

# Authentication Endpoint
@app.post("/api/login", response_model=schemas.TokenResponse)
def login(req: schemas.LoginRequest, db: Session = Depends(get_db)):
    if not req.email or not req.email.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address is required."
        )
    
    if not req.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is required."
        )

    # Query user by email
    user = db.query(models.User).filter(models.User.email == req.email.strip()).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email. User not registered in system."
        )
    
    if user.hashed_password != req.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password. Please check your credentials."
        )

    return {
        "access_token": f"bearer-token-{user.id}-{user.role}",
        "token_type": "bearer",
        "user": user
    }


@app.get("/api/users", response_model=List[schemas.UserResponse])
def get_authority_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.post("/api/users", response_model=schemas.UserResponse)
def create_authority_user(req: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == req.email.strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with email '{req.email}' already exists."
        )
    user_obj = models.User(
        name=req.name,
        email=req.email.strip(),
        hashed_password=req.password,
        role=req.role,
        department=req.department
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj

@app.get("/api/departments", response_model=List[schemas.DepartmentResponse])
def get_departments(db: Session = Depends(get_db)):
    return db.query(models.Department).all()

@app.post("/api/departments", response_model=schemas.DepartmentResponse)
def create_department(req: schemas.DepartmentCreate, db: Session = Depends(get_db)):
    count = db.query(models.Department).count()
    new_id = f"dept-{count + 1}"
    dept_obj = models.Department(
        id=new_id,
        name=req.name,
        code=req.code.upper(),
        head_name=req.head_name
    )
    db.add(dept_obj)
    db.commit()
    db.refresh(dept_obj)
    return dept_obj

@app.get("/api/audit-logs", response_model=List[schemas.AuditLogResponse])
def get_audit_logs(db: Session = Depends(get_db)):
    return db.query(models.AuditLog).order_by(models.AuditLog.created_at.desc()).all()

@app.post("/api/audit-logs", response_model=schemas.AuditLogResponse)
def create_audit_log(req: schemas.AuditLogCreate, db: Session = Depends(get_db)):
    count = db.query(models.AuditLog).count()
    new_id = f"log-{100 + count + 1}"
    log_obj = models.AuditLog(
        id=new_id,
        action=req.action,
        performed_by=req.performed_by,
        role=req.role,
        target_id=req.target_id,
        timestamp=req.timestamp,
        details=req.details
    )
    db.add(log_obj)
    db.commit()
    db.refresh(log_obj)
    return log_obj

def get_next_grievance_id(db: Session) -> str:
    all_ids = db.query(models.Grievance.id).all()
    max_num = 100
    for (g_id,) in all_ids:
        if g_id and g_id.startswith("GRV-2026-"):
            try:
                num = int(g_id.split("-")[-1])
                if num > max_num:
                    max_num = num
            except ValueError:
                pass
    return f"GRV-2026-{max_num + 1}"

@app.get("/api/issues", response_model=List[schemas.GrievanceResponse])
def get_grievances(db: Session = Depends(get_db)):
    return db.query(models.Grievance).all()

DEPARTMENT_ALIASES_PY = {
    'cse': 'Computer Science & Engineering',
    'computer science': 'Computer Science & Engineering',
    'computer science & engineering': 'Computer Science & Engineering',
    'computer science and engineering': 'Computer Science & Engineering',
    'dept of cse': 'Computer Science & Engineering',
    'eee': 'Electrical & Electronics Eng.',
    'electrical': 'Electrical & Electronics Eng.',
    'electrical & electronics engineering': 'Electrical & Electronics Eng.',
    'ece': 'Electronics & Communication Eng.',
    'electronics': 'Electronics & Communication Eng.',
    'mech': 'Mechanical Engineering',
    'mechanical': 'Mechanical Engineering',
    'mechanical engineering': 'Mechanical Engineering',
    'bio': 'Biotechnology & Bioengineering',
    'biotech': 'Biotechnology & Bioengineering',
    'biotechnology': 'Biotechnology & Bioengineering',
    'arch': 'School of Architecture & Design',
    'architecture': 'School of Architecture & Design',
    'smb': 'School of Management & Business',
    'management': 'School of Management & Business',
    'business': 'School of Management & Business'
}

def normalize_dept_name(raw: str) -> str:
    if not raw:
        return "Computer Science & Engineering"
    clean = raw.lower().strip()
    return DEPARTMENT_ALIASES_PY.get(clean, raw.strip())

@app.post("/api/issues", response_model=schemas.GrievanceResponse)
@app.post("/api/issues/single", response_model=schemas.GrievanceResponse)
def create_single_grievance(item: schemas.GrievanceCreate, db: Session = Depends(get_db)):
    new_id = get_next_grievance_id(db)
    item_dict = item.model_dump()
    if item_dict.get("department"):
        item_dict["department"] = normalize_dept_name(item_dict["department"])
    db_item = models.Grievance(id=new_id, **item_dict)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.post("/api/issues/bulk", response_model=schemas.BulkGrievanceResponse)
def create_bulk_grievances(payload: schemas.BulkGrievanceCreate, db: Session = Depends(get_db)):
    created_items = []
    
    for item in payload.items:
        new_id = get_next_grievance_id(db)
        item_dict = item.model_dump()
        if item_dict.get("department"):
            item_dict["department"] = normalize_dept_name(item_dict["department"])
        db_item = models.Grievance(id=new_id, **item_dict)
        db.add(db_item)
        db.flush()
        created_items.append(db_item)
    
    db.commit()
    for db_item in created_items:
        db.refresh(db_item)

    return {
        "status": "success",
        "count": len(created_items),
        "items": created_items
    }

@app.put("/api/issues/{issue_id}/assign", response_model=schemas.GrievanceResponse)
def assign_staff_to_grievance(issue_id: str, payload: schemas.AssignStaffRequest, db: Session = Depends(get_db)):
    grv = db.query(models.Grievance).filter(models.Grievance.id == issue_id).first()
    if not grv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Grievance with ID '{issue_id}' not found."
        )

    grv.assigned_staff_name = payload.assigned_staff_name
    grv.assigned_staff_mobile = payload.assigned_staff_mobile
    grv.special_instructions = payload.special_instructions
    if grv.status == "pending":
        grv.status = "assigned"

    db.commit()
    db.refresh(grv)
    return grv

@app.put("/api/issues/{issue_id}/status", response_model=schemas.GrievanceResponse)
def update_grievance_status(issue_id: str, payload: schemas.UpdateStatusRequest, db: Session = Depends(get_db)):
    grv = db.query(models.Grievance).filter(models.Grievance.id == issue_id).first()
    if not grv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Grievance with ID '{issue_id}' not found."
        )

    grv.status = payload.status
    if payload.remarks:
        if grv.remarks:
            grv.remarks = f"{grv.remarks} | {payload.remarks}"
        else:
            grv.remarks = payload.remarks

    db.commit()
    db.refresh(grv)
    return grv


@app.put("/api/issues/{issue_id}/verify", response_model=schemas.GrievanceResponse)
def verify_grievance_resolution(issue_id: str, payload: schemas.VerifyResolutionRequest, db: Session = Depends(get_db)):
    grv = db.query(models.Grievance).filter(models.Grievance.id == issue_id).first()
    if not grv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Grievance with ID '{issue_id}' not found."
        )

    grv.status = payload.status
    if payload.rating is not None:
        grv.rating = payload.rating
    if payload.satisfied is not None:
        grv.satisfied = payload.satisfied
    if payload.feedback_comments is not None:
        grv.feedback_comments = payload.feedback_comments
    if payload.final_remarks is not None:
        grv.final_remarks = payload.final_remarks

    if payload.status == "resolved":
        grv.closed_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    elif payload.status == "reopened":
        grv.closed_at = None

    db.commit()
    db.refresh(grv)
    return grv


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

