import os
import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Read individual MySQL environment variables
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "Simats@123")
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB = os.getenv("MYSQL_DB", "academic_council")

# URL-encode password to safely handle special characters like @, :, #, etc.
encoded_password = urllib.parse.quote_plus(MYSQL_PASSWORD)

# Default Connection URL
DEFAULT_URL = f"mysql+pymysql://{MYSQL_USER}:{encoded_password}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"

# Configurable via DATABASE_URL or component variables
RAW_DATABASE_URL = os.getenv("DATABASE_URL")
if RAW_DATABASE_URL and RAW_DATABASE_URL != "mysql+pymysql://root:12345@localhost:3308/academic_council":
    MYSQL_URL = RAW_DATABASE_URL
else:
    MYSQL_URL = DEFAULT_URL

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
    # Try alternate port 3308 fallback if 3306 fails
    try:
        ALT_URL = f"mysql+pymysql://{MYSQL_USER}:{encoded_password}@{MYSQL_HOST}:3308/{MYSQL_DB}"
        engine = create_engine(ALT_URL, pool_pre_ping=True, pool_recycle=3600)
        with engine.connect() as conn:
            pass
        print(f"[*] Successfully connected to MySQL database engine (Port 3308).")
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
