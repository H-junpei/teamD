import "./AdminCalendarV2.css";
import CalendarEvent from "./CalendarEvent";

const TIMES = [];

for (let h = 8; h <= 20; h++) {
  TIMES.push(`${String(h).padStart(2, "0")}:00`);

  if (h !== 20) {
    TIMES.push(`${String(h).padStart(2, "0")}:30`);
  }
}

const AdminCalendarV2 = ({
  events = [],
  onEventClick,
  onCreateSlot,
}) => {
  // =========================
  // 今週の日付生成
  // =========================

  const getWeekDays = () => {
    const today = new Date();

    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);

      d.setDate(today.getDate() + i);

      days.push({
        date: d,
        dateString: d.toISOString().split("T")[0],
      });
    }

    return days;
  };

  const weekDays = getWeekDays();

  // =========================
  // イベント位置計算
  // =========================

  const calcTop = (start) => {
    const date = new Date(start);

    const hour = date.getHours();
    const minute = date.getMinutes();

    return (hour - 8) * 60 + minute;
  };

  const calcHeight = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    return (
      (endDate.getTime() - startDate.getTime()) /
      1000 /
      60
    );
  };

  return (
    <div className="admin-calendar-v2">
      {/* ヘッダー */}

      <div className="calendar-header">
        <div className="time-column-header">
          時間
        </div>

        {weekDays.map((day) => (
          <div
            key={day.dateString}
            className="day-header"
          >
            <div>
              {day.date.getMonth() + 1}/
              {day.date.getDate()}
            </div>

            <div>
              {
                [
                  "日",
                  "月",
                  "火",
                  "水",
                  "木",
                  "金",
                  "土",
                ][day.date.getDay()]
              }
            </div>
          </div>
        ))}
      </div>

      {/* 本体 */}

      <div className="calendar-body">
        {/* 時間列 */}

        <div className="time-column">
          {TIMES.map((time) => (
            <div
              key={time}
              className="time-slot"
            >
              {time}
            </div>
          ))}
        </div>

        {/* 日付列 */}

        {weekDays.map((day) => {
          const dayEvents = events.filter(
            (event) =>
              event.start.startsWith(
                day.dateString
              )
          );

          return (
            <div
              key={day.dateString}
              className="day-column"
            >
              {/* 30分ブロック */}

              {TIMES.map((time) => (
                <div
                  key={time}
                  className="hour-row"
                  onClick={() =>
                    onCreateSlot?.(
                      day.dateString,
                      time
                    )
                  }
                />
              ))}

              {/* イベント */}

              {dayEvents.map((event) => (
                <CalendarEvent
                  key={event.id}
                  event={event}
                  onClick={onEventClick}
                  style={{
                    top: `${calcTop(
                      event.start
                    )}px`,
                    height: `${calcHeight(
                      event.start,
                      event.end
                    )}px`,
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminCalendarV2;
