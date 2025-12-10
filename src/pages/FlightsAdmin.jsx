// src/pages/FlightsAdmin.jsx
import React, { useEffect, useState } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import HeaderAdmin from "../components/HeaderAdmin";
import {
  Search,
  Plane,
  Clock,
  ArrowRight,
  Eye,
  Rocket, // Nuevo icono para el botón
  Cloud, // Icono para origen/destino
  DollarSign, // Icono para precio
  Loader2, // Icono para carga
} from "lucide-react";

// ============================================================
// COMPONENTE DE FONDO DE GALAXIA (SVG CANVAS)
// Reutilizado del componente AdminDashboard para consistencia
// ============================================================
const GalaxyBackground = () => (
  <>
    <style jsx global>{`
      @keyframes twinkle {
        0%,
        100% {
          opacity: 0.8;
          transform: scale(1);
        }
        50% {
          opacity: 0.4;
          transform: scale(1.2);
        }
      }
      .star {
        animation: twinkle 3s ease-in-out infinite alternate;
      }
    `}</style>
    <svg
      className="fixed inset-0 w-full h-full -z-10"
      style={{ backgroundColor: "#0A0A1F" }} // Fondo azul muy oscuro
    >
      {/* (Estrellas y Nebulosa se mantienen igual) */}
      <circle
        className="star"
        cx="50%"
        cy="10%"
        r="1"
        fill="#fff"
        style={{ animationDelay: "0s" }}
      />
      <circle
        className="star"
        cx="80%"
        cy="50%"
        r="0.5"
        fill="#fff"
        style={{ animationDelay: "0.5s" }}
      />
      <circle
        className="star"
        cx="20%"
        cy="90%"
        r="1.2"
        fill="#fff"
        style={{ animationDelay: "1s" }}
      />
      <circle
        className="star"
        cx="35%"
        cy="30%"
        r="0.7"
        fill="#fff"
        style={{ animationDelay: "1.5s" }}
      />
      <circle
        className="star"
        cx="70%"
        cy="80%"
        r="1.5"
        fill="#fff"
        style={{ animationDelay: "2s" }}
      />
      <circle
        className="star"
        cx="10%"
        cy="65%"
        r="0.6"
        fill="#fff"
        style={{ animationDelay: "2.5s" }}
      />
      <circle
        className="star"
        cx="90%"
        cy="20%"
        r="0.9"
        fill="#fff"
        style={{ animationDelay: "3s" }}
      />
      <circle
        className="star"
        cx="45%"
        cy="75%"
        r="1.1"
        fill="#fff"
        style={{ animationDelay: "3.5s" }}
      />
      <defs>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
        </filter>
      </defs>
      <g filter="url(#blur)">
        <ellipse
          cx="100%"
          cy="0%"
          rx="200"
          ry="100"
          fill="#3F37C9"
          opacity="0.1"
        />
        <ellipse
          cx="0%"
          cy="100%"
          rx="150"
          ry="80"
          fill="#4CC9F0"
          opacity="0.08"
        />
        <circle cx="50%" cy="50%" r="50" fill="#F72585" opacity="0.05" />
      </g>
    </svg>
  </>
);

const SOAP_URL =
  "https://skyandesairlines-ws.runasp.net/SkyAndes_SOAP/WS_Flights.asmx";
const NS = "http://skyandes.com/ws/flights";

