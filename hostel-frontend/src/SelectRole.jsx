import { useNavigate } from "react-router-dom";
import "./Login.css";

function SelectRole() {
  const navigate = useNavigate();

  return (
    <div className="login-container">

      {/* LEFT SIDE */}
      <div className="left-panel">
        <h1>Hostel Management</h1>
        <p>Choose your portal</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-panel">
        <div className="login-card">
          <h2>Select Login</h2>

          <button onClick={() => navigate("/student-login")}>
            🎓 Student Login
          </button>

          <button onClick={() => navigate("/admin-login")}>
            🏠 Admin Login
          </button>
        </div>
      </div>

    </div>
  );
}

export default SelectRole;