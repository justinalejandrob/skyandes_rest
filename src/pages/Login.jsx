import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = "https://skyandesairlines-rest.runasp.net/api/v1/users/login";
  // O la URL pública de MonsterASP:
  // const API_URL = "https://caribbeanskyways.monsterasp.net/API_Gestion/api/v1/users/login";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setError("");

    try {
      // 🔥 LOGIN REST
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Email: email,
          PasswordHash: password,
        }),
      });

      if (response.status === 400) {
        setError("Email y contraseña son obligatorios.");
        return;
      }

      if (response.status === 401) {
        setError("Credenciales incorrectas.");
        return;
      }

      if (!response.ok) {
        setError("Error al conectar con el servidor.");
        return;
      }

      // 🔥 DTOUser desde tu API
      const user = await response.json();

      console.log("✅ Usuario autenticado:", user);

      // 🔥 Guardar usuario
      sessionStorage.setItem("user", JSON.stringify(user));

      // 🔥 Redirigir según rol
      if (user.Role === "Admin") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("❌ Error al iniciar sesión:", err);
      setError("No se pudo conectar. Intenta más tarde.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10 relative">
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img
            src="/images/logoSkyAndesWhite.png"
            alt="SkyAndes Airlines Logo"
            className="h-10"
          />
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">
          Ingresa tu usuario
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          Si ya eres parte de SkyAndes, ingresa tus datos:
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#ff6b00] focus:outline-none text-sm"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#ff6b00] focus:outline-none text-sm"
            />
            <div className="text-right mt-2">
              <a
                href="#"
                className="text-[#ff6b00] hover:underline text-xs font-medium"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center -mt-2">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#ff6b00] hover:bg-[#e55f00] text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
          >
            Ingresar
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/crear-cuenta"
            className="text-[#ff6b00] font-semibold hover:underline text-sm"
          >
            Crear cuenta
          </Link>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        <p className="text-center text-sm text-gray-500">
          ¿No puedes ingresar a tu cuenta?{" "}
          <a href="#" className="text-[#ff6b00] hover:underline font-medium">
            Recupera el acceso
          </a>
        </p>

        <p className="text-[11px] text-center text-gray-400 mt-8">
          © {new Date().getFullYear()} SkyAndes Airlines. Todos los derechos
          reservados.
        </p>
      </div>
    </div>
  );
}
