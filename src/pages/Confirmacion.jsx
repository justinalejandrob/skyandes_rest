import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, FileDown, Ticket, ArrowLeftCircle } from "lucide-react";

export default function Confirmacion() {
  const navigate = useNavigate();
  const location = useLocation();

  // 📦 DATOS DESDE Pago.jsx
  const reserva = location.state?.reserva;

  const idReserva = reserva?.ReservationId || 0;
  const ruta = reserva?.Ruta || "Ruta no disponible";
  const fecha = reserva?.Fecha || "--";
  const total = reserva?.Total || 0;

  const [mostrarCheck, setMostrarCheck] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMostrarCheck(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // 🔗 URLs de descarga
  const facturaUrl = `https://skyandesairlines-rest.runasp.net/api/v1/checkout/invoice/pdf?idReserva=${idReserva}`;
  const ticketsUrl = `https://skyandesairlines-rest.runasp.net/tickets/pdf?idReserva=${idReserva}`;

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col items-center py-12 px-6 text-gray-900">
      {/* CARD PRINCIPAL */}
      <div className="bg-white rounded-3xl shadow-lg p-10 text-center w-full max-w-lg animate-fade-in">
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img
            src="/images/logoSkyAndesWhite.png"
            alt="SkyAndes Airlines"
            className="h-12 drop-shadow"
          />
        </div>

        {/* ICONO CHECK */}
        {mostrarCheck ? (
          <CheckCircle2 className="w-20 h-20 text-[#00b050] mx-auto mb-6 animate-bounce" />
        ) : (
          <div className="w-20 h-20 mx-auto mb-6 border-4 border-[#00b050] rounded-full animate-spin"></div>
        )}

        <h1 className="text-3xl font-bold text-[#00b050] mb-2">
          ¡Reserva confirmada!
        </h1>

        <p className="text-gray-600 mb-8">
          Gracias por volar con{" "}
          <span className="font-semibold text-black">SkyAndes Airlines</span>.
          Tu reserva ha sido procesada correctamente.
        </p>

        {/* BOTONES DE DESCARGA */}
        <div className="flex flex-col gap-4 mb-6">
          {/* FACTURA */}
          <a
            href={facturaUrl}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-gray-400 text-gray-800 font-semibold hover:bg-gray-100 transition"
          >
            <FileDown className="w-5 h-5" />
            Descargar factura PDF
          </a>

          {/* TICKETS */}
          <a
            href={ticketsUrl}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-gray-400 text-gray-800 font-semibold hover:bg-gray-100 transition"
          >
            <Ticket className="w-5 h-5" />
            Descargar tickets PDF
          </a>
        </div>

        {/* BOTÓN VOLVER */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center gap-2 w-full bg-[#00b050] text-white py-3 rounded-full font-semibold hover:bg-[#009944] transition"
        >
          <ArrowLeftCircle className="w-5 h-5" />
          Volver al inicio
        </button>
      </div>

      <footer className="mt-10 text-xs text-gray-500">
        © SkyAndes Airlines 2025
      </footer>
    </div>
  );
}
