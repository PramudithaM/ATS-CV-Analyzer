import anthropic
import os, json
from dotenv import load_dotenv

load_dotenv()
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def analyze_with_claude(cv_text: str, jd_text: str) -> dict:
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

    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )
    
    text = message.content[0].text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    
    return json.loads(text.strip())