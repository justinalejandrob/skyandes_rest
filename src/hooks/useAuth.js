import { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 Nuevo: evita redirecciones prematuras

  useEffect(() => {
    const data = sessionStorage.getItem("user");

    if (data) {
      setUser(JSON.parse(data));
    }

    // 🔥 Recién aquí terminamos de cargar el estado
    setLoading(false);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user && !loading,
  };
}
