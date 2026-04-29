import { useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Student() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const submitComplaint = async () => {
    const user_id = localStorage.getItem("user_id");

    const formData = new FormData();
    formData.append("user_id", Number(user_id));
    formData.append("text", text);
    if (image) formData.append("image", image);

    await axios.post("http://127.0.0.1:8000/api/add-complaint/", formData);

    alert("Submitted!");
    setText("");
    setImage(null);
  };

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>🎓 Student</h2>
        <p>Dashboard</p>
        <p>Raise Complaint</p>
        <p>My Room</p>
      </div>

      {/* Main */}
      <div className="main">
        <div className="header">Raise Complaint</div>

        <div className="table-box">
          <textarea
            placeholder="Enter complaint"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
          />

          <br /><br />

          <input type="file" onChange={(e) => setImage(e.target.files[0])} />

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