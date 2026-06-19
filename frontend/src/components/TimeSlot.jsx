const TimeSlot = ({ slot, day, time, onClick, isAdmin }) => {
  const status = slot?.status || "empty";

  const handleClick = () => {
    onClick(day, time, slot);
  };

  const getColor = () => {
    if (status === "available") return "#008cff";
    if (status === "reserved") return "#ffa600";
    return "#eee";
  };

  return (
    <div
      onClick={handleClick}
      style={{
        border: "1px solid #ccc",
        height: "40px",
        background: getColor(),
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      {status === "reserved" && isAdmin && slot.user?.name}
    </div>
  );
};

export default TimeSlot;
