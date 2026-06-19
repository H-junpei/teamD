import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleAdminClick = () => {
    setIsAdmin(true);
    navigate("/admin");
  };

  const handleUserClick = () => {
    setIsAdmin(false);
  };

  const handleLogin = () => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      if (!name) {
        alert("名前を入力してください");
        return;
      }

      localStorage.setItem("user_name", name);
      navigate("/user");
    }
  };

  return (
    <div>
      <h2>ログイン</h2>

      <button onClick={handleAdminClick}>管理者</button>
      <button onClick={handleUserClick}>求職者</button>

      {!isAdmin && (
        <input
          type="text"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      {!isAdmin && (
        <button onClick={handleLogin}>ログイン</button>
      )}
    </div>
  );
};

export default Login;
