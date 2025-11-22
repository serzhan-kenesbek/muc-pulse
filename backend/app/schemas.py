from pydantic import BaseModel

class ReportIn(BaseModel):
    signal_type: str
    location: str  # raw string, frontend sends: {"lat":48.1351,"lng":11.582}

class ReportOut(BaseModel):
    id: int
    time: str

    class Config:
        orm_mode = True
