from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: int
    exp: int
    type: str


class UserBase(BaseModel):
    username: str = Field(..., max_length=100)
    email: EmailStr
    company: Optional[str] = None
    role: str = Field(default="user", max_length=50)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserRead(UserBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UserLogin(BaseModel):
    username: str
    password: str


class CustomerBase(BaseModel):
    name: str = Field(..., max_length=100)
    email: EmailStr
    phone: str = Field(..., max_length=20)
    company: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    status: Optional[str] = Field(default="active", max_length=50)


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    status: Optional[str] = Field(None, max_length=50)


class CustomerRead(CustomerBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class SaleBase(BaseModel):
    customer_id: int
    product: str = Field(..., max_length=100)
    amount: float
    quantity: int = Field(..., ge=1)
    sales_date: datetime


class SaleCreate(SaleBase):
    pass


class SaleUpdate(BaseModel):
    product: Optional[str] = Field(None, max_length=100)
    amount: Optional[float] = None
    quantity: Optional[int] = Field(None, ge=1)
    sales_date: Optional[datetime] = None


class SaleRead(SaleBase):
    id: int
    customer_name: Optional[str] = None

    model_config = {"from_attributes": True}


class SupportTicketBase(BaseModel):
    customer_id: int
    subject: str = Field(..., max_length=200)
    message: str
    status: str = Field(default="open", max_length=50)
    priority: str = Field(default="medium", max_length=50)


class SupportTicketCreate(SupportTicketBase):
    pass


class SupportTicketUpdate(BaseModel):
    status: Optional[str] = Field(None, max_length=50)
    priority: Optional[str] = Field(None, max_length=50)


class SupportTicketRead(SupportTicketBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


class LeadScoreBase(BaseModel):
    customer_id: int
    score: float = Field(..., ge=0, le=100)
    probability: float = Field(..., ge=0, le=1)
    recommended_action: str


class LeadScoreRead(LeadScoreBase):
    id: int

    model_config = {"from_attributes": True}


class SentimentRequest(BaseModel):
    review: str


class SentimentResponse(BaseModel):
    sentiment: str
    confidence: float


class RecommendationRead(BaseModel):
    id: int
    customer_id: int
    recommendation: str
    type: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ReportRequest(BaseModel):
    title: str
    report_type: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class ReportRead(BaseModel):
    id: int
    title: str
    report_type: str
    generated_date: datetime
    file_path: str

    model_config = {"from_attributes": True}


class DashboardResponse(BaseModel):
    customers: int
    today_sales: float
    accuracy: Optional[float] = None
    tickets: int
    satisfaction: Optional[float] = None
    lead_conversion: Optional[float] = None
    monthly_sales: List[float] = []
    sentiment: List[Dict[str, float]] = []
    lead_scores: List[Dict[str, float]] = []
