import { useNavigate } from "react-router-dom";
import "./AdminSelect.css";

function AdminSelect() {
  const navigate = useNavigate();

  return (
    <div className="admin-select-page">
      <div className="admin-select-card">
        <h1>管理者ポータル</h1>

        <button
          className="login-main-btn"
          onClick={() => navigate("/admin/login")}
        >
          🔐 ログイン
        </button>

        <div className="register-area">
          

          <button
            className="register-link-btn"
            onClick={() => navigate("/admin/register")}
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

export default AdminSelect;
