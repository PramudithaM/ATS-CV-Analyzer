from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from utils.parser import extract_text
from services.gemini import analyze_with_gemini
from services.openai import analyze_with_openai
from services.claude import analyze_with_claude

app = FastAPI()

# CORS — Next.js frontend allow
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ATS Analyzer API running!"}

@app.post("/analyze")
async def analyze(
    cv_file: UploadFile = File(...),
    jd_text: str = Form(...),
    provider: str = Form(default="gemini")
):
    # CV file read
    file_bytes = await cv_file.read()
    cv_text = extract_text(file_bytes, cv_file.filename)
    
    # Provider select
    if provider == "openai":
        result = analyze_with_openai(cv_text, jd_text)
    elif provider == "claude":
        result = analyze_with_claude(cv_text, jd_text)
    else:
        result = analyze_with_gemini(cv_text, jd_text)
    
    return result