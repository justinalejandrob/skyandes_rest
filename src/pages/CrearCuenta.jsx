import React, { useState } from "react";

export default function CrearCuenta() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  // ⚠️ Cambia esta URL a la URL de tu API publicada
  const API_URL =
    "https://skyandesairlines-rest.runasp.net/api/v1/users/agregar";
  // const API_URL = "https://caribbeanskyways.monsterasp.net/API_Gestion/api/v1/users/agregar";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    try {
      // 🔥 Enviar al backend REST
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FullName: fullName,
          Email: email,
          PasswordHash: password,
          Role: "Customer",
          Status: "Active",
        }),
      });

      // 📌 Email duplicado → 409
      if (response.status === 409) {
        setMensaje("⚠️ El correo ya está registrado.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setMensaje("⚠️ No se pudo crear la cuenta.");
        setLoading(false);
        return;
      }

      const data = await response.json();

      setMensaje("✅ Cuenta creada exitosamente 🎉");

      console.log("Nuevo usuario:", data);
    } catch (error) {
      console.error("❌ Error al crear usuario:", error);
      setMensaje("❌ Error al conectar con el servidor.");
    } finally {
      setLoading(false);
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
          Crear nueva cuenta
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          Regístrate para disfrutar de SkyAndes Airlines
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre completo */}
          <div>
            <input
              type="text"
              placeholder="Nombre completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#ff6b00] focus:outline-none text-sm"
              required
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#ff6b00] focus:outline-none text-sm"
              required
            />
          </div>

          {/* Contraseña */}
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#ff6b00] focus:outline-none text-sm"
              required
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-[#ff6b00] hover:bg-[#e55f00]"
            } text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer`}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        {/* MENSAJE */}
        {mensaje && (
          <p className="text-center mt-5 text-sm font-medium text-gray-700">
            {mensaje}
          </p>
        )}

        <div className="text-center mt-6">
          <a
            href="/login"
            className="text-[#ff6b00] font-semibold hover:underline text-sm"
          >
            ¿Ya tienes una cuenta? Inicia sesión
          </a>
        </div>

        <p className="text-[11px] text-center text-gray-400 mt-8">
          © {new Date().getFullYear()} SkyAndes Airlines. Todos los derechos
          reservados.
        </p>
      </div>
    </div>
  );
}
