const times = Array.from({ length: 24 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2);
  const min = i % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${min}`;
});

const CalendarGrid = ({ slots, days, onClickSlot }) => {

  // ✅ 一致チェック
  const findSlot = (day, time) => {

    const result = slots.find((s) => {
      const match = String(s.day) === String(day)
                 && String(s.time) === String(time);

      if (match) {
        console.log("③ 一致した:", s); // ★デバッグ③
      }

      return match;
    });

    return result;
  };

  return (
    <div>

      {/* ヘッダー */}
      <div style={{ display: "flex" }}>
        <div style={{ width: "80px" }} />
        {days.map((d) => (
          <div key={d} style={{ width: "100px" }}>
            {d}
          </div>
        ))}
      </div>

      {/* 本体 */}
      {times.map((time) => (
        <div key={time} style={{ display: "flex" }}>
          <div style={{ width: "80px" }}>{time}</div>

          {days.map((day) => {
            const slot = findSlot(day, time);

            return (
              <div
                key={day + time}
                onClick={() => {
                  console.log("② クリック:", day, time, slot); // ★デバッグ②
                  onClickSlot(day, time, slot);
                }}
                style={{
                  width: "100px",
                  height: "40px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  backgroundColor: slot
                    ? slot.status === "available"
                      ? "#90ee90"
                      : "#f08080"
                    : "#f5f5f5"
                }}
              >
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;
