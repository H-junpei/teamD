import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JobSeekerRegister.css";

function JobSeekerRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email) {
      alert("名前、メールアドレスを入力してください");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/jobseeker/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json" // サーバーに対してjson形式と教えるコード
        },
        body: JSON.stringify({
          name,
          email
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate("/jobseeker");
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
      <h1>求職者登録</h1>

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

      <button
        className="jobseeker-register-btn"
        onClick={handleRegister}
      >
        📝 新規登録
      </button>

      <button
        className="back-btn"
        onClick={() => navigate("/jobseeker")}
      >
        ← 戻る
      </button>
    </div>
  </div>
);
}

export default JobSeekerRegister;
