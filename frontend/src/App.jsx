import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminSelect from "./pages/AdminSelect";
import AdminRegister from "./pages/AdminRegister"
import AdminLogin from "./pages/AdminLogin";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import reservation from "./pages/reservation";
import AdminJobSeekerLinkPage from "./pages/AdminJobSeekerLinkPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminSelect />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/page" element={<AdminPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/reservation" element={<reservation />} />
        <Route
        path="/admin/job-seeker-link-test"
        element={<AdminJobSeekerLinkPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
