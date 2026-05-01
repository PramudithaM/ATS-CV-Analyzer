from google import genai
import os, json
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_with_gemini(cv_text: str, jd_text: str) -> dict:
    prompt = f"""
You are a strict ATS (Applicant Tracking System) and professional recruiter.

Analyze the CV and Job Description below.

CV:
{cv_text}

Job Description:
{jd_text}

Return ONLY a valid JSON object with this exact structure:
{{
  "score": <number 0-100>,
  "matched_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "improved_cv": "rewritten bullet points here"
}}

Be strict. No extra text. JSON only.
"""

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt
    )

    text = response.text.strip()

    # Clean markdown fences
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]

    return json.loads(text.strip())