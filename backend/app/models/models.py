from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float

from app.core.database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(100), unique=True)

    email = Column(String(150), unique=True)

    password = Column(String(255))


class Customer(Base):

    __tablename__ = "customers"

    id = Column(Integer, primary_key=True)

    name = Column(String(100))

    email = Column(String(150))

    phone = Column(String(20))


class Sale(Base):

    __tablename__ = "sales"

    id = Column(Integer, primary_key=True)

    customer_name = Column(String(100))

    product = Column(String(100))

    amount = Column(Float)