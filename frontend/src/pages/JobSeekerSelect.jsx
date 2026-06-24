import { useNavigate } from "react-router-dom";

function JobSeekerSelect() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>求職者メニュー</h1>

      <button onClick={() => navigate("/jobseeker/register")}>新規登録</button>
      <button onClick={() => navigate("/jobseeker/login")}>ログイン</button>
      <button onClick={() => navigate("/")}>戻る</button>
    </div>
  )
}

export default JobSeekerSelect;
