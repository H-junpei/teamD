import { useEffect, useState } from "react";
import axios from "axios";
import JobSeekerCalendarV2 from "../components/JobSeekerCalendarV2";

const API_BASE = "http://127.0.0.1:5000";

const Reservation = () => {
  const [slots, setSlots] = useState([]);
  //const [startDate, setStartDate] = useState(new Date());
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div style={{ padding: "24px" }}>
      <h2>予約ページ</h2>

      {userName && <p>利用者名：{userName}</p>}

      <div style={{ marginBottom: "12px" }}>
        <button onClick={fetchSlots} style={{ marginLeft: "8px" }}>
          再読み込み
        </button>
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
        ※ 緑の枠は予約できます。自分の承認待ち枠はクリックで取り消せます。
      </p>
    </div>
  );
};

export default Reservation;
