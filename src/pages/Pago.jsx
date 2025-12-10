// src/pages/Pago.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Edit, CreditCard, ShieldCheck, AlertCircle } from "lucide-react";

export default function Pago() {
  const navigate = useNavigate();
  const location = useLocation();

  // 📦 Datos recibidos
  const {
    vueloIda,
    vueloVuelta,
    pasajerosBody,
    pasajeros,
    tipo,
    userId,
    totalSeatsPrice,
    totalFinal,
  } = location.state || {};

  // Seguridad
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

  // ---------- LABELS NAV ----------
  const originLabel = vueloIda?.OriginName || "Origen";
  const destLabel =
    vueloVuelta?.DestinationName || vueloIda?.DestinationName || "Destino";

  // ---------- PRECIOS ----------
  const isRound = ["roundtrip", "ida_vuelta"].includes(tipo);

  const precioVueloIda = Number(vueloIda.Price || 0);
  const precioVueloVuelta = isRound ? Number(vueloVuelta?.Price || 0) : 0;

  const subtotalVuelo = precioVueloIda + precioVueloVuelta;

  // precioAsientos = totalSeatsPrice - tarifaVuelo
  const precioAsientos = Number(totalSeatsPrice) - subtotalVuelo;

  const totalReserva = Number(totalSeatsPrice);

  // ---------- HORAS ----------
  const formHora = (f) => {
    const d = new Date(f);
    return isNaN(d)
      ? "-"
      : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // ---------- ESTADOS ----------
  const [cuentaOrigen, setCuentaOrigen] = useState("");
  const [cuentaDestino] = useState("160");
  const [errorPago, setErrorPago] = useState("");
  const [loadingPago, setLoadingPago] = useState(false);

  // ---------- BOTÓN PAGAR ----------
  const handlePagar = async () => {
    setErrorPago("");

    if (!cuentaOrigen.trim()) {
      setErrorPago("Ingresa la cuenta de origen para continuar.");
      return;
    }

    setLoadingPago(true);

    const body = {
      UserId: userId,
      FlightIds: isRound
        ? [vueloIda.FlightId, vueloVuelta.FlightId]
        : [vueloIda.FlightId],
      Payment: {
        CuentaOrigen: Number(cuentaOrigen),
        CuentaDestino: Number(cuentaDestino),
      },
      Pasajeros: pasajerosBody,
    };

    try {
      const res = await fetch(
        "https://skyandesairlines-rest.runasp.net/api/v1/checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error();

      const reserva = await res.json();
      setLoadingPago(false);

      navigate("/confirmacion", { state: { reserva } });
    } catch (err) {
      setLoadingPago(false);
      setErrorPago("No se pudo procesar el pago. Inténtalo nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-gray-900">
      {/* NAVBAR */}
      <header className="bg-black shadow-md py-3 px-4 md:px-8 flex justify-between items-center fixed top-0 left-0 right-0 z-50 text-white">
        <img src="/images/logoSkyAndes.png" className="h-7 md:h-8" />

        <div className="hidden md:flex text-sm items-center space-x-6">
          <div>
            <span className="font-medium">
              {originLabel} ↔ {destLabel}
            </span>
            <span className="text-gray-300"> • {pasajeros} Pasajero(s)</span>
            <button
              className="ml-2 flex items-center text-[#ff6b00] hover:underline text-sm"
              onClick={() => navigate("/dashboard")}
            >
              <Edit className="w-4 h-4 mr-1 text-white" /> Editar
            </button>
          </div>

          <div className="bg-black border border-white/40 rounded-full px-4 py-1 shadow-sm">
            <span className="font-semibold">USD {totalReserva.toFixed(2)}</span>
          </div>
        </div>
      </header>

      {/* PROGRESO */}
      <div className="fixed top-[60px] left-0 right-0 h-1.5 bg-gray-200 hidden md:block z-40">
        <div className="bg-[#00b050] h-1.5 w-full rounded-r-full"></div>
      </div>

      {/* ESPACIADOR */}
      <div className="pt-[90px] md:pt-[110px]"></div>

      {/* CONTENIDO */}
      <main className="px-4 md:px-8 lg:px-16 pb-10">
        {/* Título */}
        <section className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Pago de tu reserva
          </h1>
          <p className="text-gray-600 mt-1">
            Ingresa los datos de tu cuenta y revisa el resumen antes de pagar.
          </p>
        </section>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* FORMULARIO */}
          <section className="bg-white rounded-2xl shadow-sm p-5 md:p-6 border border-gray-200 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-[#ff6b00]" />
              <h2 className="text-lg font-semibold">Datos de pago</h2>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              El pago se realizará mediante débito bancario simulado.
            </p>

            <div className="space-y-4">
              {/* Cuenta Origen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuenta de origen
                </label>
                <input
                  type="number"
                  value={cuentaOrigen}
                  onChange={(e) => setCuentaOrigen(e.target.value)}
                  placeholder="Ej: 159"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#00b050] focus:outline-none"
                />
              </div>

              {/* Cuenta Destino */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuenta destino (SkyAndes)
                </label>
                <input
                  type="text"
                  value={cuentaDestino}
                  disabled
                  className="w-full border rounded-lg px-3 py-2.5 text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Seguridad */}
              <div className="mt-3 flex items-start gap-2 text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-xl px-3 py-3">
                <ShieldCheck className="w-4 h-4 text-blue-600 mt-[2px]" />
                <p>
                  Tus datos se procesan de forma segura. Esto es una simulación
                  académica.
                </p>
              </div>

              {/* Error */}
              {errorPago && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 mt-[2px]" />
                  <p>{errorPago}</p>
                </div>
              )}

              {/* Botón pagar */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handlePagar}
                  disabled={loadingPago}
                  className="px-8 py-3 rounded-full bg-black text-white text-sm font-semibold hover:bg-[#1a1a1a] transition disabled:opacity-60"
                >
                  {loadingPago ? "Procesando pago..." : "Confirmar y pagar"}
                </button>
              </div>
            </div>
          </section>

          {/* ASIDE RESUMEN */}
          <aside className="bg-white rounded-2xl shadow-sm p-5 md:p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Resumen de pago</h2>

            <div className="space-y-4 text-sm">
              {/* Pasajeros */}
              <div className="flex justify-between">
                <span className="text-gray-600">Pasajeros</span>
                <span className="font-medium">{pasajeros}</span>
              </div>

              {/* Vuelos */}
              <div className="flex justify-between">
                <span className="text-gray-600">Cantidad de vuelos</span>
                <span className="font-medium">
                  {isRound ? "2 (Ida & Vuelta)" : "1 (Solo ida)"}
                </span>
              </div>

              <div className="border-t border-dashed my-2" />

              {/* Tarifas */}
              <div>
                <p className="font-semibold mb-2">Tarifa del vuelo</p>

                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Ida: {vueloIda.OriginName} → {vueloIda.DestinationName}
                  </span>
                  <span className="font-medium">
                    USD {precioVueloIda.toFixed(2)}
                  </span>
                </div>

                {isRound && vueloVuelta && (
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600">
                      Vuelta: {vueloVuelta.OriginName} →{" "}
                      {vueloVuelta.DestinationName}
                    </span>
                    <span className="font-medium">
                      USD {precioVueloVuelta.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed my-2" />

              {/* Asientos */}
              <div className="flex justify-between">
                <span className="text-gray-600">Asientos seleccionados</span>
                <span className="font-medium">
                  USD {precioAsientos.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-gray-300 my-3" />

              {/* Subtotal */}
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-semibold">
                  USD {subtotalVuelo.toFixed(2)}
                </span>
              </div>

              {/* TOTAL */}
              <div className="flex justify-between text-base font-bold text-gray-900 mt-2">
                <span>Total a pagar</span>
                <span>USD {totalReserva.toFixed(2)}</span>
              </div>

              <p className="text-[11px] text-gray-500 mt-2">
                Todos los impuestos están incluidos en el total.
              </p>
            </div>

            {/* DETALLE DEL VUELO */}
            <div className="mt-6 border-t pt-4 space-y-3 text-xs">
              <p className="font-semibold mb-1">Detalle del vuelo</p>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Ida: {vueloIda.OriginName} → {vueloIda.DestinationName}
                </span>
                <span className="text-gray-800 font-medium">
                  {formHora(vueloIda.DepartureTime)} h
                </span>
              </div>

              {isRound && vueloVuelta && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Vuelta: {vueloVuelta.OriginName} →{" "}
                    {vueloVuelta.DestinationName}
                  </span>
                  <span className="text-gray-800 font-medium">
                    {formHora(vueloVuelta.DepartureTime)} h
                  </span>
                </div>
              )}
            </div>
          </aside>
        </div>

        <footer className="text-center text-xs text-gray-500 mt-10">
          © SkyAndes Airlines 2025
        </footer>
      </main>
    </div>
  );
}
