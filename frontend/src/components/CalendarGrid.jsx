import TimeSlot from "./TimeSlot";

const times = Array.from({ length: 24 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2);
  const min = i % 2 === 0 ? "00" : "30";
  return `${hour}:${min}`;
});

const days = ["月", "火", "水", "木", "金", "土", "日"];

const CalendarGrid = ({ slots, onClickSlot, isAdmin }) => {
  const findSlot = (day, time) => {
    return slots.find((s) => s.day === day && s.time === time);
  };

  return (
    <div>
      {/* ヘッダー */}
      <div style={{ display: "grid", gridTemplateColumns: "80px repeat(7, 1fr)" }}>
        <div></div>
        {days.map((d) => (
          <div key={d} style={{ textAlign: "center", fontWeight: "bold" }}>
            {d}
          </div>
        ))}
      </div>

      {/* 本体 */}
      {times.map((time) => (
        <div
          key={time}
          style={{ display: "grid", gridTemplateColumns: "80px repeat(7, 1fr)" }}
        >
          <div>{time}</div>
          {days.map((day) => {
            const slot = findSlot(day, time);

            return (
              <TimeSlot
                key={day + time}
                slot={slot}
                day={day}
                time={time}
                onClick={onClickSlot}
                isAdmin={isAdmin}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;
