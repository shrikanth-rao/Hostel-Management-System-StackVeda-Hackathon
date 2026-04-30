import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectRole from "./SelectRole";
import StudentLogin from "./StudentLogin";
import AdminLogin from "./AdminLogin";
import Student from "./Student";
import Admin from "./Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing */}
        <Route path="/" element={<SelectRole />} />

        {/* Logins */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Dashboards */}
        <Route path="/student" element={<Student />} />
        <Route path="/admin" element={<Admin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;