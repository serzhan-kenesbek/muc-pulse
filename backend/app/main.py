from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert, select
import json

from app.database import engine, get_db
from app.models import Request
from app.schemas import ReportIn, ReportOut

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],      # <---- THIS ALLOWS OPTIONS
    allow_headers=["*"],
)

SIGNAL_MAP = {
    "safe": ("is_safe", True),
    "unsafe": ("is_safe", False),
    "clean": ("is_clean", True),
    "dirty": ("is_clean", False),
    "accessible": ("is_accessible", True),
    "inaccessible": ("is_accessible", False),
    "quiet": ("is_quiet", True),
    "noisy": ("is_quiet", False),
    "uncrowded": ("is_uncrowded", True),
    "crowded": ("is_uncrowded", False),
    "lively": ("is_lively", True),
}


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Request.metadata.create_all)


@app.post("/report", response_model=ReportOut)
async def submit_report(data: ReportIn, db: AsyncSession = Depends(get_db)):
    if data.signal_type not in SIGNAL_MAP:
        raise HTTPException(400, f"Unknown signal type: {data.signal_type}")

    field_name, field_value = SIGNAL_MAP[data.signal_type]

    # Parse location JSON string
    try:
        loc = json.loads(data.location)
        latitude, longitude = (loc["lat"], loc["lng"])
    except:
        raise HTTPException(400, "Invalid location format")

    # Build column assignment dict
    insert_data = {
        "latitude": latitude,
        "longitude": longitude,
        field_name: field_value
    }

    stmt = insert(Request).values(**insert_data).returning(Request.id, Request.time)
    result = await db.execute(stmt)
    print(insert_data)

    row = result.fetchone()
    print(row)

    await db.commit()
    if not row:
        print("No row returned after insert")
        raise HTTPException(500, "Failed to create report")

    return ReportOut(id=row[0], time=str(row[1]))

@app.get("/fetch-reports")
async def get_all_requests(db: AsyncSession = Depends(get_db)):
    query = select(Request)
    result = await db.execute(query)
    rows = result.scalars().all()

    # Convert SQLAlchemy models → JSON-serializable dicts
    response = [
        {
            "id": r.id,
            "time": r.time,
            "latitude": r.latitude,
            "longitude": r.longitude,
            "is_safe": r.is_safe,
            "is_clean": r.is_clean,
            "is_accessible": r.is_accessible,
            "is_quiet": r.is_quiet,
            "is_uncrowded": r.is_uncrowded,
            "is_lively": r.is_lively
        }
        for r in rows
    ]
    return response