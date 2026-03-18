import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/authProvider";

export default function ProtectedRoute({ children }: any) {
    const { user, isLoading } = useAuth();

    if (isLoading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    return children;
}