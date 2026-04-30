import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password
      });

      if (res.data.role !== "admin") {
        alert("Not an admin account");
        return;
      }

      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("role", res.data.role);

      navigate("/admin");

    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="right-panel">
        <div className="login-card">
          <h2>Admin Login</h2>

          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;