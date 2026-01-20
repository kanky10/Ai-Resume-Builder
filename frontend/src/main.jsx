import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Signup from "./Signup";
import App from "./App";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function Root() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default entry point */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected resume page */}
        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);