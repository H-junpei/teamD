import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

      console.log("バックエンドからの返答:", data);

      if (data.role === "jobseeker") {
        navigate("/jobseeker/login");
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
      <h3>求職者ログイン</h3>

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

      <br />
      <br />

      <button onClick={handleLogin}>ログイン</button>

      <button onClick={() => navigate("/jobseeker")}>戻る</button>
    </div>
  );
};

export default JobSeekerLogin;
