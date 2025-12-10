import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";

export default function ResumenVuelo() {
  const navigate = useNavigate();
  const location = useLocation();

  // 📦 Datos recibidos desde Pasajeros.jsx
  const {
    vueloIda,
    vueloVuelta,
    pasajerosBody,
    pasajeros,
    tipo,
    userId,
    totalSeatsPrice,
  } = location.state || {};

  console.log("🟦 tipo:", tipo);
  console.log("🟩 vueloVuelta:", vueloVuelta);
  console.log("🟧 seats:", pasajerosBody?.[0]?.Seats);

  // 🛑 Seguridad
  if (!vueloIda || !pasajerosBody) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] text-gray-800">
        <p className="mb-4 text-sm text-gray-600">
          No se encontraron datos de la reserva.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 rounded-full bg-black text-white text-sm font-semibold hover:bg-[#1a1a1a] transition"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  // 🏷 Navbar labels
  const originLabel = vueloIda?.OriginName || "Origen";
  const destLabel =
    vueloVuelta?.DestinationName || vueloIda?.DestinationName || "Destino";

  // 💰 Total mostrado en navbar
  const totalFinal = Number(totalSeatsPrice || 0);

  // ⏰ Funciones de hora que soportan cualquier estructura del backend
  const getHora = (obj) => {
    const fecha = obj?.DepartureTime || obj?.DepartureDate;
    if (!fecha) return "-";
    return new Date(fecha).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getHoraLlegada = (obj) => {
    const fecha = obj?.ArrivalTime || obj?.ArrivalDate;
    if (!fecha) return "-";
    return new Date(fecha).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 👉 Ir a Pago.jsx
  const continuarPago = () => {
    navigate("/pago", {
      state: {
        vueloIda,
        vueloVuelta,
        pasajerosBody,
        pasajeros,
        tipo,
        userId,
        totalSeatsPrice,
        totalFinal,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-gray-900">
      {/* NAVBAR */}
      <header className="bg-black py-3 px-4 md:px-8 fixed top-0 left-0 right-0 z-50 flex justify-between items-center text-white">
        <img src="/images/logoSkyAndes.png" className="h-7 md:h-8" />

        <div className="hidden md:flex text-sm items-center space-x-6">
          <div>
            <span className="font-medium">
              {originLabel} ↔ {destLabel}
            </span>
            <span className="text-gray-300"> • {pasajeros} Pasajero(s)</span>

            <button
              onClick={() => navigate("/dashboard")}
              className="ml-2 flex items-center text-[#ff6b00] hover:underline"
            >
              <Edit className="w-4 h-4 mr-1 text-white" /> Editar
            </button>
          </div>

          <div className="border border-white/40 rounded-full px-4 py-1">
            <span className="font-semibold">USD {totalFinal.toFixed(2)}</span>
          </div>
        </div>
      </header>

      {/* Barra progreso */}
      <div className="fixed top-[60px] left-0 right-0 h-1.5 bg-gray-200 z-40 hidden md:block">
        <div className="bg-[#00b050] h-1.5 w-3/4 rounded-r-full"></div>
      </div>

      <div className="pt-[90px] md:pt-[110px]"></div>

      {/* TITULO */}
      <div className="px-6 md:px-10">
        <h1 className="text-2xl font-semibold">Resumen del viaje</h1>
        <p className="text-gray-600 mt-1">Confirma que todo esté correcto.</p>
      </div>

      <div className="px-6 md:px-10 space-y-10 mt-6">
        {/* ============================
             VUELO IDA
        ============================= */}
        <section>
          <h3 className="text-lg font-semibold mb-2">
            Ida: {vueloIda.OriginName} → {vueloIda.DestinationName}
          </h3>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <p className="text-2xl font-bold">{getHora(vueloIda)}</p>
                <p className="text-gray-500">{vueloIda.OriginName}</p>
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-blue-600">
                  {vueloIda.CabinClass}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {vueloIda.Duration}
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold">{getHoraLlegada(vueloIda)}</p>
                <p className="text-gray-500">{vueloIda.DestinationName}</p>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-green-600 text-sm font-medium">
                ✓ Vuelo seleccionado
              </span>
              <span className="bg-[#ff6b00] text-white text-xs font-bold px-3 py-1 rounded-full">
                USD {Number(vueloIda.Price).toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        {/* ============================
             VUELO VUELTA
        ============================= */}
        {["roundtrip", "ida_vuelta"].includes(tipo) && vueloVuelta && (
          <section>
            <h3 className="text-lg font-semibold mb-2">
              Vuelta: {vueloVuelta.OriginName} → {vueloVuelta.DestinationName}
            </h3>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <p className="text-2xl font-bold">{getHora(vueloVuelta)}</p>
                  <p className="text-gray-500">{vueloVuelta.OriginName}</p>
                </div>

                <div className="text-center">
                  <p className="text-sm font-semibold text-blue-600">
                    {vueloVuelta.CabinClass}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {vueloVuelta.Duration}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {getHoraLlegada(vueloVuelta)}
                  </p>
                  <p className="text-gray-500">{vueloVuelta.DestinationName}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-green-600 text-sm font-medium">
                  ✓ Vuelo seleccionado
                </span>
                <span className="bg-[#ff6b00] text-white text-xs font-bold px-3 py-1 rounded-full">
                  USD {Number(vueloVuelta.Price).toFixed(2)}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ============================
             PASAJEROS
        ============================= */}
        <section>
          <h3 className="text-lg font-semibold">Pasajeros y Asientos</h3>

          <div className="space-y-4 mt-4">
            {pasajerosBody.map((p, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
              >
                <p className="font-semibold text-gray-900">{p.FullName}</p>
                <p className="text-sm text-gray-600">
                  Documento: {p.DocumentNumber}
                </p>
                <p className="text-sm text-gray-600">
                  Nacionalidad: {p.Nationality}
                </p>

                <div className="mt-2">
                  <p className="font-semibold text-sm text-gray-900">
                    Asientos:
                  </p>
                  <ul className="text-gray-700 ml-4 list-disc">
                    {p.Seats.map((s, idx) => (
                      <li key={idx}>HoldId: {s.HoldId}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TOTAL */}
        <section className="text-right">
          <p className="text-sm text-gray-500">Precio final</p>
          <p className="text-3xl font-bold">USD {totalFinal.toFixed(2)}</p>

          <button
            onClick={continuarPago}
            className="mt-5 px-10 py-3 rounded-full bg-black text-white font-semibold hover:bg-[#1a1a1a] transition"
          >
            Continuar al pago
          </button>
        </section>

        <footer className="text-center text-xs text-gray-500 py-6">
          © SkyAndes Airlines 2025
        </footer>
      </div>
    </div>
  );
}
