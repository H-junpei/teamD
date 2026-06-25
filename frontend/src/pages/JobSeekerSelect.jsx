import { useNavigate } from "react-router-dom";
import "./JobSeekerSelect.css";

function JobSeekerSelect() {
  const navigate = useNavigate();

  return (
    <div className="jobseeker-select-page">
      <div className="jobseeker-select-card">
        <h1>求職者ポータル</h1>
        <br></br>

        <button
          className="login-main-btn"
          onClick={() => navigate("/jobseeker/login")}
        >
          👤 ログイン
        </button>

        <div className="register-area">

          <button
            className="register-link-btn"
            onClick={() => navigate("/jobseeker/register")}
          >
            新規登録 →
          </button>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← 戻る
        </button>
      </div>
    </div>
  );
}

export default JobSeekerSelect;
