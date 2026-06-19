import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // 管理者 or 求職者 の切り替え
  const [isAdmin, setIsAdmin] = useState(true);

  // 求職者用
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 管理者用
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    let payload;

    if (isAdmin) {
      if (!adminEmail || !password) {
        alert("メールアドレスとパスワードを入力してください");
        return;
      }

      payload = {
        role: "admin",
        email: adminEmail,
        password: password,
      };
    } else {
      if (!name || !email) {
        alert("名前とメールアドレスを入力してください");
        return;
      }

      payload = {
        role: "user",
        name: name,
        email: email,
      };
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("バックエンドからの返答:", data);

      if (data.role === "admin") {
        navigate("/admin");
      } else if (data.role === "user") {
        // 必要なら名前を保存
        localStorage.setItem("user_name", name);
        navigate("/user");
      } else {
        alert("ログイン結果が正しく返ってきませんでした");
      }
    } catch (error) {
      console.error("ログイン通信エラー:", error);
      alert("ログイン処理でエラーが発生しました");
    }
  };

  return (
    <div>
      <h2>ログイン</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setIsAdmin(true)}>管理者</button>
        <button onClick={() => setIsAdmin(false)} style={{ marginLeft: "10px" }}>
          求職者
        </button>
      </div>

      {isAdmin ? (
        <div>
          <input
            type="email"
            placeholder="メールアドレス"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
          />
          <br />
          <br />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
          <br />
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}

      <br />
      <button onClick={handleLogin}>ログイン</button>
    </div>
  );
};

export default Login;
