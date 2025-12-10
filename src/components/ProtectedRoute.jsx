import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children, role }) {
  const { user, loading, isAuthenticated } = useAuth();

  // 🕒 1) AÚN cargando sesión → No redirigir, no mostrar nada
  if (loading) {
    return null;
    // Si quieres, aquí puedes poner un Spinner elegante:
    // return <div className="text-white">Cargando...</div>;
  }

  // 🔐 2) No autenticado → al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 👮 3) Validar rol
  if (role && user.Role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  // 🎯 4) OK → mostrar página protegida
  return children;
}
