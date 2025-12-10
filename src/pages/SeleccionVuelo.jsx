import React, { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SeleccionVuelo() {
  const navigate = useNavigate();
  const location = useLocation();
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vueloSeleccionado, setVueloSeleccionado] = useState(null);

  const params = new URLSearchParams(location.search);
  const origen = params.get("origen");
  const destino = params.get("destino");
  const fecha = params.get("fecha");
  const fechaIda = params.get("fechaIda");
  const fechaVuelta = params.get("fechaVuelta");
  const tipo = params.get("tipo");
  const pasajeros = params.get("passengers") || 1;

  useEffect(() => {
    buscarVuelos();
  }, []);

  const buscarVuelos = async () => {
    try {
      setLoading(true);
      setError("");

      const apiUrl = `https://skyandesairlines-rest.runasp.net/api/v1/flights/search?origen=${encodeURIComponent(
        origen
      )}&destino=${encodeURIComponent(destino)}&fecha=${fecha}`;

      const response = await fetch(apiUrl);

      if (response.status === 404) {
        setVuelos([]);
        setError("No se encontraron vuelos disponibles ✈️");
        return;
      }

      if (!response.ok) {
        throw new Error("Error al consultar vuelos");
      }

      const data = await response.json();
      setVuelos(data);
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinuar = () => {
    if (!vueloSeleccionado) return;

    if (tipo === "ida_vuelta") {
      navigate(
        `/seleccion-vuelo-vuelta?origen=${destino}&destino=${origen}&fechaVuelta=${fechaVuelta}`,
        {
          state: { vueloIda: vueloSeleccionado, pasajeros },
        }
      );
    } else {
      navigate("/asientos", {
        state: { vueloIda: vueloSeleccionado, pasajeros },
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-gray-900">
      {/* NAVBAR */}
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
              {origen} ↔ {destino}
            </span>{" "}
            <span className="text-gray-300">• {fechaIda}</span>
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
              Desde USD{" "}
              {vueloSeleccionado
                ? Number(vueloSeleccionado.Price).toFixed(2)
                : "0.00"}
            </span>
          </div>
        </div>
      </header>

      {/* 🟩 BARRA DE PROGRESO — MISMA ALTURA & MISMO ESTILO */}
      <div className="fixed top-[60px] left-0 right-0 h-1.5 bg-gray-200 z-40 hidden md:block">
        <div className="bg-[#00b050] h-1.5 w-1/5 rounded-r-full"></div>
      </div>

      {/* 🟩 ESPACIADOR PARA QUE EL CONTENIDO NO SE OCUPE */}
      <div className="pt-[90px] md:pt-[110px]"></div>

      {/* TITULO */}
      <section className="px-4 md:px-8 py-4 md:py-6">
        <h2 className="text-lg md:text-xl font-semibold">
          Ida: {origen} a {destino}
        </h2>
      </section>

      {/* LOADING / ERROR */}
      {loading && (
        <p className="text-center text-gray-500">Buscando vuelos...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* LISTADO DE VUELOS */}
      <section className="px-4 md:px-8 space-y-4 md:space-y-6 pb-24">
        {vuelos.map((vuelo) => (
          <div
            key={vuelo.FlightId}
            onClick={() => setVueloSeleccionado(vuelo)}
            className={`bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-lg 
            p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-0 justify-between
            transition cursor-pointer ${
              vueloSeleccionado?.FlightId === vuelo.FlightId
                ? "ring-2 ring-[#00b050] bg-green-50"
                : ""
            }`}
          >
            {/* HORA SALIDA */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold">
                {new Date(vuelo.DepartureTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm">
                {vuelo.OriginName}
              </p>
            </div>

            {/* INFO */}
            <div className="flex flex-col items-center">
              <p className="text-[#0077ff] text-xs md:text-sm font-semibold mb-1">
                {vuelo.CabinClass}
              </p>
              <div className="border-t border-dashed border-gray-400 w-24 md:w-28"></div>
              <p className="text-[11px] md:text-xs mt-1 text-gray-500">
                {vuelo.Duration}
              </p>
            </div>

            {/* HORA LLEGADA */}
            <div className="text-center md:text-right">
              <h3 className="text-2xl md:text-3xl font-bold">
                {new Date(vuelo.ArrivalTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm">
                {vuelo.DestinationName}
              </p>
            </div>

            {/* PRECIO */}
            <div className="text-center md:text-right bg-green-50 border border-green-500 rounded-xl px-4 md:px-5 py-2 md:py-3">
              <p className="text-[11px] md:text-xs text-green-600 font-semibold mb-1">
                {vuelo.Airline}
              </p>
              <p className="text-base md:text-lg font-bold text-green-700">
                USD {parseFloat(vuelo.Price).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* BOTÓN CONTINUAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner py-3 flex justify-center">
        <button
          onClick={handleContinuar}
          disabled={!vueloSeleccionado}
          className={`px-10 py-3 rounded-full font-semibold text-white transition ${
            vueloSeleccionado
              ? "bg-[#00b050] hover:bg-[#009944]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
