import "./EventDrawer.css";

function EventDrawer({
  event,
  onClose,
  onDelete,
  onApprove,
  onReject
}) {
  if (!event) return null;

  const formatDateTime = (value) => {
    if (!value) return "";

    const date = new Date(value);

    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusLabel = (status) => {
    if (status === "available") return "空き枠";
    if (status === "pending") return "予約申請中";
    if (status === "reserved") return "面接確定";
    return status;
  };

  const getStatusClassName = (status) => {
    if (status === "available") return "status-available";
    if (status === "pending") return "status-pending";
    if (status === "reserved") return "status-reserved";
    return "";
  };

  return (
    <div className="drawer-overlay">
      <div className="event-drawer">
        <div className="event-drawer-header">
          <div>
            <h2>{event.title}</h2>
            <span
              className={`event-status ${getStatusClassName(
                event.status
              )}`}
            >
              {getStatusLabel(event.status)}
            </span>
          </div>

          <button
            className="drawer-close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="event-drawer-body">
          <div className="event-detail-row">
            <span className="event-detail-label">
              開始
            </span>
            <span>
              {formatDateTime(event.start)}
            </span>
          </div>

          <div className="event-detail-row">
            <span className="event-detail-label">
              終了
            </span>
            <span>
              {formatDateTime(event.end)}
            </span>
          </div>

          {event.jobSeeker && (
            <div className="event-detail-row">
              <span className="event-detail-label">
                求職者
              </span>
              <span>{event.jobSeeker}</span>
            </div>
          )}

          {event.email && (
            <div className="event-detail-row">
              <span className="event-detail-label">
                メール
              </span>
              <span>{event.email}</span>
            </div>
          )}
        </div>

        <div className="event-drawer-actions">
          {event.status === "available" && (
            <button
              className="drawer-delete-button"
              onClick={() => onDelete(event.id)}
            >
              空き枠を削除
            </button>
          )}

          {event.status === "pending" && (
            <>
              <button
                className="drawer-approve-button"
                onClick={() => onApprove(event.id)}
              >
                承認する
              </button>

              <button
                className="drawer-reject-button"
                onClick={() => onReject(event.id)}
              >
                却下する
              </button>
            </>
          )}

          <button
            className="drawer-cancel-button"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDrawer;
