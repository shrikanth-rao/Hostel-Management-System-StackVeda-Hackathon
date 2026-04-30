
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password
      });

      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }

    } catch (err) {
      alert("Invalid login");
      console.error(err);
    }
  };

  return (
    <div className="login-container">

      {/* LEFT SIDE */}
      <div className="left-panel">
        <h1>Hostel Management</h1>
        <p>Smart, Secure & Easy Hostel System</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-panel">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p>Login to continue</p>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Login</button>
        </div>
      </div>

    </div>
  );
}

export default Login;