import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!adminEmail || !password) {
      alert("メールアドレスとパスワードを入力してください");
      return;
    }

    const payload = {
      role: "admin",
      email: adminEmail,
      password: password,
    };

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
        navigate("/admin/page");
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
      <h2>管理者ログイン</h2>

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

      <br />
      <br />

      <button onClick={handleLogin}>ログイン</button>

      <button onClick={() => navigate("/admin")}>戻る</button>
    </div>
  );
};

export default AdminLogin;
