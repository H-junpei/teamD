import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:5000";

function AdminJobSeekerRomove() {
  const navigate = useNavigate();

  const [jobSeekers, setJobSeekers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchJobSeekers();
  }, []);

  const fetchJobSeekers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/job-seekers`);
      const data = await res.json();
      setJobSeekers(data.job_seekers || []);
    } catch (err) {
      setMessage("取得失敗");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("削除しますか？")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/job-seekers/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("削除失敗");

      setMessage("削除しました");
      fetchJobSeekers();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/admin/job-seeker-links")}>
        ← 戻る
      </button>

      <h1>求職者削除画面</h1>

      {message && <p>{message}</p>}

      {jobSeekers.map((js) => (
        <div key={js.job_seeker_id}>
          <span>{js.name}</span>
          <span>{js.email}</span>

          <button onClick={() => handleDelete(js.job_seeker_id)}>
            削除
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminJobSeekerRomove;
