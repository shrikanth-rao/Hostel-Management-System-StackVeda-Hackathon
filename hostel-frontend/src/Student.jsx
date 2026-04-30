import { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Student() {
  const [user, setUser] = useState({});
  const [rooms, setRooms] = useState([]);
  const [myRoom, setMyRoom] = useState(null);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [match, setMatch] = useState(null);

  const navigate = useNavigate();

  // 🔹 Fetch user
  const fetchUser = async () => {
    const id = localStorage.getItem("user_id");
    const res = await axios.get(`http://127.0.0.1:8000/api/user/${id}/`);
    setUser(res.data);
  };

  // 🔹 Fetch rooms
  const fetchRooms = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/rooms/");
    setRooms(res.data);
  };

  // 🔹 My room
  const fetchMyRoom = async () => {
    const user_id = localStorage.getItem("user_id");
    const res = await axios.get(
      `http://127.0.0.1:8000/api/my-room/${user_id}/`
    );
    setMyRoom(res.data.room);
  };

  // 🔹 Book room
  const bookRoom = async (room_id) => {
    const user_id = localStorage.getItem("user_id");

    const res = await axios.post(
      "http://127.0.0.1:8000/api/book-room/",
      { user_id, room_id }
    );

    alert(res.data.message || res.data.error);
    fetchRooms();
    fetchMyRoom();
  };

  // 🔹 AI match
  const findMatch = async () => {
    const user_id = localStorage.getItem("user_id");
    const res = await axios.get(
      `http://127.0.0.1:8000/api/match-roommate/${user_id}/`
    );
    setMatch(res.data);
  };

  // 🔹 Complaint
  const submitComplaint = async () => {
    const user_id = localStorage.getItem("user_id");

    const formData = new FormData();
    formData.append("user_id", Number(user_id));
    formData.append("text", text);
    if (image) formData.append("image", image);

    await axios.post(
      "http://127.0.0.1:8000/api/add-complaint/",
      formData
    );

    alert("Complaint submitted!");
    setText("");
    setImage(null);
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    fetchUser();
    fetchRooms();
    fetchMyRoom();
  }, []);

  return (
    <div className="dashboard">

      {/* 🔵 SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">🏠 HostelHub</h2>

        <div className="menu">
          <p>🏠 Dashboard</p>
          <p>🛏 Rooms</p>
          <p>📢 Complaints</p>
          <p>💳 Payments</p>
        </div>

        <div className="bottom">
          <p onClick={() => navigate("/student")}>🏠 Home</p>
          <p onClick={logout}>🚪 Logout</p>
        </div>
      </div>

      {/* 🟣 MAIN */}
      <div className="main">

        {/* 🔹 TOPBAR */}
        <div className="topbar">
          <h2>Welcome back, {user.username} 👋</h2>
          <div className="profile">{user.username}</div>
        </div>

        {/* 🔹 STATS */}
        <div className="stats">
          <div className="card">
            <h3>🏠 Your Room</h3>
            <p>{myRoom ? `Room ${myRoom}` : "Not Assigned"}</p>
          </div>

          <div className="card">
            <h3>💰 Hostel Fee</h3>
            <p>₹{user.hostel_fee}</p>
          </div>

          <div className="card">
            <h3>👨‍💼 Management</h3>
            <p>{user.admin_name || "Admin"}</p>
          </div>
        </div>

        {/* 🔹 ROOMS */}
        <h3 className="section">Available Rooms</h3>

        <div className="grid">
          {rooms.map((r) => (
            <div className="card room-card" key={r.id}>
              <h3>Room {r.number}</h3>
              <p>{r.occupied} / {r.capacity}</p>

              <button
                className="btn"
                onClick={() => bookRoom(r.id)}
                disabled={r.available === 0}
              >
                {r.available === 0 ? "Full" : "Select"}
              </button>
            </div>
          ))}
        </div>

        {/* 🤖 AI MATCH */}
        <div className="card">
          <h3>🤖 AI Roommate Match</h3>

          <button className="btn" onClick={findMatch}>
            Find Match
          </button>

          {match && (
            <div className="match-box">
              <p><b>{match.name}</b></p>
              <p>{match.course}</p>
              <p>Score: {match.score}</p>
            </div>
          )}
        </div>

        {/* 🟢 COMPLAINT */}
        <div className="card">
          <h3>Raise Complaint</h3>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe your issue..."
          />

          <input type="file" onChange={(e) => setImage(e.target.files[0])} />

          <button className="btn" onClick={submitComplaint}>
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}

export default Student;