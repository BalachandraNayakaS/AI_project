from pydantic import BaseModel


class UserCreate(BaseModel):

    username: str

    email: str

    password: str


class CustomerCreate(BaseModel):

    name: str

    email: str

    phone: str


class SaleCreate(BaseModel):

    customer_name: str

    product: str

    amount: float