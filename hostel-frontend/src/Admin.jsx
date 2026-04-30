import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [complaints, setComplaints] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [payments, setPayments] = useState([]);
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  // 🔹 Fetch all data
  const fetchData = async () => {
    try {
      const c = await axios.get("http://127.0.0.1:8000/api/complaints/");
      const r = await axios.get("http://127.0.0.1:8000/api/rooms/");
      const p = await axios.get("http://127.0.0.1:8000/api/payments/");

      setComplaints(c.data);
      setRooms(r.data);
      setPayments(p.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Fetch admin user
  const fetchUser = async () => {
    const id = localStorage.getItem("user_id");
    const res = await axios.get(`http://127.0.0.1:8000/api/user/${id}/`);
    setUser(res.data);
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // 🔹 Mark payment
  const markPaid = async (id) => {
    await axios.patch(`http://127.0.0.1:8000/api/pay/${id}/`);
    fetchData();
  };

  // 🔹 Auto refresh
  useEffect(() => {
    fetchData();
    fetchUser();

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Revenue (ONLY PAID)
  const totalRevenue = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="dashboard">

      {/* 🔵 SIDEBAR */}
      <div className="sidebar">
        <h2>🏠 HostelHub</h2>
        <p>Dashboard</p>
        <p>Rooms</p>
        <p>Complaints</p>
        <p>Payments</p>
        <p onClick={logout}>Logout</p>
      </div>

      {/* 🟣 MAIN */}
      <div className="main">

        {/* 🔹 TOP BAR */}
        <div className="topbar">
          <h2>Admin Dashboard</h2>
          <h3>{user.username}</h3>
        </div>

        {/* 💰 REVENUE */}
        <div className="stats">
          <div className="card">
            <h3>Total Revenue</h3>
            <p>₹{totalRevenue}</p>
          </div>
        </div>

        {/* 🟣 ROOMS */}
        <h3 style={{ marginTop: "20px" }}>Room Occupancy</h3>

        <div className="stats">
          {rooms.map((r) => {
            const percent = (r.occupied / r.capacity) * 100;

            return (
              <div className="card" key={r.id}>
                <h3>Room {r.number}</h3>
                <p>{r.occupied} / {r.capacity}</p>

                <div style={{
                  background: "#333",
                  height: "6px",
                  borderRadius: "5px"
                }}>
                  <div style={{
                    width: `${percent}%`,
                    background: "#00c6ff",
                    height: "100%"
                  }}></div>
                </div>

                <p>
                  {r.status === "full" && "🔴 Full"}
                  {r.status === "partial" && "🟠 Partial"}
                  {r.status === "empty" && "🟢 Empty"}
                </p>
              </div>
            );
          })}
        </div>

        {/* 🟢 COMPLAINTS */}
        <h3 style={{ marginTop: "30px" }}>Complaints</h3>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Complaint</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((c, i) => (
                <tr key={i}>
                  <td>{c.text}</td>
                  <td>{c.priority}</td>
                  <td>{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 💳 PAYMENTS */}
        <h3 style={{ marginTop: "30px" }}>Payments</h3>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.user}</td>
                  <td>₹{p.amount}</td>
                  <td>{p.status}</td>
                  <td>
                    {p.status === "Pending" && (
                      <button
                        className="btn"
                        onClick={() => markPaid(p.id)}
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Admin;