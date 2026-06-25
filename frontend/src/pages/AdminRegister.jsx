import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminRegister.css";

function AdminRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("名前、メールアドレス、パスワードを入力してください");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json" // サーバーに対してjson形式と教えるコード
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate("/admin");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("サーバーとの通信に失敗しました");
    }
  };
  
  return (
  <div className="login-page">
    <div className="login-card">
      <h1>管理者登録</h1>

      <p className="sub-title">
        面談スケジュール管理システム
      </p>

      <div className="input-group">
        <label>氏名</label>
        <input
          type="text"
          placeholder="氏名を入力"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>メールアドレス</label>
        <input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        className="register-btn"
        onClick={handleRegister}
      >
        登録
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
}

export default AdminRegister;
