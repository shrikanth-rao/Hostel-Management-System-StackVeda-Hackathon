import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Admin() {
  const [complaints, setComplaints] = useState([]);
  const [rooms, setRooms] = useState([]);

  const fetchData = async () => {
    const c = await axios.get("http://127.0.0.1:8000/api/complaints/");
    const r = await axios.get("http://127.0.0.1:8000/api/rooms/");

    setComplaints(c.data);
    setRooms(r.data);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>🏠 Admin</h2>
        <p>Dashboard</p>
        <p>Rooms</p>
        <p>Complaints</p>
      </div>

      {/* Main */}
      <div className="main">
        <h2>Admin Dashboard</h2>

        {/* 🟣 ROOM SECTION */}
        <h3>Room Occupancy</h3>
        <div className="room-grid">
          {rooms.map(r => {
            const percent = (r.occupied / r.capacity) * 100;

            return (
              <div key={r.id} className={`room-card ${r.status}`}>
                <h3>Room {r.number}</h3>
                <p>{r.occupied} / {r.capacity}</p>

                <div className="bar">
                  <div
                    className="fill"
                    style={{ width: `${percent}%` }}
                  ></div>
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

        <div className="table-box">
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

      </div>
    </div>
  );
}

export default Admin;