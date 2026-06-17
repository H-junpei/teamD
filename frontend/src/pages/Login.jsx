import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      if (!name) {
        alert("名前を入力してください");
        return;
      }

      // ★ 名前を保存（簡易的にlocalStorage）
      localStorage.setItem("user_name", name);

      navigate("/user");
    }
  };

  return (
    <div>
      <h2>ログイン</h2>

      <button onClick={() => setIsAdmin(true)}>管理者</button>
      <button onClick={() => setIsAdmin(false)}>求職者</button>

      {!isAdmin && (
        <input
          type="text"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <button onClick={handleLogin}>ログイン</button>
    </div>
  );
};

export default Login;
