import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import JobSeekerCalendarV2 from "../components/JobSeekerCalendarV2";

const API_BASE = "http://127.0.0.1:5000";

const Reservation = () => {
  const [slots, setSlots] = useState([]);
  //const [startDate, setStartDate] = useState(new Date());
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userName = localStorage.getItem("user_name");

  const jobSeekerId = localStorage.getItem("job_seeker_id");

  const fetchSlots = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.get(`${API_BASE}/api/slots`, {
        params: {
          job_seeker_id: jobSeekerId
        }
      });
      setSlots(res.data);
    } catch (err) {
      console.error(err);
      setMessage("スロットの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("job_seeker_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");

    navigate("/jobseeker/login");
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleClickSlot = async (day, time, slot) => {

    if (!slot) {
      return;
    }

    try {
      setMessage("");
      if (slot.status === "available") {
        const ok = window.confirm(`${day} ${time} を予約しますか？`);
        if (!ok) return;

        await axios.post(`${API_BASE}/api/reserve`, {
          time_slot_id: slot.id,
          day,
          time,
          name: userName || ""
        });

        setMessage(`予約完了：${day} ${time}`);
        await fetchSlots();
        return;
      }

      if (
        slot.status === "pending" &&
        String(slot.job_seeker_id) === String(jobSeekerId)
      ) {
        const ok = window.confirm(`${day} ${time} の予約を取り消しますか？`);
        if (!ok) return;

        await axios.post(`${API_BASE}/api/reserve/cancel`, {
          time_slot_id: slot.id,
          job_seeker_id: jobSeekerId
        });

        setMessage(`予約を取り消しました：${day} ${time}`);
        await fetchSlots();
        return;
      }
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("処理に失敗しました");
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>
          {userName ? `${userName}さんの予約カレンダー` : "予約カレンダー"}
        </h1>

        <p>
          予約の登録・確認・取消ができます。
        </p>

        <div className="admin-header-actions">
          <button
            className="refresh-button"
            onClick={fetchSlots}
          >
            🔄
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            ログアウト
          </button>
        </div>
      </div>

      {message && (
        <p style={{ marginBottom: "12px" }}>
          {message}
        </p>
      )}

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <JobSeekerCalendarV2
          slots={slots}
          onClickSlot={handleClickSlot}
        />
      )}

      <p style={{ marginTop: "12px" }}>
        ※ 青の枠は予約できます。自分の承認待ち枠はクリックで取り消せます。
      </p>
    </div>
  );
};

export default Reservation;
