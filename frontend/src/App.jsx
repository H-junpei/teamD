import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminSelect from "./pages/AdminSelect";
import AdminRegister from "./pages/AdminRegister"
import AdminLogin from "./pages/AdminLogin";
import AdminPage from "./pages/AdminPage";
import Reservation from "./pages/reservation";
import AdminJobSeekerLinkPage from "./pages/AdminJobSeekerLinkPage";
import JobSeekerRegister from "./pages/JobSeekerRegister";
import JobSeekerSelect from "./pages/JobSeekerSelect";
import JobSeekerLogin from "./pages/JobSeekerLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminSelect />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/page" element={<AdminPage />} />
        <Route path="/jobseeker" element={<JobSeekerSelect />} />
        <Route path="/jobseeker/register" element={<JobSeekerRegister />} />
        <Route path="/jobseeker/login" element={<JobSeekerLogin />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route
          path="/admin/job-seeker-links"
          element={<AdminJobSeekerLinkPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
