import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "./hooks";

export default function RequireAuth() {
  const token = useAppSelector((s) => s.auth.token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}