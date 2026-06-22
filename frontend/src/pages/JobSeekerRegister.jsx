import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>求職者登録</h1>

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

      <button onClick={handleRegister}>
        登録
      </button>

      <button onClick={() => navigate("/jobseeker")}>
        戻る
      </button>
    </div>
  );
}

export default JobSeekerRegister;
