import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./SignupPage.css";
import Navbar from "./Navbar";
export default function SignupPage() {
  const { register, loading, error } = useAuth();

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form);
    if (result?.success) {
      alert("Signup + Auto Login Successful 🎉");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="signup-page">
      <div className="signup-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join EmoMusic AI 🎵</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
    </>
  );
}
