import "./CalendarEvent.css";

const CalendarEvent = ({
  event,
  style,
  onClick,
}) => {
  const getStatusLabel = (status) => {
    switch (status) {
      case "available":
        return "空き枠";

      case "pending":
        return "予約申請";

      case "reserved":
        return "面接確定";

      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "available":
        return "event-available";

      case "pending":
        return "event-pending";

      case "reserved":
        return "event-reserved";

      default:
        return "";
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`calendar-event-card ${getStatusClass(
        event.status
      )}`}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(event);
      }}
    >
      <div className="event-status">
        {getStatusLabel(event.status)}
      </div>

      {event.jobSeeker && (
        <div className="event-seeker">
          {event.jobSeeker}
        </div>
      )}

      <div className="event-time">
        {formatTime(event.start)}
        {" ～ "}
        {formatTime(event.end)}
      </div>
    </div>
  );
};

export default CalendarEvent;
