import { useEffect, useState } from "react";
import axios from "axios";
import CalendarGrid from "../components/CalendarGrid";

const API_BASE = "http://127.0.0.1:5000";

const reservation = () => {
  const [slots, setSlots] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userName = localStorage.getItem("user_name");

  const fetchSlots = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.get(`${API_BASE}/api/slots`);
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

  const generateDays = () => {
    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      days.push(d.toISOString().split("T")[0]);
    }

    return days;
  };

  const days = generateDays();

  const prevWeek = () => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() - 7);
    setStartDate(d);
  };

  const nextWeek = () => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + 7);
    setStartDate(d);
  };

  const handleClickSlot = async (day, time, slot) => {
    // 枠がない or available でないなら予約しない
    if (!slot || slot.status !== "available") {
      return;
    }

    const ok = window.confirm(`${day} ${time} を予約しますか？`);
    if (!ok) return;

    try {
      setMessage("");

      await axios.post(`${API_BASE}/api/reserve`, {
        day,
        time,
        name: userName || ""
      });

      setMessage(`予約完了：${day} ${time}`);
      await fetchSlots();
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("予約に失敗しました");
      }
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2>予約ページ</h2>

      {userName && <p>利用者名：{userName}</p>}

      <div style={{ marginBottom: "12px" }}>
        <button onClick={prevWeek}>← 前の週</button>
        <button onClick={nextWeek} style={{ marginLeft: "8px" }}>
          次の週 →
        </button>
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
        <CalendarGrid
          slots={slots}
          days={days}
          onClickSlot={handleClickSlot}
        />
      )}

      <p style={{ marginTop: "12px" }}>
        ※ 緑の枠をクリックすると予約できます
      </p>
    </div>
  );
};

export default reservation;
