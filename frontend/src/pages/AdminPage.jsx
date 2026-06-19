import { useState, useEffect } from "react";
import axios from "axios";
import CalendarGrid from "../components/CalendarGrid";

const AdminPage = () => {
  const [slots, setSlots] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  // ✅ 初期取得
  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = () => {
    axios.get("http://127.0.0.1:5000/api/slots")
      .then(res => {
        console.log("① APIから来たslots:", res.data); // デバッグ①
        setSlots(res.data);
      })
      .catch(err => console.error(err));
  };

  // ✅ 日付生成（7日分）
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

  // ✅ 前週・次週
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

  // ✅ クリック処理（トグル）
  const handleClickSlot = (day, time, slot) => {
    console.log("② クリック:", day, time, slot); // デバッグ②

    // 🔵 既に予約済みなら触れない（任意）
    if (slot?.status === "reserved") {
      return;
    }

    // ✅ 未登録 → 追加
    if (!slot) {
      axios.post("http://127.0.0.1:5000/api/admin/slots", {
        day,
        time
      })
      .then(() => {
        console.log("✅ 追加成功");
        fetchSlots();
      })
      .catch(err => console.error(err));
    }

    // ✅ 登録済 → 削除（トグル）
    else if (slot.status === "available") {
      axios.delete("http://127.0.0.1:5000/api/admin/slots", {
        data: { day, time }
      })
      .then(() => {
        console.log("🗑️ 削除成功");
        fetchSlots();
      })
      .catch(err => console.error(err));
    }
  };

  return (
    <div>
      <h2>管理者：空き登録</h2>

      {/* ✅ 週移動 */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={prevWeek}>← 前の週</button>
        <button onClick={nextWeek}>次の週 →</button>
      </div>

      {/* ✅ カレンダー */}
      <CalendarGrid
        slots={slots}
        days={days}
        onClickSlot={handleClickSlot}
      />

      {/* ✅ 説明 */}
      <p>※クリックで登録 / もう一度クリックで削除</p>
    </div>
  );
};

export default AdminPage;
