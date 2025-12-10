import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Edit, UserRound } from "lucide-react";

export default function Pasajeros() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🟩 Todo lo que viene desde SeleccionAsientos.jsx
  const {
    vueloIda,
    vueloVuelta,
    pasajeros,
    seatsIda,
    seatsVuelta,
    tipo,
    totalSeatsPrice,
  } = location.state || {};

  // 🟩 Usuario logueado
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.UserId || 0;

  // 🟩 Arreglo dinámico según cantidad de pasajeros
  const [form, setForm] = useState(
    Array.from({ length: pasajeros }, (_, i) => ({
      id: i + 1,
      nombre: "",
      apellido: "",
      dia: "",
      mes: "",
      anio: "",
      nacionalidad: "",
      documentNumber: "",
    }))
  );

  const [autorizo, setAutorizo] = useState(false);
  const [aceptoPromos, setAceptoPromos] = useState(false);

  // 🟩 Cambiar valores del formulario
  const handleChange = (id, campo, valor) => {
    setForm((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p))
    );
  };

  // 🟩 Construir la fecha yyyy-mm-dd
  const buildDate = (dia, mes, anio) => {
    if (!dia || !mes || !anio) return "";
    const monthIndex =
      [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ].indexOf(mes) + 1;

    const mm = monthIndex.toString().padStart(2, "0");
    const dd = dia.toString().padStart(2, "0");

    return `${anio}-${mm}-${dd}`;
  };

  // 🟩 Continuar → enviar al Resumen
  const handleContinuar = () => {
    if (!autorizo) {
      alert("Debes autorizar el tratamiento de datos para continuar.");
      return;
    }

    // Validación mínima
    for (const p of form) {
      if (
        !p.nombre ||
        !p.apellido ||
        !p.documentNumber ||
        !p.nacionalidad ||
        !p.dia ||
        !p.mes ||
        !p.anio
      ) {
        alert("Completa todos los campos obligatorios antes de continuar.");
        return;
      }
    }

    // 🟩 Construir pasajeros EXACTOS para checkout
    const pasajerosBody = form.map((p, index) => {
      const fullName = `${p.nombre.trim()} ${p.apellido.trim()}`;
      const birth = buildDate(p.dia, p.mes, p.anio);

      const seats = [];

      if (seatsIda?.[index]) seats.push({ HoldId: seatsIda[index].holdId });

      if (seatsVuelta?.[index])
        seats.push({ HoldId: seatsVuelta[index].holdId });

      return {
        FullName: fullName,
        DocumentNumber: p.documentNumber,
        BirthDate: birth,
        Nationality: p.nacionalidad,
        Seats: seats,
      };
    });

    navigate("/resumen-vuelo", {
      state: {
        vueloIda,
        vueloVuelta,
        pasajerosBody,
        pasajeros,
        tipo,
        userId,
        totalSeatsPrice,
      },
    });
  };

  const originLabel = vueloIda?.OriginIata || vueloIda?.OriginName || "Origen";

  const destLabel =
    vueloIda?.DestinationIata || vueloIda?.DestinationName || "Destino";

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-gray-900">
      {/* NAVBAR — igualita a Selección de Asientos */}
      <header className="bg-black shadow-md py-3 px-4 md:px-8 flex justify-between items-center fixed top-0 left-0 right-0 z-50 text-white">
        <div className="flex items-center space-x-2">
          <img
            src="/images/logoSkyAndes.png"
            alt="SkyAndes"
            className="h-7 md:h-8"
          />
        </div>

        <div className="hidden md:flex text-sm items-center space-x-6">
          <div>
            <span className="font-medium">
              {originLabel} ↔ {destLabel}
            </span>{" "}
            <span className="text-gray-300">• {pasajeros} Pasajero(s)</span>
            <button
              className="ml-2 flex items-center text-[#ff6b00] font-semibold hover:underline text-sm"
              onClick={() => navigate("/dashboard")}
            >
              <Edit className="w-4 h-4 mr-1 text-white" /> Editar
            </button>
          </div>

          <div className="bg-black border border-white/40 rounded-full px-4 py-1 shadow-sm flex items-center space-x-2">
            <span className="text-sm font-semibold text-white">
              USD {totalSeatsPrice?.toFixed(2) ?? "0.00"}
            </span>
          </div>
        </div>
      </header>

      {/* BARRA PROGRESO */}
      <div className="fixed top-[60px] left-0 right-0 h-1.5 bg-gray-200 z-40 hidden md:block">
        <div className="bg-[#00b050] h-1.5 w-3/5 rounded-r-full"></div>
      </div>

      <div className="pt-[100px]"></div>

      {/* TÍTULO */}
      <section className="px-8 py-6">
        <h2 className="text-2xl font-semibold mb-2">Pasajeros</h2>
        <p className="text-gray-600">
          Ingresa los datos tal como aparecen en el documento de identidad.
        </p>
      </section>

      {/* FORMULARIOS */}
      <div className="px-8">
        {form.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-md rounded-2xl p-6 mb-6 border border-gray-200"
          >
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <UserRound className="w-5 h-5 text-[#ff6b00]" /> Pasajero {p.id}
            </h3>

            {/* Nombre / Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nombre*"
                value={p.nombre}
                onChange={(e) => handleChange(p.id, "nombre", e.target.value)}
                className="border rounded-lg p-3 text-sm"
              />
              <input
                type="text"
                placeholder="Apellido(s)*"
                value={p.apellido}
                onChange={(e) => handleChange(p.id, "apellido", e.target.value)}
                className="border rounded-lg p-3 text-sm"
              />
              <input
                type="text"
                placeholder="Document Number*"
                value={p.documentNumber}
                onChange={(e) =>
                  handleChange(p.id, "documentNumber", e.target.value)
                }
                className="border rounded-lg p-3 text-sm"
              />
            </div>

            {/* Fecha nacimiento */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex gap-2">
                <select
                  className="border rounded-lg p-3 text-sm w-full"
                  value={p.dia}
                  onChange={(e) => handleChange(p.id, "dia", e.target.value)}
                >
                  <option value="">Día</option>
                  {[...Array(31)].map((_, i) => (
                    <option key={i}>{i + 1}</option>
                  ))}
                </select>

                <select
                  className="border rounded-lg p-3 text-sm w-full"
                  value={p.mes}
                  onChange={(e) => handleChange(p.id, "mes", e.target.value)}
                >
                  <option value="">Mes</option>
                  {[
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre",
                  ].map((m, i) => (
                    <option key={i}>{m}</option>
                  ))}
                </select>

                <select
                  className="border rounded-lg p-3 text-sm w-full"
                  value={p.anio}
                  onChange={(e) => handleChange(p.id, "anio", e.target.value)}
                >
                  <option value="">Año</option>
                  {Array.from({ length: 80 }, (_, i) => 2025 - i).map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                placeholder="Nacionalidad*"
                value={p.nacionalidad}
                onChange={(e) =>
                  handleChange(p.id, "nacionalidad", e.target.value)
                }
                className="border rounded-lg p-3 text-sm w-full"
              />
            </div>
          </div>
        ))}
      </div>

      {/* AUTORIZACIONES */}
      <div className="px-8 space-y-3 mt-4 mb-10">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={autorizo}
            onChange={() => setAutorizo(!autorizo)}
          />
          Autorizo el tratamiento de mis datos personales conforme a la{" "}
          <a
            href="https://www.notion.so/Pol-tica-de-Privacidad-de-SkyAndes-2b487c2b5cf9802aa17ec78917d73157?source=copy_link"
            className="text-[#0e8fdd] hover:underline"
          >
            Política de Privacidad
          </a>
          .
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={aceptoPromos}
            onChange={() => setAceptoPromos(!aceptoPromos)}
          />
          Acepto el uso de mis datos personales para recibir promociones,
          ofertas y novedades de SkyAndes.
        </label>
      </div>

      {/* BOTÓN */}
      <div className="flex justify-end px-8 pb-8">
        <button
          onClick={handleContinuar}
          className="px-8 py-3 rounded-full font-semibold text-white bg-black hover:bg-[#1a1a1a] transition"
        >
          Continuar
        </button>
      </div>
      {/* FOOTER */}
      <footer className="text-center text-xs text-gray-500 pb-6">
        Copyright © SkyAndes 2025
      </footer>
    </div>
  );
}
