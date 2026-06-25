import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JobSeekerLogin.css";

const JobSeekerLogin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!name || !email) {
      alert("メールアドレスとパスワードを入力してください");
      return;
    }

    const payload = {
      role: "jobseeker",
      name: name,
      email: email,
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


      if (data.success && data.role === "jobseeker") {
        localStorage.setItem("role", "jobseeker");
        localStorage.setItem("job_seeker_id", data.job_seeker_id);
        localStorage.setItem("user_name", data.name);
        localStorage.setItem("user_email", email);
        navigate("/reservation");
      } else {
        alert("ログイン結果が正しく返ってきませんでした");
      }
    } catch (error) {
      console.error("ログイン通信エラー:", error);
      alert("ログイン処理でエラーが発生しました");
    }
  };

return (
  <div className="login-page">
    <div className="login-card">
      <h1>求職者ログイン</h1>

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
        className="jobseeker-login-btn"
        onClick={handleLogin}
      >
        👤 ログイン
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
};

export default JobSeekerLogin;
