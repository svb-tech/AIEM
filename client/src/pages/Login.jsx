import { useState,useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const { login, logout, user, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  
  useEffect(() => {
    if (user) {
      // Redirect to home page
      navigate("/"); // "/" is home page
    }
  }, [user, navigate]);


  return (
    <>
    <Navbar/>
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.field}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            placeholder="Enter your email"
          />
        </div>

        <div style={styles.field}>
          <label>Password:</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={styles.showBtn}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
    </>
  );
}

const styles = {
  container: {
    padding: "40px",
    maxWidth: "400px",
    margin: "50px auto",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    marginTop:"150px",
    background:" #ffffff",
   
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginTop: "5px",
    flex: 1,
  },
  showBtn: {
    marginLeft: "10px",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "12px",
    borderRadius: "4px",
    border: "none",
    background: "#007bff",
    color: "#fff",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    background: "#28a745",
    color: "#fff",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};
