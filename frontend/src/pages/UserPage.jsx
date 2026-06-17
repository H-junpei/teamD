import { useEffect, useState } from "react";
import axios from "axios";

const UserPage = () => {
  const [slots, setSlots] = useState([]);
  const name = localStorage.getItem("user_name"); // ★ 修正

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/slots")
      .then(res => setSlots(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleClickSlot = (slot) => {
    if (slot.status !== "available") return;

    axios.post("http://127.0.0.1:5000/api/reserve", {
      day: slot.day,
      time: slot.time,
      name: name
    })
    .then(() => {
      const updated = slots.map((s) =>
        s.id === slot.id ? { ...s, status: "reserved" } : s
      );
      setSlots(updated);
    });
  };

  return (
    <div>
      <h2>日程選択</h2>

      {slots.map((slot) => (
        <div key={slot.id}>
          {slot.day} {slot.time} - {slot.status}
          <button onClick={() => handleClickSlot(slot)}>
            予約
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserPage;
