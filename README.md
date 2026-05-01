# 🎯 ATS Analyzer

An AI-powered **Applicant Tracking System (ATS)** that analyzes CVs against job descriptions using multiple AI providers.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css)

---

## ✨ Features

- 📄 **CV Upload** — Drag & Drop PDF / DOCX support
- 🎯 **ATS Score** — 0–100 compatibility score with circular gauge
- 🔑 **Keyword Analysis** — Matched & Missing keywords
- 💡 **Suggestions** — Actionable CV improvement tips
- ✍️ **CV Rewriter** — AI-powered bullet point improvements
- 🕘 **History** — Past analysis results
- 📥 **Export** — Download analysis report as HTML
- 🤖 **Multi AI Provider** — Google Gemini, Groq, OpenAI, Anthropic Claude

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 | React framework |
| Tailwind CSS | Styling |
| TypeScript | Type safety |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API |
| Python 3.10+ | Backend language |
| PyMuPDF | PDF text extraction |
| python-docx | DOCX text extraction |

### AI Providers
| Provider | Model | Status |
|---|---|---|
| Google Gemini | gemini-1.5-flash | ✅ Free |
| Groq | llama-3.3-70b-versatile | ✅ Free |
| Anthropic Claude | claude-sonnet | ✅ Paid |
| OpenAI | gpt-4o-mini | ✅ Paid |

---

## 📁 Project Structure

```
ats-analyzer/
├── frontend/                  # Next.js App
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # Main page
│   │   │   ├── layout.tsx     # Root layout
│   │   │   └── globals.css    # Global styles
│   │   └── components/
│   │       ├── UploadForm.tsx
│   │       ├── ScoreCard.tsx
│   │       ├── KeywordSection.tsx
│   │       ├── Suggestions.tsx
│   │       ├── ImprovedCV.tsx
│   │       └── HistoryPanel.tsx
│   └── package.json
│
└── backend/                   # FastAPI App
    ├── main.py                # FastAPI entry point
    ├── services/
    │   ├── gemini.py          # Google Gemini service
    │   ├── groq_service.py    # Groq service
    │   ├── openai.py          # OpenAI service
    │   └── claude.py          # Anthropic Claude service
    ├── utils/
    │   └── parser.py          # PDF/DOCX text extractor
    ├── requirements.txt
    └── .env                   # API keys (not committed)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Python 3.10+
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ats-analyzer.git
cd ats-analyzer
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
```

Create `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

Start backend:

```bash
uvicorn main:app --reload
# Running on http://127.0.0.1:8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```

---

## 🔑 API Keys

| Provider | Get API Key | Free Tier |
|---|---|---|
| Google Gemini | [aistudio.google.com](https://aistudio.google.com) | ✅ Yes |
| Groq | [console.groq.com](https://console.groq.com) | ✅ Yes |
| OpenAI | [platform.openai.com](https://platform.openai.com) | ❌ Paid |
| Anthropic | [console.anthropic.com](https://console.anthropic.com) | ❌ Paid |

---

## 📡 API Endpoints

### `GET /`
Health check

```json
{ "status": "ATS Analyzer API running!" }
```

### `POST /analyze`
Analyze CV against job description

**Form Data:**
| Field | Type | Description |
|---|---|---|
| `cv_file` | File | PDF or DOCX CV file |
| `jd_text` | String | Job description text |
| `provider` | String | `gemini` / `groq` / `openai` / `claude` |

**Response:**
```json
{
  "score": 75,
  "matched_keywords": ["Python", "FastAPI", "SQL"],
  "missing_keywords": ["Docker", "Kubernetes"],
  "suggestions": ["Add cloud experience", "Include metrics"],
  "improved_cv": "• Engineered RESTful APIs using FastAPI..."
}
```

---

## 🚢 Deployment

### Frontend — Vercel
1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Deploy automatically

### Backend — Railway
1. Push to GitHub
2. New project at [railway.app](https://railway.app)
3. Add environment variables
4. Deploy

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use this project for personal or commercial purposes.

---

## 👨‍💻 Author

**Pramuditha Madura Jayasingha**

Built with ❤️ using Next.js, FastAPI, and AI

---

> 💡 **Tip:** Use **Google Gemini** or **Groq** for free analysis without any billing setup!
