import { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

function Student() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [myRoom, setMyRoom] = useState(null);
  const [match, setMatch] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(false);

  // 🔹 Fetch rooms
  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/rooms/");
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms", err);
    }
  };

  // 🔹 Fetch user's room
  const fetchMyRoom = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      const res = await axios.get(
        `http://127.0.0.1:8000/api/my-room/${user_id}/`
      );
      setMyRoom(res.data.room);
    } catch (err) {
      console.error("Error fetching room", err);
    }
  };

  // 🔹 Book room
  const bookRoom = async (room_id) => {
    try {
      const user_id = localStorage.getItem("user_id");

      const res = await axios.post(
        "http://127.0.0.1:8000/api/book-room/",
        {
          user_id,
          room_id
        }
      );

      alert(res.data.message || res.data.error);

      fetchRooms();
      fetchMyRoom();
    } catch (err) {
      alert("Error booking room");
      console.error(err);
    }
  };

  // 🔹 AI roommate match
  const findMatch = async () => {
    try {
      setLoadingMatch(true);

      const user_id = localStorage.getItem("user_id");

      const res = await axios.get(
        `http://127.0.0.1:8000/api/match-roommate/${user_id}/`
      );

      setMatch(res.data);
    } catch (err) {
      alert("Error finding match");
      console.error(err);
    } finally {
      setLoadingMatch(false);
    }
  };

  // 🔹 Submit complaint
  const submitComplaint = async () => {
    if (!text.trim()) {
      alert("Please enter a complaint");
      return;
    }

    try {
      const user_id = localStorage.getItem("user_id");

      const formData = new FormData();
      formData.append("user_id", Number(user_id));
      formData.append("text", text);
      if (image) formData.append("image", image);

      await axios.post(
        "http://127.0.0.1:8000/api/add-complaint/",
        formData
      );

      alert("Complaint Submitted!");
      setText("");
      setImage(null);
    } catch (err) {
      alert("Error submitting complaint");
      console.error(err);
    }
  };

  // 🔹 Load on start
  useEffect(() => {
    fetchRooms();
    fetchMyRoom();
  }, []);

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>🎓 Student</h2>
        <p>Dashboard</p>
        <p>Rooms</p>
        <p>Complaints</p>
      </div>

      {/* Main */}
      <div className="main">

        {/* 🟣 ROOM SECTION */}
        <h2>Your Room: {myRoom ? `Room ${myRoom}` : "Not Assigned"}</h2>

        <div className="stats">
          {rooms.map((r) => (
            <div className="card" key={r.id}>
              <h3>Room {r.number}</h3>
              <p>{r.occupied} / {r.capacity}</p>

              <button
                className="btn"
                onClick={() => bookRoom(r.id)}
                disabled={r.available === 0}
              >
                {r.available === 0 ? "Full" : "Select Room"}
              </button>
            </div>
          ))}
        </div>

        {/* 🤖 AI MATCH */}
        <div className="table-box" style={{ marginTop: "30px" }}>
          <h3>🤖 AI Roommate Match</h3>

          <button className="btn" onClick={findMatch}>
            {loadingMatch ? "Finding..." : "Find Best Match"}
          </button>

          {match && match.name ? (
            <div style={{
              marginTop: "15px",
              background: "rgba(255,255,255,0.1)",
              padding: "15px",
              borderRadius: "10px"
            }}>
              <p><b>👤 Name:</b> {match.name}</p>
              <p><b>📚 Course:</b> {match.course}</p>
              <p><b>🎓 Year:</b> {match.year}</p>
              <p><b>🌙 Sleep:</b> {match.sleep}</p>
              <p><b>⭐ Score:</b> {match.score}</p>
            </div>
          ) : match?.message ? (
            <p style={{ marginTop: "10px" }}>{match.message}</p>
          ) : null}
        </div>

        {/* 🟢 COMPLAINT SECTION */}
        <div className="table-box" style={{ marginTop: "30px" }}>
          <h3>Raise Complaint</h3>

          <textarea
            placeholder="Enter complaint"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px"
            }}
          />

          <br /><br />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <br /><br />

          <button className="btn" onClick={submitComplaint}>
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}

export default Student;