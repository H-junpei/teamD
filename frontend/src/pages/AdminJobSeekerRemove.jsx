import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminJobSeekerRemove.css";

const API_BASE_URL = "http://127.0.0.1:5000";

function AdminJobSeekerRemove() {
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
    <div className="admin-jobseeker-remove-page">

      {/* 戻るボタン */}
      <button
        className="back-admin-button"
        onClick={() => navigate("/admin/job-seeker-links")}
      >
        <span className="back-icon">←</span>
        戻る
      </button>

      {/* ヘッダー */}
      <div className="remove-page-header">
        <h1>求職者削除</h1>
        <p>登録済みの求職者を削除できます</p>
      </div>

      {/* メッセージ */}
      {message && (
        <div className="remove-message">
          {message}
        </div>
      )}

      {/* 一覧 */}
      <div className="remove-list-panel">

        <div className="remove-panel-header">
          <h2>求職者一覧</h2>
          <span className="remove-count">
            {jobSeekers.length}人
          </span>
        </div>

        <div className="remove-list">
          {jobSeekers.length === 0 ? (
            <p className="empty-text">データがありません</p>
          ) : (
            jobSeekers.map((js) => (
              <div
                key={js.job_seeker_id}
                className="remove-card"
              >
                <div className="remove-name">
                  {js.name}
                </div>

                <div className="remove-email">
                  {js.email}
                </div>

                <span className="remove-id">
                  ID: {js.job_seeker_id}
                </span>

                <button
                  className="delete-button"
                  onClick={() => handleDelete(js.job_seeker_id)}
                >
                  削除
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminJobSeekerRemove;
