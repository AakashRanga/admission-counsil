import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="student_council")
    department = Column(String(100), nullable=False, default="General")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Grievance(Base):
    __tablename__ = "grievances"

    id = Column(String(50), primary_key=True, index=True)
    type = Column(String(20), nullable=False, default="academic")  # academic | maintenance
    title = Column(String(255), nullable=False)
    
    # Student details
    student_id = Column(String(50), nullable=False)
    student_name = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    mobile = Column(String(30), nullable=True)

    # Dynamic fields
    category = Column(String(100), nullable=True)
    description = Column(Text, nullable=False)
    remarks = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="pending")

    # Maintenance specific
    building = Column(String(100), nullable=True)
    floor = Column(String(50), nullable=True)
    room_number = Column(String(50), nullable=True)
    location = Column(String(255), nullable=True)

    # Academic specific
    subject = Column(String(100), nullable=True)
    faculty_name = Column(String(100), nullable=True)
    course = Column(String(100), nullable=True)

    # Assigned Staff Details
    assigned_staff_name = Column(String(100), nullable=True)
    assigned_staff_mobile = Column(String(30), nullable=True)
    special_instructions = Column(Text, nullable=True)

    # Verification & Student Feedback Details
    rating = Column(Integer, nullable=True)
    satisfied = Column(Boolean, nullable=True)
    feedback_comments = Column(Text, nullable=True)
    final_remarks = Column(Text, nullable=True)
    closed_at = Column(String(100), nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class Department(Base):
    __tablename__ = "departments"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    code = Column(String(20), nullable=False)
    head_name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(50), primary_key=True, index=True)
    action = Column(String(50), nullable=False)
    performed_by = Column(String(100), nullable=False)
    role = Column(String(50), nullable=False)
    target_id = Column(String(50), nullable=True)
    timestamp = Column(String(100), nullable=False)
    details = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


