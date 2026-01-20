import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

const App = () => {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [enhancedText, setEnhancedText] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const theme = darkMode ? dark : light;

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  /* ---------------- ACTIONS ---------------- */

  const uploadResume = async () => {
    if (!file) return alert("Please select a resume file");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API}/upload`, formData);
      setResumeText(res.data.extracted_text);
      setEnhancedText("");
      setAtsScore(null);
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const analyzeATS = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/ats-score`, {
        resume_text: resumeText,
        job_keywords: ["python", "fastapi", "sql", "react"]
      });
      setAtsScore(res.data.score);

      setHistory([
        {
          id: Date.now(),
          date: new Date().toLocaleString(),
          score: res.data.score,
          text: resumeText
        },
        ...history
      ]);
    } catch {
      alert("ATS analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const enhanceResume = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/ai-enhance`, {
        resume_text: resumeText,
        target_role: "Software Developer"
      });
      setEnhancedText(res.data.enhanced_resume);
    } catch {
      alert("Enhancement failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    await axios.post(`${API}/generate-pdf`, {
      resume_text: enhancedText || resumeText
    });
    alert("PDF generated (check backend/generated)");
  };

  const downloadDOCX = async () => {
    await axios.post(`${API}/generate-docx`, {
      resume_text: enhancedText || resumeText
    });
    alert("DOCX generated (check backend/generated)");
  };

  const atsColor =
    atsScore >= 75 ? "#16a34a" : atsScore >= 50 ? "#ca8a04" : "#dc2626";

  return (
    <div style={{ ...styles.page, background: theme.bg, color: theme.text }}>
      {/* TOP HEADER */}
      <header style={{ ...styles.header, background: theme.card }}>
        <strong>AI Resume Builder</strong>
        <div>
          <button
            style={styles.textBtn}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light mode" : "Dark mode"}
          </button>
          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* ACTION NAVBAR */}
      <div style={{ ...styles.actionBar, background: theme.card }}>
        <button
          style={styles.navBtn}
          disabled={!resumeText}
          onClick={analyzeATS}
        >
          ATS Score
        </button>
        <button
          style={styles.navBtn}
          disabled={!resumeText}
          onClick={enhanceResume}
        >
          Enhance with AI
        </button>
        <button
          style={styles.navBtn}
          disabled={!resumeText}
          onClick={downloadPDF}
        >
          Download PDF
        </button>
        <button
          style={styles.navBtn}
          disabled={!resumeText}
          onClick={downloadDOCX}
        >
          Download DOCX
        </button>
      </div>

      {/* MAIN LAYOUT */}
      <div style={styles.layout}>
        {/* LEFT PANEL */}
        <div style={{ ...styles.panel, background: theme.card }}>
          <h3>Upload Resume</h3>
          <p style={styles.muted}>PDF or DOCX only</p>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button style={styles.primaryBtn} onClick={uploadResume}>
            Upload
          </button>

          {atsScore !== null && (
            <>
              <hr style={styles.divider} />
              <p style={styles.muted}>ATS Compatibility</p>
              <span style={{ ...styles.score, color: atsColor }}>
                {atsScore}%
              </span>
              <div style={styles.progress}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${atsScore}%`,
                    background: atsColor
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div style={{ ...styles.panel, background: theme.card }}>
          <h3>Resume Content</h3>

          {resumeText ? (
            <textarea
              style={{
                ...styles.textarea,
                background: theme.bg,
                color: theme.text
              }}
              rows="16"
              value={enhancedText || resumeText}
              readOnly
            />
          ) : (
            <p style={styles.muted}>
              Upload a resume to view content here.
            </p>
          )}

          {history.length > 0 && (
            <>
              <hr style={styles.divider} />
              <h4>Resume History</h4>
              {history.map((h) => (
                <div
                  key={h.id}
                  style={styles.historyItem}
                  onClick={() => {
                    setResumeText(h.text);
                    setAtsScore(h.score);
                    setEnhancedText("");
                  }}
                >
                  <span>{h.date}</span>
                  <strong>{h.score}%</strong>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {loading && <p style={styles.loading}>Processing…</p>}
    </div>
  );
};

/* ---------------- STYLES ---------------- */

const styles = {
  page: { minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" },
  header: {
    height: 56,
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb"
  },
  actionBar: {
    display: "flex",
    gap: 12,
    padding: "10px 24px",
    borderBottom: "1px solid #e5e7eb"
  },
  navBtn: {
    padding: "6px 14px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    background: "transparent",
    cursor: "pointer"
  },
  layout: {
    maxWidth: 1200,
    margin: "24px auto",
    display: "grid",
    gridTemplateColumns: "360px 1fr",
    gap: 24
  },
  panel: {
    padding: 20,
    borderRadius: 8,
    border: "1px solid #e5e7eb"
  },
  muted: { color: "#6b7280", fontSize: 14 },
  primaryBtn: {
    marginTop: 12,
    width: "100%",
    padding: "8px 12px",
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  textBtn: {
    marginRight: 10,
    background: "transparent",
    border: "none",
    cursor: "pointer"
  },
  logoutBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer"
  },
  divider: {
    margin: "16px 0",
    border: "none",
    borderTop: "1px solid #e5e7eb"
  },
  score: {
    fontSize: 26,
    fontWeight: 600
  },
  progress: {
    height: 6,
    background: "#e5e7eb",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 6
  },
  progressFill: {
    height: "100%"
  },
  textarea: {
    width: "100%",
    padding: 12,
    borderRadius: 6,
    border: "1px solid #d1d5db",
    resize: "none",
    fontSize: 14
  },
  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #e5e7eb",
    cursor: "pointer"
  },
  loading: {
    textAlign: "center",
    marginTop: 20
  }
};

/* ---------------- THEMES ---------------- */

const light = {
  bg: "#f9fafb",
  card: "#ffffff",
  text: "#111827"
};

const dark = {
  bg: "#020617",
  card: "#020617",
  text: "#e5e7eb"
};

export default App;