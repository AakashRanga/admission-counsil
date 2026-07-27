import os
import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Read individual MySQL environment variables from .env
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "12345")
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB = os.getenv("MYSQL_DB", "academic_council")

# URL-encode password to safely handle special characters like @, :, #, etc.
encoded_password = urllib.parse.quote_plus(MYSQL_PASSWORD)

# Construct connection URL dynamically from environment variables
DEFAULT_URL = f"mysql+pymysql://{MYSQL_USER}:{encoded_password}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"

# Use DATABASE_URL if explicitly set in .env, otherwise default to component parameters
MYSQL_URL = os.getenv("DATABASE_URL", DEFAULT_URL)

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
    print(f"[*] Successfully connected to MySQL database engine.")
except Exception as e:
    # Attempt automatic failover port check (3308 vs 3306)
    alt_port = "3308" if MYSQL_PORT == "3306" else "3306"
    try:
        ALT_URL = f"mysql+pymysql://{MYSQL_USER}:{encoded_password}@{MYSQL_HOST}:{alt_port}/{MYSQL_DB}"
        engine = create_engine(ALT_URL, pool_pre_ping=True, pool_recycle=3600)
        with engine.connect() as conn:
            pass
        print(f"[*] Successfully connected to MySQL database engine on port {alt_port}.")
    except Exception as alt_err:
        print(f"[!] MySQL connection failed on primary and alternate ports: {e}")
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
