import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";

export default function MemberRoute({ children }) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "gurdian") {
    return <Navigate to="/ranking" replace />;
  }

  return children;
}
