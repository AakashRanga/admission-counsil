import sys
sys.path.append("d:/projects/Academic Council/backend")
from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    res = conn.execute(text("DELETE FROM grievances WHERE id IN ('GRV-2026-101', 'GRV-2026-102', 'GRV-2026-103', 'GRV-2026-104', 'GRV-2026-105')"))
    conn.commit()
    print("SUCCESS DELETED STATIC GRIEVANCES. ROW COUNT:", res.rowcount)
