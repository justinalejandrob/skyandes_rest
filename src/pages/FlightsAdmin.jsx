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
  const [airports, setAirports] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);

  //Listar aeropuertos
  async function listarAirports() {
    try {
      const resp = await fetch(
        "https://skyandesflight.runasp.net/api/v1/Airports"
      );

      if (!resp.ok) throw new Error("Error cargando aeropuertos");

      const json = await resp.json();
      setAirports(json.data);
    } catch (err) {
      console.error("❌ Airports:", err);
    }
  }

  //Obtener aircrafts
  async function listarAircrafts() {
    try {
      const resp = await fetch(
        "https://skyandesflight.runasp.net/api/v1/Aircraft"
      );

      if (!resp.ok) throw new Error("Error cargando aeronaves");

      const json = await resp.json();
      setAircrafts(json.data);
    } catch (err) {
      console.error("❌ Aircraft:", err);
    }
  }

  // =========================
  // MODAL DE CREACIÓN DE VUELO
  // =========================
  const [openCreate, setOpenCreate] = useState(false);

  const [newFlight, setNewFlight] = useState({
    flightNumber: "",
    originAirportId: "",
    destinationAirportId: "",
    aircraftId: "",
    departureTime: "",
    arrivalTime: "",
    basePriceEconomy: "",
    basePriceBusiness: "",
    baggageAllowanceKg: "",
    mealIncluded: true,
    status: "Scheduled",
  });

  // ===============================
  // FUNCIÓN PARA CREAR UN NUEVO VUELO
  // ===============================
  async function crearVuelo() {
    if (
      !newFlight.flightNumber ||
      !newFlight.originAirportId ||
      !newFlight.destinationAirportId ||
      !newFlight.aircraftId ||
      !newFlight.departureTime ||
      !newFlight.arrivalTime ||
      !newFlight.basePriceEconomy
    ) {
      alert("⚠️ Completa todos los campos obligatorios");
      return;
    }

    if (
      newFlight.originAirportId &&
      newFlight.destinationAirportId &&
      newFlight.originAirportId === newFlight.destinationAirportId
    ) {
      alert("❌ El aeropuerto de origen y destino no pueden ser el mismo");
      return;
    }

    try {
      const payload = {
        FlightNumber: newFlight.flightNumber,
        OriginAirportId: Number(newFlight.originAirportId),
        DestinationAirportId: Number(newFlight.destinationAirportId),
        AircraftId: Number(newFlight.aircraftId),
        DepartureTime: newFlight.departureTime,
        ArrivalTime: newFlight.arrivalTime,
        BasePriceEconomy: Number(newFlight.basePriceEconomy),
        BasePriceBusiness: Number(newFlight.basePriceBusiness || 0),
        BaggageAllowanceKg: Number(newFlight.baggageAllowanceKg || 0),
        MealIncluded: newFlight.mealIncluded,
        Status: newFlight.status,
      };

      const resp = await fetch(
        "https://skyandesflight.runasp.net/api/v1/Flights",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(errorText);
      }

      alert("✈️ Vuelo creado correctamente");

      setOpenCreate(false);
      listarVuelos();
    } catch (err) {
      alert("❌ Error al crear vuelo: " + err.message);
    }
  }

  // ============================================================
  // LISTAR VUELOS (lógica inalterada)
  // ============================================================
  async function listarVuelos() {
    setLoading(true);

    try {
      const resp = await fetch(
        "https://skyandesflight.runasp.net/api/v1/Flights"
      );

      if (!resp.ok) {
        throw new Error("Error al obtener vuelos");
      }

      const json = await resp.json();

      // 🔥 ADAPTAMOS EL DTO DEL BACK A TU FRONT
      const lista = json.data.map((f) => ({
        FlightId: f.id,
        Airline: "SkyAndes",
        FlightNumber: f.flightNumber,

        OriginName: `${f.origin.city} (${f.origin.iataCode})`,
        DestinationName: `${f.destination.city} (${f.destination.iataCode})`,

        DepartureTime: new Date(f.departureTime).toLocaleString(),
        ArrivalTime: new Date(f.arrivalTime).toLocaleString(),

        Duration: `${f.durationMinutes} min`,
        CabinClass: f.cabinClass ?? "Economy",

        AircraftModel: f.aircraft?.model ?? "N/D",
        SeatsAvailable: f.seatsAvailable ?? "--",
        Price: f.priceEconomy ?? "0.00",
      }));

      setVuelos(lista);
    } catch (error) {
      console.error("❌ Error listando vuelos:", error);
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
          onClick={() => {
            setOpenCreate(true);
            listarAirports();
            listarAircrafts();
          }}
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
                  <th className="py-3 text-left w-1/5">Vuelo</th>
                  <th className="text-left w-1/6">Origen</th>
                  <th className="text-left w-1/6">Destino</th>
                  <th className="text-left">Salida</th>
                  <th className="text-left">Llegada</th>
                  <th className="text-left hidden lg:table-cell">Duración</th>
                  <th className="text-left hidden sm:table-cell">Seats</th>
                  <th className="text-left">Precio</th>
                  <th className="text-right">Acción</th>
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
              Crear Nuevo Vuelo
            </h2>

            <div className="grid grid-cols-2 gap-5 text-white">
              {/* ORIGEN */}
              <div>
                <label className="text-sm text-gray-300">
                  Aeropuerto de Origen *
                </label>
                <select
                  className="w-full bg-white text-gray-900 p-2 rounded mt-1"
                  value={newFlight.originAirportId}
                  onChange={(e) =>
                    setNewFlight({
                      ...newFlight,
                      originAirportId: e.target.value,
                      destinationAirportId: "",
                    })
                  }
                >
                  <option value="">Selecciona origen</option>
                  {airports
                    .filter(
                      (a) => a.id !== Number(newFlight.destinationAirportId)
                    )
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.city} ({a.iataCode})
                      </option>
                    ))}
                </select>
              </div>

              {/* DESTINO */}
              <div>
                <label className="text-sm text-gray-300">
                  Aeropuerto de Destino *
                </label>
                <select
                  className="w-full bg-white text-gray-900 p-2 rounded mt-1"
                  value={newFlight.destinationAirportId}
                  onChange={(e) =>
                    setNewFlight({
                      ...newFlight,
                      destinationAirportId: e.target.value,
                    })
                  }
                >
                  <option value="">Selecciona destino</option>
                  {airports
                    .filter((a) => a.id !== Number(newFlight.originAirportId))
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.city} ({a.iataCode})
                      </option>
                    ))}
                </select>
              </div>

              {/* FLIGHT NUMBER */}
              <div>
                <label className="text-sm text-gray-300">
                  Número de Vuelo *
                </label>
                <input
                  className="w-full bg-white/10 p-2 rounded mt-1"
                  placeholder="Ej: SA-123"
                  value={newFlight.flightNumber}
                  onChange={(e) =>
                    setNewFlight({ ...newFlight, flightNumber: e.target.value })
                  }
                />
              </div>

              {/* AIRCRAFT */}
              <div>
                <label className="text-sm text-gray-300">Aeronave *</label>
                <select
                  className="w-full bg-white text-gray-900 p-2 rounded mt-1"
                  value={newFlight.aircraftId}
                  onChange={(e) =>
                    setNewFlight({ ...newFlight, aircraftId: e.target.value })
                  }
                >
                  <option value="">Selecciona aeronave</option>
                  {aircrafts.map((ac) => (
                    <option key={ac.id} value={ac.id}>
                      {ac.model} • {ac.manufacturer}
                    </option>
                  ))}
                </select>
              </div>

              {/* DEPARTURE */}
              <div>
                <label className="text-sm text-gray-300">
                  Fecha y Hora de Salida *
                </label>
                <input
                  type="datetime-local"
                  className="w-full bg-white/10 p-2 rounded mt-1"
                  min={new Date().toISOString().slice(0, 16)}
                  value={newFlight.departureTime}
                  onChange={(e) =>
                    setNewFlight({
                      ...newFlight,
                      departureTime: e.target.value,
                    })
                  }
                />
              </div>

              {/* ARRIVAL */}
              <div>
                <label className="text-sm text-gray-300">
                  Fecha y Hora de Llegada *
                </label>
                <input
                  type="datetime-local"
                  className="w-full bg-white/10 p-2 rounded mt-1"
                  min={newFlight.departureTime}
                  value={newFlight.arrivalTime}
                  onChange={(e) =>
                    setNewFlight({ ...newFlight, arrivalTime: e.target.value })
                  }
                />
              </div>

              {/* PRICE */}
              <div className="col-span-2">
                <label className="text-sm text-gray-300">
                  Precio Económica (USD) *
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full bg-white/10 p-2 rounded mt-1"
                  placeholder="Ej: 120"
                  value={newFlight.basePriceEconomy}
                  onChange={(e) =>
                    setNewFlight({
                      ...newFlight,
                      basePriceEconomy: e.target.value,
                    })
                  }
                />
              </div>
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