export default function FlightsAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [selectedFlight, setSelectedFlight] = useState(null);

  // =========================
  // MODAL DE CREACIÓN DE VUELO
  // =========================
  const [openCreate, setOpenCreate] = useState(false);

  const [newFlight, setNewFlight] = useState({
    OriginId: "",
    DestinationId: "",
    Airline: "SkyAndes",
    FlightNumber: "",
    DepartureTime: "",
    ArrivalTime: "",
    CancellationPolicy: "Reembolsable",
    CabinClass: "Economy",
    AircraftId: "",
    Price: "",
  });

  // =====================
  // Catálogo de aeropuertos
  // =====================
  const airports = [
    { id: 1, name: "Quito (UIO)" },
    { id: 2, name: "Guayaquil (GYE)" },
    { id: 3, name: "Cuenca (CUE)" },
    { id: 4, name: "París (CDG)" },
    { id: 5, name: "Miami (MIA)" },
    { id: 6, name: "Madrid (MAD)" },
    { id: 7, name: "San Juan (SJU)" },
    { id: 8, name: "New York (JFK)" },
  ];

  // ====================
  // Catálogo de Aircrafts
  // ====================
  const aircrafts = [
    { id: 1, model: "Airbus A220-100" },
    { id: 2, model: "Airbus A220-300" },
    { id: 3, model: "Airbus A318" },
    { id: 4, model: "Airbus A319" },
    { id: 5, model: "Airbus A320neo" },
    { id: 6, model: "Airbus A321neo" },
    { id: 7, model: "Airbus A330-200" },
    { id: 8, model: "Airbus A330-300" },
    { id: 9, model: "Airbus A350-900" },
    { id: 10, model: "Airbus A350-1000" },
    { id: 11, model: "Boeing 717-200" },
    { id: 12, model: "Boeing 737-700" },
    { id: 13, model: "Boeing 737-800" },
    { id: 14, model: "Boeing 737 MAX 8" },
    { id: 15, model: "Boeing 737 MAX 9" },
    { id: 16, model: "Boeing 757-200" },
    { id: 17, model: "Boeing 767-300ER" },
    { id: 18, model: "Boeing 777-200ER" },
    { id: 19, model: "Boeing 777-300ER" },
    { id: 20, model: "Boeing 787-9 Dreamliner" },
    { id: 21, model: "Embraer E170" },
    { id: 22, model: "Embraer E175" },
    { id: 23, model: "Embraer E190" },
    { id: 24, model: "Embraer E195-E2" },
    { id: 25, model: "ATR 42-600" },
    { id: 26, model: "ATR 72-600" },
    { id: 27, model: "Bombardier CRJ700" },
    { id: 28, model: "Bombardier CRJ900" },
    { id: 29, model: "Bombardier Q400" },
    { id: 30, model: "McDonnell Douglas MD-11" },
    { id: 31, model: "Airbus A380-800" },
  ];

  // ===============================
  // FUNCIÓN PARA CREAR UN NUEVO VUELO
  // ===============================
  async function crearVuelo() {
    try {
      const payload = {
        OriginId: parseInt(newFlight.OriginId),
        DestinationId: parseInt(newFlight.DestinationId),
        Airline: newFlight.Airline,
        FlightNumber: newFlight.FlightNumber,
        DepartureTime: newFlight.DepartureTime,
        ArrivalTime: newFlight.ArrivalTime,
        CancellationPolicy: newFlight.CancellationPolicy,
        CabinClass: newFlight.CabinClass,
        AircraftId: parseInt(newFlight.AircraftId),
        Price: parseFloat(newFlight.Price),
      };

      const resp = await fetch(
        "https://skyandesairlines-rest.runasp.net/api/v1/flights",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error("Error al crear vuelo: " + text);
      }

      alert("✈️ Vuelo creado correctamente");

      setOpenCreate(false);
      listarVuelos(); // refrescar tabla
    } catch (err) {
      alert(err.message);
    }
  }

  // ============================================================
  // LISTAR VUELOS (lógica inalterada)
  // ============================================================
  async function listarVuelos() {
    setLoading(true);
    const envelope = `
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:f="${NS}">
      <soap:Body>
        <f:ListarVuelos />
      </soap:Body>
    </soap:Envelope>`;

    try {
      const resp = await fetch(SOAP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml",
          SOAPAction: `"${NS}/ListarVuelos"`,
        },
        body: envelope,
      });

      const xmlText = await resp.text();
      const xml = new DOMParser().parseFromString(xmlText, "text/xml");
      const nodes = [...xml.getElementsByTagName("DTOFlight")];

      const lista = nodes.map((n) => ({
        FlightId: n.getElementsByTagName("FlightId")[0]?.textContent,
        Airline: n.getElementsByTagName("Airline")[0]?.textContent,
        FlightNumber: n.getElementsByTagName("FlightNumber")[0]?.textContent,
        OriginName: n.getElementsByTagName("OriginName")[0]?.textContent,
        DestinationName:
          n.getElementsByTagName("DestinationName")[0]?.textContent,
        DepartureTime: n.getElementsByTagName("DepartureTime")[0]?.textContent,
        ArrivalTime: n.getElementsByTagName("ArrivalTime")[0]?.textContent,
        Duration: n.getElementsByTagName("Duration")[0]?.textContent,
        CabinClass: n.getElementsByTagName("CabinClass")[0]?.textContent,
        AircraftModel: n.getElementsByTagName("AircraftModel")[0]?.textContent,
        Price: n.getElementsByTagName("Price")[0]?.textContent,
        SeatsAvailable:
          n.getElementsByTagName("SeatsAvailable")[0]?.textContent,
      }));

      setVuelos(lista);
    } catch (error) {
      console.error("Error fetching flights:", error);
      // Opcional: Mostrar un mensaje de error al usuario
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    listarVuelos();
  }, []);

  // FILTRO POR BUSQUEDA
  const vuelosFiltrados = vuelos.filter((v) =>
    (v.FlightNumber + v.OriginName + v.DestinationName)
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  // ============================================================
  // COMPONENTE LOADER
  // ============================================================
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <Loader2 size={48} className="text-indigo-400 animate-spin mb-4" />
      <p className="text-xl font-semibold text-gray-200">
        Estableciendo conexión con el centro de control...
      </p>
      <p className="text-sm text-indigo-300/70 mt-1">
        Cargando datos de vuelos, por favor espera.
      </p>
    </div>
  );

  // ============================================================
  // COMPONENTE MODAL DE DETALLE
  // ============================================================
  const FlightDetailModal = ({ flight, onClose }) => {
    if (!flight) return null;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
        <div className="bg-[#1e2023] w-full max-w-lg p-8 rounded-2xl shadow-[0_0_40px_rgba(129,140,248,0.3)] border border-indigo-700/50 transform scale-100 transition-transform duration-300">
          <h2 className="text-2xl font-bold mb-6 text-white border-b border-indigo-600/50 pb-3 flex items-center justify-between">
            <span>
              <Plane className="inline mr-2 text-indigo-400" /> Vuelo #
              {flight.FlightNumber}
            </span>
            <span className="text-sm font-light text-indigo-300">
              {flight.Airline}
            </span>
          </h2>

          {/* GRID DE DETALLES */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <DetailItem
              label="Origen"
              value={flight.OriginName}
              icon={<Cloud size={16} className="text-gray-400" />}
            />
            <DetailItem
              label="Destino"
              value={flight.DestinationName}
              icon={<Cloud size={16} className="text-gray-400" />}
            />

            <DetailItem
              label="Salida"
              value={flight.DepartureTime}
              icon={<Clock size={16} className="text-yellow-400" />}
            />
            <DetailItem
              label="Llegada"
              value={flight.ArrivalTime}
              icon={<Clock size={16} className="text-yellow-400" />}
            />

            <DetailItem
              label="Duración"
              value={flight.Duration}
              icon={<ArrowRight size={16} className="text-cyan-400" />}
            />
            <DetailItem
              label="Clase"
              value={flight.CabinClass}
              icon={<TachometerShare size={16} className="text-pink-400" />}
            />

            <DetailItem
              label="Modelo Avión"
              value={flight.AircraftModel}
              icon={<Plane size={16} className="text-green-400" />}
            />
            <DetailItem
              label="Asientos Disp."
              value={flight.SeatsAvailable}
              icon={<Users size={16} className="text-red-400" />}
            />

            {/* Precio en una línea destacada */}
            <div className="col-span-2 pt-4 border-t border-gray-700 mt-2 flex justify-between items-center">
              <p className="font-bold text-lg text-indigo-400 flex items-center">
                <DollarSign size={20} className="mr-2 text-green-400" /> Precio:
              </p>
              <p className="text-2xl font-extrabold text-green-400">
                ${flight.Price}
              </p>
            </div>
          </div>

          <div className="text-right mt-8">
            <button
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/50"
              onClick={onClose}
            >
              Cerrar Detalles
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Pequeño componente auxiliar para los detalles
  const DetailItem = ({ label, value, icon }) => (
    <div className="flex items-center space-x-2">
      <div className="text-gray-400">{icon}</div>
      <p>
        <strong className="text-gray-300">{label}:</strong>{" "}
        <span className="text-white">{value}</span>
      </p>
    </div>
  );

  return (
    <div className="flex font-sans">
      <GalaxyBackground />

      {/* SIDEBAR */}
      <SidebarAdmin open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* CONTENIDO */}
      <main className="flex-1 md:ml-64 p-8 min-h-screen relative z-10">
        <HeaderAdmin onToggleSidebar={() => setSidebarOpen(true)} />

        {/* TÍTULO */}
        <h1 className="text-3xl font-extrabold text-white mb-10 mt-4 tracking-tight">
          <Rocket className="inline mr-2 text-indigo-400" size={30} />
          <span className="text-indigo-400">Gestión de Rutas</span> y Vuelos
        </h1>

        {/* BUSCADOR */}
        <div className="mb-8 flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-indigo-700/50 shadow-2xl transition duration-300 hover:border-indigo-500">
          <Search className="text-indigo-400" size={24} />
          <input
            type="text"
            className="bg-transparent flex-1 outline-none text-white placeholder-gray-400 text-lg"
            placeholder="Buscar por vuelo, origen, destino..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button
          onClick={() => setOpenCreate(true)}
          className="mb-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg font-semibold flex items-center gap-2"
        >
          <Rocket size={20} /> Nuevo Vuelo
        </button>

        {/* TABLA DE VUELOS */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-indigo-700/50 p-6 overflow-x-auto">
          {loading ? (
            <LoadingState />
          ) : vuelosFiltrados.length === 0 ? (
            <p className="text-gray-400 text-center py-10">
              No se encontraron vuelos que coincidan con la búsqueda.
            </p>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-indigo-300 uppercase text-xs tracking-wider border-b border-indigo-700/50">
                  <th className="py-3 text-left w-1/5">✈️ Vuelo</th>
                  <th className="text-left w-1/6">🌍 Origen</th>
                  <th className="text-left w-1/6">📍 Destino</th>
                  <th className="text-left">🕒 Salida</th>
                  <th className="text-left">🏁 Llegada</th>
                  <th className="text-left hidden lg:table-cell">⏱ Duración</th>
                  <th className="text-left hidden sm:table-cell">💺 Seats</th>
                  <th className="text-left">💲 Precio</th>
                  <th className="text-right">👁 Acción</th>
                </tr>
              </thead>

              <tbody>
                {vuelosFiltrados.map((v) => (
                  <tr
                    key={v.FlightId}
                    className="border-b border-gray-800 hover:bg-white/5 transition duration-200"
                  >
                    <td className="py-4 font-bold flex items-center gap-2">
                      <Plane size={18} className="text-cyan-400" />
                      <span className="text-white">{v.Airline}</span>
                      <span className="text-indigo-300/80 font-medium">
                        #{v.FlightNumber}
                      </span>
                    </td>

                    <td className="text-gray-200">{v.OriginName}</td>
                    <td className="text-gray-200">{v.DestinationName}</td>
                    <td className="text-gray-300">{v.DepartureTime}</td>
                    <td className="text-gray-300">{v.ArrivalTime}</td>
                    <td className="text-gray-400 hidden lg:table-cell">
                      {v.Duration}
                    </td>

                    <td className="text-green-400 font-semibold hidden sm:table-cell">
                      {v.SeatsAvailable}
                    </td>

                    <td className="text-green-300 font-extrabold">
                      ${v.Price}
                    </td>

                    <td className="text-right">
                      <button
                        onClick={() => setSelectedFlight(v)}
                        className="p-2 rounded-full text-yellow-300 hover:text-white hover:bg-yellow-600/30 transition border border-transparent hover:border-yellow-500/50 shadow-md"
                        title="Ver Detalles"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* FOOTER */}
        <footer className="mt-12 text-center text-indigo-400/50 text-sm">
          © SkyAndes Airlines 2025 — Gestión de Vuelos
        </footer>
      </main>

      {/* MODAL DETALLE DE VUELO */}
      <FlightDetailModal
        flight={selectedFlight}
        onClose={() => setSelectedFlight(null)}
      />

      {openCreate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e2023] w-full max-w-xl p-8 rounded-2xl shadow-[0_0_40px_rgba(129,140,248,0.3)] border border-indigo-700/50">
            <h2 className="text-2xl font-bold text-white mb-6">
              ✈️ Crear Nuevo Vuelo
            </h2>

            <div className="grid grid-cols-2 gap-4 text-white">
              {/* ORIGEN */}
              <select
                className="bg-white/10 p-2 rounded"
                value={newFlight.OriginId}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, OriginId: e.target.value })
                }
              >
                <option value="">Origen</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>

              {/* DESTINO */}
              <select
                className="bg-white/10 p-2 rounded"
                value={newFlight.DestinationId}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, DestinationId: e.target.value })
                }
              >
                <option value="">Destino</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>

              {/* FLIGHT NUMBER */}
              <input
                className="bg-white/10 p-2 rounded"
                placeholder="Número de vuelo"
                value={newFlight.FlightNumber}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, FlightNumber: e.target.value })
                }
              />

              {/* AIRLINE */}
              <input
                className="bg-white/10 p-2 rounded"
                placeholder="Aerolínea"
                value={newFlight.Airline}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, Airline: e.target.value })
                }
              />

              {/* DEPARTURE */}
              <input
                type="datetime-local"
                className="bg-white/10 p-2 rounded"
                value={newFlight.DepartureTime}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, DepartureTime: e.target.value })
                }
              />

              {/* ARRIVAL */}
              <input
                type="datetime-local"
                className="bg-white/10 p-2 rounded"
                value={newFlight.ArrivalTime}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, ArrivalTime: e.target.value })
                }
              />

              {/* CABIN CLASS */}
              <select
                className="bg-white/10 p-2 rounded"
                value={newFlight.CabinClass}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, CabinClass: e.target.value })
                }
              >
                <option value="Economy">Económica</option>
              </select>

              {/* AIRCRAFT */}
              <select
                className="bg-white/10 p-2 rounded"
                value={newFlight.AircraftId}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, AircraftId: e.target.value })
                }
              >
                <option value="">Avión</option>
                {aircrafts.map((ac) => (
                  <option key={ac.id} value={ac.id}>
                    {ac.model}
                  </option>
                ))}
              </select>

              {/* PRICE */}
              <input
                type="number"
                className="bg-white/10 p-2 rounded"
                placeholder="Precio ($)"
                value={newFlight.Price}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, Price: e.target.value })
                }
              />
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setOpenCreate(false)}
                className="px-5 py-2 bg-gray-600 rounded-lg text-white"
              >
                Cancelar
              </button>

              <button
                onClick={crearVuelo}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white shadow-lg"
              >
                Crear Vuelo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
