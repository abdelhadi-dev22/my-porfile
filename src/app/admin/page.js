"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Invalid login credentials");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page" style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "var(--base-bg)"
    }}>
      <form className="contact-form" onSubmit={handleLogin} style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "2rem", textAlign: "center" }}>
          Admin Login
        </h2>

        {error && <p style={{ color: "var(--danger)", marginBottom: "1rem", textAlign: "center" }}>{error}</p>}

        <div className="form-group">
          <label className="form-label">Username</label>
          <input 
            type="text" 
            className="form-input" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-footer">
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
