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

  // 求職者ボタンを押したら、求職者メニューへ移動
  const handleJobSeekerClick = () => {
    navigate("/jobseeker")
  }

  return (
    <div>
      <h2>ログイン</h2>

      <button onClick={handleAdminClick}>管理者</button>

      <br />
      <br />

      <h3>求職者ログイン</h3>

      <button onClick={handleJobSeekerClick}>求職者ログイン</button>
    </div>
  );
};

export default Login;
