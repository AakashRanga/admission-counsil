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
        "name": "Priya Nambiar",
        "email": "council@simats.edu",
        "hashed_password": "council123",
        "role": "student_council",
        "department": "Student Affairs Desk"
    },
    {
        "name": "Dr. K. S. Sundaram",
        "email": "academic@simats.edu",
        "hashed_password": "academic123",
        "role": "ad_academic",
        "department": "Associate Dean Academic"
    },
    {
        "name": "Er. Rajesh V.",
        "email": "estate@simats.edu",
        "hashed_password": "estate123",
        "role": "ad_maintenance",
        "department": "Associate Dean Maintenance"
    },
    {
        "name": "Dr. Ananya R.",
        "email": "welfare@simats.edu",
        "hashed_password": "welfare123",
        "role": "ad_students",
        "department": "Associate Dean Student Welfare"
    },
    {
        "name": "Prof. M. Ramachandran",
        "email": "admin@simats.edu",
        "hashed_password": "admin123",
        "role": "admin",
        "department": "Executive Operations"
    }
]

INITIAL_GRIEVANCES = [
    {
        "id": "GRV-2026-101",
        "type": "academic",
        "title": "Semester 4 Data Structures Internal Marks Dispute",
        "student_id": "2024CSE042",
        "student_name": "Aakash Ranga",
        "department": "Computer Science & Engineering",
        "mobile": "+91 98765 43210",
        "category": "Grade & Attendance Appeal",
        "description": "Mismatch in internal assessment 2 marks recorded in portal vs corrected physical answer paper.",
        "remarks": "Verified physical sheet with HOD.",
        "status": "pending",
        "subject": "Data Structures & Algorithms",
        "faculty_name": "Dr. S. K. Raman",
        "course": "B.Tech CSE"
    },
    {
        "id": "GRV-2026-102",
        "type": "maintenance",
        "title": "Block B 3rd Floor Lab Air Conditioner Leakage",
        "student_id": "2024ECE118",
        "student_name": "Kavitha S.",
        "department": "Electrical & Electronics Engineering",
        "mobile": "+91 98765 12345",
        "category": "HVAC & Electrical Repair",
        "description": "Water dripping over Server Rack 3 from AC unit #4 causing potential electrical hazard.",
        "remarks": "Estate team dispatched.",
        "status": "assigned",
        "building": "Block B - Tech Center",
        "floor": "3rd Floor",
        "room_number": "Lab 304",
        "location": "Near East Stairwell"
    },
    {
        "id": "GRV-2026-103",
        "type": "academic",
        "title": "Medical Attendance Exemption Appeal for Sports Tournament",
        "student_id": "2024MEC089",
        "student_name": "Rahul Varma",
        "department": "Mechanical Engineering",
        "mobile": "+91 98400 11223",
        "category": "Attendance Duty Leave",
        "description": "Attended Inter-University Football Tournament from July 10-15. Certificate attached for attendance credit.",
        "remarks": "Pending Dean approval.",
        "status": "investigating",
        "subject": "Fluid Mechanics",
        "faculty_name": "Prof. P. N. Rao",
        "course": "B.Tech Mechanical"
    },
    {
        "id": "GRV-2026-104",
        "type": "maintenance",
        "title": "Main Library 2nd Floor WiFi Router Frequent Disconnection",
        "student_id": "2024CIV055",
        "student_name": "Deepa N.",
        "department": "Civil Engineering",
        "mobile": "+91 97100 99887",
        "category": "Network & Wi-Fi",
        "description": "Wi-Fi access point AP-LIB-02 dropping connection every 15 minutes during peak study hours.",
        "remarks": "IT team investigating router logs.",
        "status": "work_started",
        "building": "Central Library",
        "floor": "2nd Floor",
        "room_number": "Digital Library Bay A",
        "location": "Central Corridor"
    },
    {
        "id": "GRV-2026-105",
        "type": "academic",
        "title": "Elective Allocation Change Request - AI vs Cybersecurity",
        "student_id": "2024CSE190",
        "student_name": "Sanjay Kumar",
        "department": "Computer Science & Engineering",
        "mobile": "+91 96000 55443",
        "category": "Elective Allocation",
        "description": "Allocated Open Elective 2 incorrectly due to portal glitch during registration window.",
        "remarks": "Resolved and updated in ERP portal.",
        "status": "resolved",
        "subject": "Artificial Intelligence",
        "faculty_name": "Dr. Meenakshi R.",
        "course": "B.Tech CSE"
    }
]

from sqlalchemy import text

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Migrates tables every time app.py runs and seeds default role users and grievances into academic_council DB."""
    print("[*] Running table auto-migrations for database: academic_council")
    Base.metadata.create_all(bind=engine)
    
    # Auto-migrate missing columns for existing MySQL table 'grievances'
    with engine.connect() as conn:
        for col_name, col_type in [
            ("assigned_staff_name", "VARCHAR(100) NULL"),
            ("assigned_staff_mobile", "VARCHAR(30) NULL"),
            ("special_instructions", "TEXT NULL")
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
        
        db.commit()
        print("[*] Auto-seed complete: Role users & grievances verified in database.")
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

@app.get("/api/issues", response_model=List[schemas.GrievanceResponse])
def get_grievances(db: Session = Depends(get_db)):
    return db.query(models.Grievance).all()

@app.post("/api/issues", response_model=schemas.GrievanceResponse)
@app.post("/api/issues/single", response_model=schemas.GrievanceResponse)
def create_single_grievance(item: schemas.GrievanceCreate, db: Session = Depends(get_db)):
    current_count = db.query(models.Grievance).count()
    new_id = f"GRV-2026-{100 + current_count + 1}"
    db_item = models.Grievance(id=new_id, **item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.post("/api/issues/bulk", response_model=schemas.BulkGrievanceResponse)
def create_bulk_grievances(payload: schemas.BulkGrievanceCreate, db: Session = Depends(get_db)):
    current_count = db.query(models.Grievance).count()
    created_items = []
    
    for idx, item in enumerate(payload.items, start=1):
        new_id = f"GRV-2026-{100 + current_count + idx}"
        db_item = models.Grievance(id=new_id, **item.model_dump())
        db.add(db_item)
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

