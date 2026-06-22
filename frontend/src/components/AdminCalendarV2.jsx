import { useState } from "react";
import "./AdminCalendarV2.css";
import CalendarEvent from "./CalendarEvent";

const TIMES = [];

for (let h = 8; h <= 20; h++) {
  TIMES.push(`${String(h).padStart(2, "0")}:00`);

  if (h !== 20) {
    TIMES.push(`${String(h).padStart(2, "0")}:30`);
  }
}

const WEEK_DAYS = [
  "日",
  "月",
  "火",
  "水",
  "木",
  "金",
  "土",
];

const formatDateLocal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatMonthDay = (date) => {
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const getStartOfWeek = (baseDate) => {
  const date = new Date(baseDate);
  const day = date.getDay();

  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);

  return date;
};

const AdminCalendarV2 = ({
  events = [],
  onEventClick,
  onAddSlot,
}) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getStartOfWeek(new Date())
  );

  // =========================
  // 表示中の週の日付生成
  // =========================
  const getWeekDays = () => {
    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(currentWeekStart.getDate() + i);

      days.push({
        date: d,
        dateString: formatDateLocal(d),
      });
    }

    return days;
  };

  const weekDays = getWeekDays();

  // =========================
  // 週移動
  // =========================
  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      return newDate;
    });
  };

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      return newDate;
    });
  };

  const goToThisWeek = () => {
    setCurrentWeekStart(getStartOfWeek(new Date()));
  };

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

  const getEventDateString = (event) => {
    const date = new Date(event.start);
    return formatDateLocal(date);
  };

  const handleSlotClick = (day, time) => {
    onAddSlot?.({
      day,
      time,
    });
  };

  const weekRangeLabel = `${formatMonthDay(
    weekDays[0].date
  )} - ${formatMonthDay(weekDays[6].date)}`;

  return (
    <div className="admin-calendar-v2">
      {/* 週ナビゲーション */}
      <div className="calendar-toolbar">
        <div className="calendar-toolbar-left">
          <button
            className="week-nav-button"
            onClick={goToPreviousWeek}
          >
            前の週
          </button>

          <button
            className="week-nav-button today-button"
            onClick={goToThisWeek}
          >
            今日
          </button>

          <button
            className="week-nav-button"
            onClick={goToNextWeek}
          >
            次の週
          </button>
        </div>

        <div className="calendar-week-label">
          {currentWeekStart.getFullYear()}年 {weekRangeLabel}
        </div>
      </div>

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
            <div className="day-header-date">
              {formatMonthDay(day.date)}
            </div>

            <div className="day-header-week">
              {WEEK_DAYS[day.date.getDay()]}
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
          const dayEvents = events.filter((event) => {
            return getEventDateString(event) === day.dateString;
          });

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
                    handleSlotClick(
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
                    top: `${calcTop(event.start)}px`,
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
