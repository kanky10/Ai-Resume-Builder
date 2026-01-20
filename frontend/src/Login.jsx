import React, { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem("token", res.data.access_token);
      window.location.href = "/resume";
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Sign in</h1>
        <p style={styles.subtitle}>Access your resume workspace</p>

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

        <button style={styles.primary} onClick={login}>
          Continue
        </button>

        <p style={styles.footer}>
          New here? <a href="/signup">Create an account</a>
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