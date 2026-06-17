import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (isAdmin) {
      // 管理者ページへ
      navigate("/admin");
    } else {
      if (!name) {
        alert("名前を入力してください");
        return;
      }
      // 求職者ページへ
      navigate("/user");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>ログイン</h1>

      {/* 切り替えボタン */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setIsAdmin(true)}>管理者</button>
        <button onClick={() => setIsAdmin(false)}>求職者</button>
      </div>

      {/* 管理者ログイン */}
      {isAdmin ? (
        <div>
          <input type="text" placeholder="ID" />
          <br />
          <input type="password" placeholder="パスワード" />
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="名前を入力"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <input type="email" placeholder="メールアドレス" />
        </div>
      )}

      <br />
      <button onClick={handleLogin}>ログイン</button>
    </div>
  );
};

export default Login;
