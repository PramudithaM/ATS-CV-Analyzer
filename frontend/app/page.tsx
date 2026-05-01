"use client";

import { useState, useCallback } from "react";

interface AnalysisResult {
  score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: string[];
  improved_cv: string;
}

interface HistoryItem {
  id: string;
  filename: string;
  score: number;
  provider: string;
  timestamp: string;
  result: AnalysisResult;
}

export default function Home() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [provider, setProvider] = useState("gemini");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"analyze" | "history">("analyze");
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith(".docx"))) {
      setCvFile(file);
    } else {
      alert("PDF හෝ DOCX file එකක් upload කරන්න!");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCvFile(file);
  };

  const handleAnalyze = async () => {
    if (!cvFile || !jdText) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("cv_file", cvFile);
      formData.append("jd_text", jdText);
      formData.append("provider", provider);

      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server error: " + res.status);
      const data: AnalysisResult = await res.json();
      setResult(data);

      // History save
      const item: HistoryItem = {
        id: Date.now().toString(),
        filename: cvFile.name,
        score: data.score,
        provider,
        timestamp: new Date().toLocaleString(),
        result: data,
      };
      setHistory((prev) => [item, ...prev]);
    } catch (err: any) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePDFExport = async (r: AnalysisResult, filename: string) => {
    const html = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
          h1 { color: #7c3aed; }
          h2 { color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
          .score { font-size: 48px; font-weight: bold; color: ${r.score >= 70 ? "#16a34a" : r.score >= 40 ? "#d97706" : "#dc2626"}; }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 13px; margin: 4px; }
          .matched { background: #dcfce7; color: #166534; }
          .missing { background: #fee2e2; color: #991b1b; }
          .suggestion { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
          pre { background: #f9fafb; padding: 16px; border-radius: 8px; white-space: pre-wrap; font-size: 13px; }
        </style>
      </head>
      <body>
        <h1>ATS Analysis Report</h1>
        <p><strong>CV:</strong> ${filename}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <h2>ATS Score</h2>
        <div class="score">${r.score}<span style="font-size:24px;color:#6b7280"> / 100</span></div>
        <h2>Matched Keywords</h2>
        ${r.matched_keywords.map(k => `<span class="badge matched">${k}</span>`).join("")}
        <h2>Missing Keywords</h2>
        ${r.missing_keywords.map(k => `<span class="badge missing">${k}</span>`).join("")}
        <h2>Suggestions</h2>
        ${r.suggestions.map(s => `<div class="suggestion">→ ${s}</div>`).join("")}
        <h2>Improved CV Bullets</h2>
        <pre>${r.improved_cv}</pre>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ATS_Report_${filename.replace(/\.[^/.]+$/, "")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const scoreColor = (score: number) =>
    score >= 70 ? "text-green-400" : score >= 40 ? "text-yellow-400" : "text-red-400";

  const scoreBarColor = (score: number) =>
    score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500";

  const displayResult = selectedHistory ? selectedHistory.result : result;
  const displayFilename = selectedHistory ? selectedHistory.filename : cvFile?.name ?? "";

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-400 mb-2">ATS Analyzer</h1>
          <p className="text-gray-400">AI-powered CV & Job Description Analyzer</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setActiveTab("analyze"); setSelectedHistory(null); }}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "analyze" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            🔍 Analyze
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "history" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            🕘 History {history.length > 0 && <span className="ml-1 bg-purple-800 text-purple-200 text-xs px-2 py-0.5 rounded-full">{history.length}</span>}
          </button>
        </div>

        {/* Analyze Tab */}
        {activeTab === "analyze" && (
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">

            {/* CV Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">📄 Your CV (PDF / DOCX)</label>
              {!cvFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                    ${isDragging ? "border-purple-400 bg-purple-950" : "border-gray-600 bg-gray-800 hover:border-purple-500"}`}
                >
                  <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="text-4xl mb-3">📂</div>
                  <p className="text-gray-300 font-medium">{isDragging ? "Drop කරන්න!" : "Drag & Drop CV file එක මෙතනට"}</p>
                  <p className="text-gray-500 text-sm mt-1">හෝ click කරලා select කරන්න</p>
                  <p className="text-gray-600 text-xs mt-2">PDF, DOCX supported</p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-800 border border-purple-700 rounded-xl px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cvFile.name.endsWith(".pdf") ? "📕" : "📘"}</span>
                    <div>
                      <p className="text-gray-100 font-medium text-sm">{cvFile.name}</p>
                      <p className="text-gray-500 text-xs">{(cvFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button onClick={() => setCvFile(null)} className="text-gray-500 hover:text-red-400 text-xl transition-colors">✕</button>
                </div>
              )}
            </div>

            {/* JD */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">💼 Job Description</label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                className="w-full h-40 bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                placeholder="Paste the job description here..."
              />
            </div>

            {/* Provider */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">🤖 AI Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-gray-100 focus:outline-none focus:border-purple-500"
              >
                <option value="gemini">Google Gemini</option>
                {/* <option value="openai">OpenAI GPT-4o</option>
                <option value="claude">Anthropic Claude</option> */}
              </select>
            </div>

            {/* Button */}
            <button
              onClick={handleAnalyze}
              disabled={!cvFile || !jdText || loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Analyzing...
                </span>
              ) : !cvFile || !jdText ? "CV සහ JD add කරන්න" : "🔍 Analyze CV"}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-950 border border-red-700 rounded-xl text-red-300 text-sm">❌ {error}</div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <div className="text-5xl mb-4">📭</div>
                <p>තාම analyses නෑ. CV එකක් analyze කරන්න!</p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => { setSelectedHistory(item); setActiveTab("analyze"); }}
                  className="bg-gray-900 border border-gray-800 hover:border-purple-700 rounded-xl px-5 py-4 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📕</span>
                      <div>
                        <p className="text-gray-100 text-sm font-medium">{item.filename}</p>
                        <p className="text-gray-500 text-xs">{item.timestamp} · {item.provider}</p>
                      </div>
                    </div>
                    <span className={`text-2xl font-bold ${scoreColor(item.score)}`}>{item.score}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Results */}
        {displayResult && (
          <div className="mt-8 space-y-4">

            {/* Score Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-200">🎯 ATS Score</h2>
                <button
                  onClick={() => handlePDFExport(displayResult, displayFilename)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm text-gray-300 transition-colors"
                >
                  📥 Export Report
                </button>
              </div>

              {/* Circular Score */}
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="10"/>
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke={displayResult.score >= 70 ? "#22c55e" : displayResult.score >= 40 ? "#eab308" : "#ef4444"}
                      strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - displayResult.score / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-bold ${scoreColor(displayResult.score)}`}>{displayResult.score}</span>
                    <span className="text-gray-500 text-xs">/ 100</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className={`text-lg font-semibold mb-1 ${scoreColor(displayResult.score)}`}>
                    {displayResult.score >= 70 ? "🟢 Strong Match!" : displayResult.score >= 40 ? "🟡 Moderate Match" : "🔴 Weak Match"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {displayResult.score >= 70
                      ? "ඔයාගේ CV job description එකට හොඳින් match වෙනවා."
                      : displayResult.score >= 40
                      ? "CV improve කිරීමෙන් better match වෙන්න පුළුවන්."
                      : "CV significantly improve කරන්න ඕනෙ."}
                  </p>
                  <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${scoreBarColor(displayResult.score)}`}
                      style={{ width: `${displayResult.score}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h2 className="text-sm font-semibold text-green-400 mb-3">✅ Matched ({displayResult.matched_keywords.length})</h2>
                <div className="flex flex-wrap gap-2">
                  {displayResult.matched_keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-1 bg-green-900 text-green-300 rounded-lg text-xs">{kw}</span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h2 className="text-sm font-semibold text-red-400 mb-3">❌ Missing ({displayResult.missing_keywords.length})</h2>
                <div className="flex flex-wrap gap-2">
                  {displayResult.missing_keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-1 bg-red-900 text-red-300 rounded-lg text-xs">{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-yellow-400 mb-3">💡 Suggestions</h2>
              <ul className="space-y-2">
                {displayResult.suggestions.map((s, i) => (
                  <li key={i} className="text-gray-300 text-sm flex gap-2 items-start">
                    <span className="text-yellow-400 mt-0.5">→</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improved CV */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-purple-400 mb-3">✨ Improved CV Bullets</h2>
              <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{displayResult.improved_cv}</p>
            </div>

          </div>
        )}

        <p className="text-gray-600 text-sm text-center mt-10">Powered by Gemini · OpenAI · Claude</p>
      </div>
    </main>
  );
}