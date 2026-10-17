import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import Loading from "../modal/Loading";

export default function MemberRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) return <Loading />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "gurdian") {
    return <Navigate to="/ranking" replace />;
  }

  return children;
}
