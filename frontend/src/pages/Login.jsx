import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // 求職者用
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  // 管理者ボタンを押したら、管理者メニューへ移動
  const handleAdminClick = () => {
    navigate("/admin");
  };

  // 求職者ログイン処理
  const handleUserLogin = async () => {
    if (!name || !email) {
      alert("名前とメールアドレスを入力してください");
      return;
    }

    const payload = {
      role: "user",
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

      if (data.role === "user") {
        localStorage.setItem("user_name", name);
        localStorage.setItem("user_email", email);
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

      <button onClick={handleAdminClick}>管理者</button>

      <br />
      <br />

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

      <button onClick={handleUserLogin}>求職者ログイン</button>
    </div>
  );
};

export default Login;
