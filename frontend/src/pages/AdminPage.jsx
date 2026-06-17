import { useState } from "react";
import CalendarGrid from "../components/CalendarGrid";

const AdminPage = () => {
  const [slots, setSlots] = useState([]);

  const handleClickSlot = (day, time, slot) => {
    if (!slot) {
      // 空 → 空き登録
      setSlots([
        ...slots,
        { day, time, status: "available" }
      ]);
    } else if (slot.status === "available") {
      // もう一回押すと削除
      setSlots(slots.filter((s) => !(s.day === day && s.time === time)));
    }
  };

  return (
    <div>
      <h2>管理者：空き登録</h2>
      <CalendarGrid
        slots={slots}
        onClickSlot={handleClickSlot}
        isAdmin={true}
      />
    </div>
  );
};

export default AdminPage;
