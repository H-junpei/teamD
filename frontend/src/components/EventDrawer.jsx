import "./EventDrawer.css";

const EventDrawer = ({
  event,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !event) return null;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "available":
        return "空き枠";

      case "pending":
        return "予約申請中";

      case "reserved":
        return "予約確定";

      default:
        return status;
    }
  };

  return (
    <>
      <div
        className="drawer-overlay"
        onClick={onClose}
      />

      <div className="event-drawer">
        <div className="drawer-header">
          <h2>面接詳細</h2>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="drawer-content">
          <div className="info-section">
            <div className="label">
              ステータス
            </div>

            <div className="value">
              {getStatusLabel(event.status)}
            </div>
          </div>

          <div className="info-section">
            <div className="label">
              タイトル
            </div>

            <div className="value">
              {event.title}
            </div>
          </div>

          <div className="info-section">
            <div className="label">
              求職者
            </div>

            <div className="value">
              {event.jobSeeker || "-"}
            </div>
          </div>

          <div className="info-section">
            <div className="label">
              メール
            </div>

            <div className="value">
              {event.email || "-"}
            </div>
          </div>

          <div className="info-section">
            <div className="label">
              開始
            </div>

            <div className="value">
              {formatDateTime(event.start)}
            </div>
          </div>

          <div className="info-section">
            <div className="label">
              終了
            </div>

            <div className="value">
              {formatDateTime(event.end)}
            </div>
          </div>

          {event.memo && (
            <div className="info-section">
              <div className="label">
                備考
              </div>

              <div className="value">
                {event.memo}
              </div>
            </div>
          )}
        </div>

        {event.status === "pending" && (
          <div className="drawer-footer">
            <button
              className="approve-button"
              onClick={() =>
                onApprove(event.id)
              }
            >
              承認
            </button>

            <button
              className="reject-button"
              onClick={() =>
                onReject(event.id)
              }
            >
              却下
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default EventDrawer;
