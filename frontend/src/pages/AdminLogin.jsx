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

      if (!res.ok || !data.success) {
        alert(data.message || "ログインに失敗しました");
        return;
      }

      if (data.role === "admin" && data.admin) {
        // ログインした管理者情報を保存
        localStorage.setItem("role", data.role);
        localStorage.setItem("adminId", data.admin.admin_id);
        localStorage.setItem("adminName", data.admin.name);
        localStorage.setItem("adminEmail", data.admin.email);

        console.log("保存した管理者ID:", data.admin.admin_id);
        console.log("保存した管理者名:", data.admin.name);

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
