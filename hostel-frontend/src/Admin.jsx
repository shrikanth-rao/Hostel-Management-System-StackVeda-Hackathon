import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Admin() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/complaints/");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const total = data.length;
  const high = data.filter(c => c.priority === "High").length;
  const medium = data.filter(c => c.priority === "Medium").length;
  const low = data.filter(c => c.priority === "Low").length;

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>🏠 Admin</h2>
        <p>Dashboard</p>
        <p>Complaints</p>
        <p>Rooms</p>
        <p>Payments</p>
      </div>

      {/* Main */}
      <div className="main">
        <div className="header">Admin Dashboard</div>

        {/* Stats */}
        <div className="stats">
          <div className="card">Total: {total}</div>
          <div className="card high">High: {high}</div>
          <div className="card medium">Medium: {medium}</div>
          <div className="card low">Low: {low}</div>
        </div>

        {/* Table */}
        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Complaint</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Image</th>
              </tr>
            </thead>

            <tbody>
              {data.map((c, i) => (
                <tr key={i}>
                  <td>{c.text}</td>
                  <td>{c.priority}</td>
                  <td>{c.status}</td>
                  <td>
                    {c.image ? (
                      <img src={`http://127.0.0.1:8000${c.image}`} width="80" />
                    ) : "No Image"}
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