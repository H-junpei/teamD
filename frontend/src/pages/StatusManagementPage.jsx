import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StatusManagementPage.css";

const API_BASE_URL = "http://127.0.0.1:5000";

const DEFAULT_MEMO = `【スキル・経験】
・

【資格】
・

【印象】
・

【補足】
・`;

function StatusManagementPage() {
  const navigate = useNavigate();

  const [jobSeekers, setJobSeekers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchJobSeekers();
  }, []);

  const fetchJobSeekers = async () => {
    setLoading(true);
    setMessage("");

    try {
      const adminId = localStorage.getItem("adminId");
      const response = await fetch(
        `${API_BASE_URL}/api/job-seekers/status/${adminId}`
    );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "求職者情報の取得に失敗しました"
        );
      }

      setJobSeekers(data.job_seekers || []);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobSeekers = useMemo(() => {
    if (!keyword.trim()) {
      return jobSeekers;
    }

    const lowerKeyword = keyword.toLowerCase();

    return jobSeekers.filter((jobSeeker) => {
      return (
        jobSeeker.name?.toLowerCase().includes(lowerKeyword) ||
        jobSeeker.email?.toLowerCase().includes(lowerKeyword)
      );
    });
  }, [jobSeekers, keyword]);

  const handleStatusChange = (
    jobSeekerId,
    status
  ) => {
    setJobSeekers((prev) =>
      prev.map((jobSeeker) =>
        jobSeeker.job_seeker_id === jobSeekerId
          ? {
              ...jobSeeker,
              status,
            }
          : jobSeeker
      )
    );
  };

  const handleMemoChange = (
    jobSeekerId,
    memo
  ) => {
    setJobSeekers((prev) =>
      prev.map((jobSeeker) =>
        jobSeeker.job_seeker_id === jobSeekerId
          ? {
              ...jobSeeker,
              memo,
            }
          : jobSeeker
      )
    );
  };

  const handleSave = async (jobSeeker) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/job-seekers/${jobSeeker.job_seeker_id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: jobSeeker.status,
            memo:
              jobSeeker.memo?.trim() ||
              DEFAULT_MEMO,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "保存に失敗しました"
        );
      }

      setMessage(
        `${jobSeeker.name} さんの情報を保存しました`
      );
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  return (
    <div className="status-page">
      <div className="status-header">
        <button
          className="back-button"
          onClick={() => navigate("/admin/page")}
        >
          ← 管理者メニューへ戻る
        </button>

        <h1>求職者情報管理</h1>

        <button
          className="reload-button"
          onClick={fetchJobSeekers}
        >
          再読み込み
        </button>
      </div>

      <input
        type="text"
        className="search-input"
        placeholder="名前・メールで検索"
        value={keyword}
        onChange={(e) =>
          setKeyword(e.target.value)
        }
      />

      {message && (
        <div className="message-box">
          {message}
        </div>
      )}

      {loading ? (
        <div className="loading-box">
          読み込み中...
        </div>
      ) : (
        <div className="status-list">
          {filteredJobSeekers.map((jobSeeker) => (
            <div
              key={jobSeeker.job_seeker_id}
              className="status-card"
            >
              <div className="info-area">
                <h3>{jobSeeker.name}</h3>

                <p>{jobSeeker.email}</p>

                <small>
                  求職者ID :
                  {jobSeeker.job_seeker_id}
                </small>
              </div>

              <div className="action-area">

                <label className="field-label">
                  面談状況
                </label>

                <select
                  value={
                    jobSeeker.status ||
                    "面談前"
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      jobSeeker.job_seeker_id,
                      e.target.value
                    )
                  }
                >
                  <option value="面接前">
                    面説前
                  </option>

                  <option value="一次面接済">
                    一次面接済
                  </option>

                  <option value="二次面接済み">
                    二次面接済み
                  </option>

                  <option value="最終面接済み">
                    二次面接済み
                  </option>

                  <option value="内定">
                    内定
                  </option>

                  <option value="辞退">
                    辞退
                  </option>

                  <option value="不採用">
                    不採用
                  </option>
                </select>

                <label className="field-label">
                  求職者メモ
                </label>

                <textarea
                  className="memo-textarea"
                  value={
                    jobSeeker.memo ||
                    DEFAULT_MEMO
                  }
                  onChange={(e) =>
                    handleMemoChange(
                      jobSeeker.job_seeker_id,
                      e.target.value
                    )
                  }
                />

                <button
                  className="save-button"
                  onClick={() =>
                    handleSave(jobSeeker)
                  }
                >
                  保存
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatusManagementPage;
