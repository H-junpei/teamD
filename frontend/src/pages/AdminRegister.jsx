import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
          "Content-Type": "application/json"
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
    <div>
      <h1>管理者登録</h1>

      <div>
        <input
          type="text"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={handleRegister}>
        登録
      </button>

      <button onClick={() => navigate("/admin")}>
        戻る
      </button>
    </div>
  );
}

export default AdminRegister;
