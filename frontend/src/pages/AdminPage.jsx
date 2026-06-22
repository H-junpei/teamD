import { useEffect, useState } from "react";
import axios from "axios";

import AdminCalendarV2 from "../components/AdminCalendarV2";
import EventDrawer from "../components/EventDrawer";

const AdminPage = () => {
  const [events, setEvents] = useState([]);

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const [isDrawerOpen, setIsDrawerOpen] =
    useState(false);

  // =========================
  // イベント取得
  // =========================

  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:5000/api/admin/events"
      );

      setEvents(res.data);
    } catch (error) {
      console.error(
        "イベント取得失敗",
        error
      );
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // =========================
  // イベントクリック
  // =========================

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);
  };

  // =========================
  // Drawer閉じる
  // =========================

  const handleCloseDrawer = () => {
    setSelectedEvent(null);
    setIsDrawerOpen(false);
  };

  // =========================
  // 空き枠作成
  // =========================

  const handleCreateSlot = async (
    startDay,
    startTime,
    endDay,
    endTime
  ) => {
    try {
      await axios.post(
        "http://127.0.0.1:5000/api/admin/slots",
        {
          start_day: startDay,
          start_time: startTime,
          end_day: endDay,
          end_time: endTime,
        }
      );

      fetchEvents();
    } catch (error) {
      console.error(error);
      alert("空き枠登録に失敗しました");
    }
  };

  // =========================
  // 承認
  // =========================

  const handleApprove = async (slotId) => {
    try {
      await axios.post(
        `http://127.0.0.1:5000/api/admin/approve/${slotId}`
      );

      await fetchEvents();

      handleCloseDrawer();

      alert("予約を承認しました");
    } catch (error) {
      console.error(error);
      alert("承認に失敗しました");
    }
  };

  // =========================
  // 却下
  // =========================

  const handleReject = async (slotId) => {
    try {
      await axios.post(
        `http://127.0.0.1:5000/api/admin/reject/${slotId}`
      );

      await fetchEvents();

      handleCloseDrawer();

      alert("予約を却下しました");
    } catch (error) {
      console.error(error);
      alert("却下に失敗しました");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          marginBottom: "20px",
        }}
      >
        面接スケジュール管理
      </h1>

      <AdminCalendarV2
        events={events}
        onEventClick={handleEventClick}
        onCreateSlot={handleCreateSlot}
      />

      <EventDrawer
        event={selectedEvent}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default AdminPage;
