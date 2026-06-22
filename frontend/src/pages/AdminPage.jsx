import { useEffect, useState } from "react";
import axios from "axios";

import AdminCalendarV2 from "../components/AdminCalendarV2";
import EventDrawer from "../components/EventDrawer";

const AdminPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:5000/api/admin/events"
      );

      setEvents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateSlot = async (day, time) => {
    try {
      await axios.post(
        "http://127.0.0.1:5000/api/admin/slots",
        {
          day,
          time,
        }
      );

      fetchEvents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setSelectedEvent(null);
    setIsDrawerOpen(false);
  };

  const handleApprove = async (slotId) => {
    try {
      await axios.post(
        `http://127.0.0.1:5000/api/admin/approve/${slotId}`
      );

      fetchEvents();
      handleCloseDrawer();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (slotId) => {
    try {
      await axios.post(
        `http://127.0.0.1:5000/api/admin/reject/${slotId}`
      );

      fetchEvents();
      handleCloseDrawer();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
      }}
    >
      <h1>面接スケジュール管理</h1>

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
