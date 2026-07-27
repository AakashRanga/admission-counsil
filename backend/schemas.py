from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime

class LoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = None

class UserBase(BaseModel):
    name: str
    email: str
    role: str
    department: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class GrievanceBase(BaseModel):
    type: str
    title: str
    student_id: str
    student_name: str
    department: str
    mobile: Optional[str] = None
    category: Optional[str] = None
    description: str
    remarks: Optional[str] = None
    status: Optional[str] = "pending"
    building: Optional[str] = None
    floor: Optional[str] = None
    room_number: Optional[str] = None
    location: Optional[str] = None
    subject: Optional[str] = None
    faculty_name: Optional[str] = None
    course: Optional[str] = None
    assigned_staff_name: Optional[str] = None
    assigned_staff_mobile: Optional[str] = None
    special_instructions: Optional[str] = None
    rating: Optional[int] = None
    satisfied: Optional[bool] = None
    feedback_comments: Optional[str] = None
    final_remarks: Optional[str] = None
    closed_at: Optional[str] = None

class AssignStaffRequest(BaseModel):
    assigned_staff_name: str
    assigned_staff_mobile: str
    special_instructions: Optional[str] = None

class UpdateStatusRequest(BaseModel):
    status: str
    remarks: Optional[str] = None

class VerifyResolutionRequest(BaseModel):
    status: str
    rating: Optional[int] = None
    satisfied: Optional[bool] = None
    feedback_comments: Optional[str] = None
    final_remarks: Optional[str] = None


class GrievanceCreate(GrievanceBase):
    pass

class GrievanceResponse(GrievanceBase):
    id: str
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

class BulkGrievanceCreate(BaseModel):
    items: List[GrievanceCreate]

class BulkGrievanceResponse(BaseModel):
    status: str
    count: int
    items: List[GrievanceResponse]


class DepartmentBase(BaseModel):
    name: str
    code: str
    head_name: str

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True


class AuditLogBase(BaseModel):
    action: str
    performed_by: str
    role: str
    target_id: Optional[str] = None
    timestamp: str
    details: str

class AuditLogCreate(AuditLogBase):
    pass

class AuditLogResponse(AuditLogBase):
    id: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True



