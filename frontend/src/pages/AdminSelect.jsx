import { useNavigate } from "react-router-dom";
import "../Login.css";
function AdminSelect() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>管理者メニュー</h1>

      <button onClick={() => navigate("/admin/register")}>新規登録</button>
      <button onClick={() => navigate("/admin/login")}>ログイン</button>
      <button onClick={() => navigate(-1)}>戻る</button>
    </div>

  )
}

export default AdminSelect;
