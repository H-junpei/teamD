import { useState } from "react";
import CalendarGrid from "../components/CalendarGrid";

const UserPage = () => {
  const [slots, setSlots] = useState([]);

  const handleClickSlot = (day, time, slot) => {
    if (slot?.status === "available") {
      const name = "テストユーザー";

      const updated = slots.map((s) =>
        s.day === day && s.time === time
          ? {
              ...s,
              status: "reserved",
              user: { name },
            }
          : s
      );

      setSlots(updated);
    }
  };

  return (
    <div>
      <h2>日程選択</h2>
      <CalendarGrid
        slots={slots}
        onClickSlot={handleClickSlot}
        isAdmin={false}
      />
    </div>
  );
};

export default UserPage;
