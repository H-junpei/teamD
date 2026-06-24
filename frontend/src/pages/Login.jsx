import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login.css";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate("/admin");
  };

  const handleJobSeekerClick = () => {
    navigate("/jobseeker");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Log in</h2>

        <button
          className="login-button admin-button"
          onClick={handleAdminClick}
        >
          👔 管理者
        </button>

        <button
          className="login-button jobseeker-button"
          onClick={handleJobSeekerClick}
        >
          🙋‍♂️ 求職者
        </button>
      </div>
    </div>
  );
};

export default Login;
