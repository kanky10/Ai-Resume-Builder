import React, { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const signup = async () => {
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post(`${API}/signup`, { email, password });
      window.location.href = "/login";
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Create account</h1>
        <p style={styles.subtitle}>Start optimizing your resume</p>

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={styles.label}>Password</label>
        <input
          type="password"
          style={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label style={styles.label}>Confirm password</label>
        <input
          type="password"
          style={styles.input}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button style={styles.primary} onClick={signup}>
          Create account
        </button>

        <p style={styles.footer}>
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fafafa"
  },
  container: {
    width: 360
  },
  title: {
    fontSize: 28,
    marginBottom: 4
  },
  subtitle: {
    color: "#6b7280",
    marginBottom: 24
  },
  label: {
    fontSize: 14,
    color: "#374151"
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 6,
    marginBottom: 16,
    border: "1px solid #d1d5db",
    borderRadius: 6
  },
  primary: {
    width: "100%",
    padding: 10,
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    color: "#6b7280"
  }
};