import { useEffect, useState } from "react";
import AdminCalendarV2 from "../components/AdminCalendarV2";
import EventDrawer from "../components/EventDrawer";
import "../components/AdminCalendarV2.css";
import "../components/EventDrawer.css";

const API_BASE_URL = "http://127.0.0.1:5000";

function AdminPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/events`
      );

      const data = await response.json();

      if (response.ok) {
        setEvents(data);
      } else {
        alert(data.message || "予定の取得に失敗しました");
      }
    } catch (error) {
      console.error(error);
      alert("サーバーとの通信に失敗しました");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setSelectedEvent(null);
    setIsDrawerOpen(false);
  };

  const handleAddSlot = async ({ day, time }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/slots`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            day,
            time
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        await fetchEvents();
      } else {
        alert(data.message || "空き枠の追加に失敗しました");
      }
    } catch (error) {
      console.error(error);
      alert("サーバーとの通信に失敗しました");
    }
  };

  const handleDeleteSlot = async (slotId) => {
    const ok = window.confirm(
      "この空き枠を削除しますか？"
    );

    if (!ok) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/slots/${slotId}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "空き枠を削除しました");
        handleCloseDrawer();
        await fetchEvents();
      } else {
        alert(data.message || "空き枠の削除に失敗しました");
      }
    } catch (error) {
      console.error(error);
      alert("サーバーとの通信に失敗しました");
    }
  };

  const handleApprove = async (slotId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/approve/${slotId}`,
        {
          method: "POST"
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "予約を承認しました");
        handleCloseDrawer();
        await fetchEvents();
      } else {
        alert(data.message || "予約承認に失敗しました");
      }
    } catch (error) {
      console.error(error);
      alert("サーバーとの通信に失敗しました");
    }
  };

  const handleReject = async (slotId) => {
    const ok = window.confirm(
      "この予約申請を却下しますか？"
    );

    if (!ok) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/reject/${slotId}`,
        {
          method: "POST"
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "予約を却下しました");
        handleCloseDrawer();
        await fetchEvents();
      } else {
        alert(data.message || "予約却下に失敗しました");
      }
    } catch (error) {
      console.error(error);
      alert("サーバーとの通信に失敗しました");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>管理者カレンダー</h1>
        <p>
          30分単位で空き時間を登録・削除できます。
        </p>
      </div>

      <AdminCalendarV2
        events={events}
        onAddSlot={handleAddSlot}
        onEventClick={handleEventClick}
      />

      {isDrawerOpen && selectedEvent && (
        <EventDrawer
          event={selectedEvent}
          onClose={handleCloseDrawer}
          onDelete={handleDeleteSlot}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

export default AdminPage;
