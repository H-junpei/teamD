import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

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

      if (!res.ok || !data.success) {
        alert(data.message || "ログインに失敗しました");
        return;
      }

      if (data.role === "admin" && data.admin) {
        localStorage.setItem("role", data.role);
        localStorage.setItem("adminId", data.admin.admin_id);
        localStorage.setItem("adminName", data.admin.name);
        localStorage.setItem("adminEmail", data.admin.email);

        navigate("/admin/page");
      }
    } catch (error) {
      console.error(error);
      alert("ログイン処理でエラーが発生しました");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>管理者ログイン</h1>

        <br></br>

        <div className="input-group">
          <label>メールアドレス</label>
          <input
            type="email"
            placeholder="example@email.com"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>パスワード</label>
          <input
            type="password"
            placeholder="パスワードを入力"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="login-btn"
          onClick={handleLogin}
        >
          🔐 ログイン
        </button>

        <button
          className="back-btn"
          onClick={() => navigate("/admin")}
        >
          ← 戻る
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
