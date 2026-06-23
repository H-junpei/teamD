import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminCalendarV2 from "../components/AdminCalendarV2";
import EventDrawer from "../components/EventDrawer";
import "../components/AdminCalendarV2.css";
import "../components/EventDrawer.css";

const API_BASE_URL = "http://127.0.0.1:5000";

function AdminPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [adminId, setAdminId] = useState(null);
  const [adminName, setAdminName] = useState("");

  const navigate = useNavigate();

  // ログイン中の管理者情報を確認
  useEffect(() => {
    const savedAdminId = localStorage.getItem("adminId");
    const savedAdminName = localStorage.getItem("adminName");
    const savedRole = localStorage.getItem("role");

    if (!savedAdminId || savedRole !== "admin") {
      alert("管理者ログインが必要です");
      navigate("/admin/login");
      return;
    }

    setAdminId(savedAdminId);
    setAdminName(savedAdminName || "");
  }, [navigate]);

  const fetchEvents = async (targetAdminId) => {
    if (!targetAdminId) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/events?admin_id=${targetAdminId}`
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
    if (adminId) {
      fetchEvents(adminId);
    }
  }, [adminId]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setSelectedEvent(null);
    setIsDrawerOpen(false);
  };

  const handleAddSlot = async ({ day, time }) => {
    if (!adminId) {
      alert("管理者情報が取得できません。再ログインしてください。");
      navigate("/admin/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/slots`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            admin_id: adminId,
            day,
            time
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        await fetchEvents(adminId);
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
        `${API_BASE_URL}/api/admin/slots/${slotId}?admin_id=${adminId}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "空き枠を削除しました");
        handleCloseDrawer();
        await fetchEvents(adminId);
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
        `${API_BASE_URL}/api/admin/approve/${slotId}?admin_id=${adminId}`,
        {
          method: "POST"
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "予約を承認しました");
        handleCloseDrawer();
        await fetchEvents(adminId);
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
        `${API_BASE_URL}/api/admin/reject/${slotId}?admin_id=${adminId}`,
        {
          method: "POST"
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "予約を却下しました");
        handleCloseDrawer();
        await fetchEvents(adminId);
      } else {
        alert(data.message || "予約却下に失敗しました");
      }
    } catch (error) {
      console.error(error);
      alert("サーバーとの通信に失敗しました");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");

    navigate("/admin/login");
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>
          {adminName ? `${adminName}さんの管理者カレンダー` : "管理者カレンダー"}
        </h1>

        <p>
          30分単位で空き時間を登録・削除できます。
        </p>

        <button onClick={handleLogout}>
          ログアウト
        </button>
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
