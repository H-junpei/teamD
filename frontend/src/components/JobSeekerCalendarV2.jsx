import { useMemo } from "react";
import AdminCalendarV2 from "./AdminCalendarV2";

const JobSeekerCalendarV2 = ({ slots, onClickSlot }) => {

  // slots → events に変換
  const events = useMemo(() => {
    return slots.map((slot) => {
      const start = new Date(`${slot.day}T${slot.time}`);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 30);

      return {
        id: slot.id,
        start,
        end,
        status: slot.status,
        raw: slot, // 元データ保持
      };
    });
  }, [slots]);

  // クリック時（予約処理）
  const handleEventClick = (event) => {
    // 空き枠以外はクリック不可
    if (event.status !== "available") return;

    const day = event.start.toISOString().split("T")[0];
    const time = event.start.toTimeString().slice(0, 5);

    onClickSlot?.(day, time, event.raw);
  };

  return (
    <AdminCalendarV2
      events={events}
      onEventClick={handleEventClick}
      onAddSlot={null} // 管理者用機能は無効
    />
  );
};

export default JobSeekerCalendarV2;
