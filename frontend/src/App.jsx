import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminSelect from "./pages/AdminSelect";
import AdminRegister from "./pages/AdminRegister"
import AdminLogin from "./pages/AdminLogin";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import Reservation from "./pages/reservation";

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
        <Route path="/reservation" element={<Reservation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
