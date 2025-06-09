import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import CoursesPage from "./pages/CoursesPage";
import RequireAuth from "./requireAuth";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<CoursesPage />} />
      </Route>
      {/* catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
