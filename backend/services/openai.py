from openai import OpenAI
import os, json
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_with_openai(cv_text: str, jd_text: str) -> dict:
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

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    
    return json.loads(response.choices[0].message.content)