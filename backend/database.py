import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# MySQL Database URL targeting `academic_council` DB
# Configurable via environment variable DATABASE_URL
MYSQL_URL = os.getenv(
    "DATABASE_URL", 
    "mysql+pymysql://root:12345@localhost:3308/academic_council"
)

# Attempt connection to MySQL; fallback to SQLite if MySQL service is not running locally
try:
    engine = create_engine(
        MYSQL_URL, 
        pool_pre_ping=True, 
        pool_recycle=3600
    )
    # Test connection
    with engine.connect() as conn:
        pass
    print(f"[*] Successfully connected to MySQL Workbench database: {MYSQL_URL}")
except Exception as e:
    print(f"[!] MySQL connection failed: {e}")
    print("[*] Falling back to SQLite local database (academic_council.db)")
    FALLBACK_URL = "sqlite:///./academic_council.db"
    engine = create_engine(
        FALLBACK_URL, 
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
