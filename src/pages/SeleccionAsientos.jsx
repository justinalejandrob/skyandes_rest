import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Edit, AlertTriangle } from "lucide-react";

// 🟩 Ícono de asiento SVG personalizado
const SeatIcon = ({ className, fill }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Respaldo y base curvada para parecer asiento de avión */}
    <path d="M20,15 C20,5 80,5 80,15 L80,70 C80,85 70,95 50,95 C30,95 20,85 20,70 Z" />
    {/* Reposabrazos */}
    <rect x="10" y="40" width="10" height="40" rx="5" />
    <rect x="80" y="40" width="10" height="40" rx="5" />
  </svg>
);

export default function SeleccionAsientos() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🟩 Datos que vienen del flujo anterior
  const {
    vueloIda,
    vueloVuelta,
    pasajeros: pasajerosState,
    tipo: tipoState,
  } = location.state || {};

  const pasajeros = pasajerosState || 1;
  const tipo = tipoState || (vueloVuelta ? "ida_vuelta" : "solo_ida");

  // 🟩 Usuario logueado (para SeatHold)
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.UserId || 0;

  // 🟩 Asientos por vuelo
  const [seatsIda, setSeatsIda] = useState([]);
  const [seatsVuelta, setSeatsVuelta] = useState([]);

  // 🟩 Selección por pasajero y por tramo
  const [selectedIda, setSelectedIda] = useState(Array(pasajeros).fill(null));
  const [selectedVuelta, setSelectedVuelta] = useState(
    Array(pasajeros).fill(null)
  );

  // 🔁 tramo activo (ida / vuelta)
  const [activeLeg, setActiveLeg] = useState("ida");

  const [loadingSeats, setLoadingSeats] = useState(false);
  const [errorSeats, setErrorSeats] = useState("");

  // ================================
  // 🔥 Fetch del mapa de asientos
  // ================================
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoadingSeats(true);
        setErrorSeats("");

        const requests = [];

        if (vueloIda?.FlightId) {
          requests.push(
            fetch(
              `https://skyandesairlines-rest.runasp.net/api/v1/seats/map?flightId=${vueloIda.FlightId}`
            )
              .then((r) => {
                if (!r.ok) throw new Error("Error obteniendo asientos ida");
                return r.json();
              })
              .then((data) => {
                console.log("ASIENTOS IDA RAW:", data);

                if (data?.Rows) {
                  const flatSeats = data.Rows.flatMap((r) =>
                    r.Seats.map((s) => ({
                      ...s,
                      Row: r.Row,
                      Available: !s.Occupied,
                    }))
                  );

                  setSeatsIda(flatSeats);
                } else {
                  setSeatsIda([]);
                }
              })
          );
        }

        if (vueloVuelta?.FlightId) {
          requests.push(
            fetch(
              `https://skyandesairlines-rest.runasp.net/api/v1/seats/map?flightId=${vueloVuelta.FlightId}`
            )
              .then((r) => {
                if (!r.ok) throw new Error("Error obteniendo asientos vuelta");
                return r.json();
              })
              .then((data) => {
                console.log("ASIENTOS VUELTA RAW:", data);

                if (data?.Rows) {
                  const flatSeats = data.Rows.flatMap((r) =>
                    r.Seats.map((s) => ({
                      ...s,
                      Row: r.Row,
                      Available: !s.Occupied,
                    }))
                  );

                  setSeatsVuelta(flatSeats);
                } else {
                  setSeatsVuelta([]);
                }
              })
          );
        }

        await Promise.all(requests);
      } catch (err) {
        console.error(err);
        setErrorSeats("No se pudieron cargar los asientos del vuelo.");
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchSeats();
  }, [vueloIda, vueloVuelta]);

  // ================================
  // Helpers para labels
  // ================================
  const originLabelIda =
    vueloIda?.OriginIata ||
    vueloIda?.OriginCode ||
    vueloIda?.OriginName ||
    "Origen";

  const destLabelIda =
    vueloIda?.DestinationIata ||
    vueloIda?.DestinationCode ||
    vueloIda?.DestinationName ||
    "Destino";

  const originLabelVuelta =
    vueloVuelta?.OriginIata ||
    vueloVuelta?.OriginCode ||
    vueloVuelta?.OriginName ||
    destLabelIda;

  const destLabelVuelta =
    vueloVuelta?.DestinationIata ||
    vueloVuelta?.DestinationCode ||
    vueloVuelta?.DestinationName ||
    originLabelIda;

  // ================================
  // 🧮 Precio total asientos
  // ================================
  const calcularTotal = useMemo(() => {
    let total = 0;

    const calcLeg = (selected, flight) => {
      if (!flight) return;

      selected.forEach((item) => {
        if (!item) return;

        const seatClass =
          item.seat.CabinClass ||
          item.seat.cabinClass ||
          item.seat.seatClass ||
          item.seat.SeatClass;

        const basePrice = Number(flight.Price) || 0;

        let factor = 1.0;
        if (seatClass === "Business") factor = 1.5;
        else if (seatClass === "Premium Economy" || seatClass === "Premium")
          factor = 1.25;
        else if (seatClass === "First") factor = 2.0;

        total += basePrice * factor;
      });
    };

    calcLeg(selectedIda, vueloIda);
    calcLeg(selectedVuelta, vueloVuelta);

    return total;
  }, [selectedIda, selectedVuelta, vueloIda, vueloVuelta]);

  // ================================
  // 🧠 Utilidades de asiento / fila
  // ================================
  const parseSeatNumber = (seat) => {
    const sn = seat.SeatNumber || seat.seatNumber;
    if (!sn) return { row: 0, col: "?" };

    const match = sn.match(/^(\d+)([A-Z])$/i);
    if (!match) return { row: 0, col: sn };

    return { row: parseInt(match[1], 10), col: match[2].toUpperCase() };
  };

  const groupSeatsByCabin = (seats) => {
    const cabins = {
      Business: [],
      "Premium Economy": [],
      Premium: [],
      Economy: [],
      First: [],
      Other: [],
    };

    seats.forEach((seat) => {
      const seatClass =
        seat.CabinClass ||
        seat.cabinClass ||
        seat.seatClass ||
        seat.SeatClass ||
        "Other";

      if (seatClass === "Business") cabins.Business.push(seat);
      else if (seatClass === "Premium Economy")
        cabins["Premium Economy"].push(seat);
      else if (seatClass === "Premium") cabins.Premium.push(seat);
      else if (seatClass === "Economy") cabins.Economy.push(seat);
      else if (seatClass === "First") cabins.First.push(seat);
      else cabins.Other.push(seat);
    });

    return cabins;
  };

  const groupByRow = (seats) => {
    const map = {};
    seats.forEach((seat) => {
      const { row } = parseSeatNumber(seat);
      if (!map[row]) map[row] = [];
      map[row].push(seat);
    });

    return Object.entries(map).sort((a, b) => Number(a[0]) - Number(b[0]));
  };

  const isExitRow = (seat) => {
    const flag = seat.isExitRow || seat.IsExitRow;
    if (flag != null) return Boolean(flag);

    const { row } = parseSeatNumber(seat);
    return row === 12 || row === 14;
  };

  // ================================
  // 🎯 Seleccionar asiento
  // ================================
  const handleSeatClick = async (seat, leg) => {
    const available = seat.available ?? seat.Available;
    const seatId = seat.SeatId || seat.seatId;

    if (!available) return;

    if (!userId) {
      alert("Debes iniciar sesión para seleccionar asientos.");
      return;
    }

    const isIda = leg === "ida";
    const selected = isIda ? [...selectedIda] : [...selectedVuelta];
    const seats = isIda ? [...seatsIda] : [...seatsVuelta];

    const existingIndex = selected.findIndex(
      (s) => s && (s.seat.SeatId || s.seat.seatId) === seatId
    );

    // Deseleccionar
    if (existingIndex !== -1) {
      const holdId = selected[existingIndex].holdId;

      try {
        await fetch(
          `https://skyandesairlines-rest.runasp.net/api/v1/seats/cancel/${encodeURIComponent(
            holdId
          )}`,
          { method: "DELETE" }
        );
      } catch {}

      selected[existingIndex] = null;

      const idx = seats.findIndex((s) => (s.SeatId || s.seatId) === seatId);
      if (idx !== -1) {
        seats[idx] = { ...seats[idx], Available: true, available: true };
      }

      if (isIda) {
        setSelectedIda(selected);
        setSeatsIda(seats);
      } else {
        setSelectedVuelta(selected);
        setSeatsVuelta(seats);
      }

      return;
    }

    // Nuevo asiento
    const usados = selected.filter(Boolean).length;
    if (usados >= pasajeros) {
      alert("Ya seleccionaste todos los asientos.");
      return;
    }

    try {
      const flightId = isIda ? vueloIda.FlightId : vueloVuelta.FlightId;

      const resp = await fetch(
        "https://skyandesairlines-rest.runasp.net/api/v1/seats/hold",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            flightId,
            seatId,
          }),
        }
      );

      if (!resp.ok) {
        alert("No se pudo bloquear el asiento.");
        return;
      }

      const data = await resp.json();
      const holdId = data.holdId;

      let indexToUse = selected.findIndex((x) => !x);
      if (indexToUse === -1) indexToUse = usados;

      selected[indexToUse] = { seat, holdId };

      const idx = seats.findIndex((s) => (s.SeatId || s.seatId) === seatId);
      if (idx !== -1) {
        seats[idx] = { ...seats[idx], Available: false };
      }

      if (isIda) {
        setSelectedIda(selected);
        setSeatsIda(seats);
      } else {
        setSelectedVuelta(selected);
        setSeatsVuelta(seats);
      }
    } catch (e) {
      console.error(e);
      alert("Error conectando al servidor");
    }
  };

  // ================================
  // Info para cada pasajero
  // ================================
  const buildPassengerInfo = (idx) => {
    const ida = selectedIda[idx];
    const vuelta = selectedVuelta[idx];

    const getSeatText = (item) => {
      if (!item) return "Sin seleccionar";

      const number = item.seat.SeatNumber || item.seat.seatNumber;
      const cls =
        item.seat.CabinClass ||
        item.seat.cabinClass ||
        item.seat.seatClass ||
        item.seat.SeatClass;

      return `${number} · ${cls}`;
    };

    return {
      ida: getSeatText(ida),
      vuelta: getSeatText(vuelta),
    };
  };

  // ================================
  // Continuar
  // ================================
  const handleSiguiente = () => {
    const sIda = selectedIda.filter(Boolean).length;
    const sVuelta = selectedVuelta.filter(Boolean).length;

    if (tipo === "solo_ida") {
      if (sIda < pasajeros) {
        alert("Debes seleccionar todos los asientos de ida.");
        return;
      }
    } else {
      if (sIda < pasajeros) {
        alert("Selecciona todos los asientos de ida.");
        return;
      }
      if (vueloVuelta && sVuelta < pasajeros) {
        alert("Selecciona todos los asientos de regreso.");
        return;
      }
    }

    navigate("/pasajeros", {
      state: {
        vueloIda,
        vueloVuelta,
        pasajeros,
        tipo,
        seatsIda: selectedIda.filter(Boolean),
        seatsVuelta: selectedVuelta.filter(Boolean),
        totalSeatsPrice: calcularTotal,
      },
    });
  };

  // ================================
  // Render seat button (MODIFICADO: Usa Icono)
  // ================================
  const renderSeatButton = (seat, leg) => {
    const available = seat.available ?? seat.Available;
    const seatNumber = seat.SeatNumber || seat.seatNumber;

    const seatClass =
      seat.CabinClass ||
      seat.cabinClass ||
      seat.seatClass ||
      seat.SeatClass ||
      "Economy";

    const { col } = parseSeatNumber(seat);

    const selectedList = leg === "ida" ? selectedIda : selectedVuelta;

    const isSelected = selectedList.some(
      (s) =>
        s && (s.seat.SeatId || s.seat.seatId) === (seat.SeatId || seat.seatId)
    );

    // Lógica de color para el RELLENO del SVG (Text color en Tailwind)
    let seatColorClass = "text-green-600"; // Standard
    if (seatClass === "Business") seatColorClass = "text-indigo-600";
    else if (seatClass === "Premium Economy" || seatClass === "Premium")
      seatColorClass = "text-amber-500";
    else if (seatClass === "First") seatColorClass = "text-emerald-600";

    if (!available) seatColorClass = "text-gray-300 cursor-not-allowed";

    const hoverEffect =
      available && !isSelected ? "hover:text-opacity-80 hover:scale-105" : "";
    const selectedStyles = isSelected
      ? "ring-2 ring-[#00b050] rounded-lg bg-white/10 scale-110 z-10"
      : "";

    return (
      <button
        key={seatNumber}
        type="button"
        disabled={!available}
        onClick={() => handleSeatClick(seat, leg)}
        className={`relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center transition-all duration-200 ${seatColorClass} ${hoverEffect} ${selectedStyles}`}
      >
        <SeatIcon
          className="w-full h-full drop-shadow-sm"
          fill="currentColor"
        />

        {/* Letra del asiento sobrepuesta */}
        <span
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[9px] md:text-[10px] font-bold ${
            !available ? "text-gray-400" : "text-white mix-blend-overlay"
          }`}
        >
          {col}
        </span>
      </button>
    );
  };

  // ================================
  // Render mapa (MODIFICADO: Estilo Fuselaje)
  // ================================
  const renderPlane = (leg) => {
    const seats = leg === "ida" ? seatsIda : seatsVuelta;

    const flightLabel =
      leg === "ida"
        ? `${originLabelIda} → ${destLabelIda}`
        : `${originLabelVuelta} → ${destLabelVuelta}`;

    if (!seats || seats.length === 0) {
      return (
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center text-sm text-gray-500">
          {loadingSeats
            ? "Cargando mapa de asientos..."
            : "No hay información de asientos para este vuelo."}
        </div>
      );
    }

    const cabins = groupSeatsByCabin(seats);

    const renderCabin = (title, seatsCabin) => {
      if (!seatsCabin || seatsCabin.length === 0) return null;

      const rows = groupByRow(seatsCabin);

      return (
        <div className="mb-8" key={title}>
          <div className="flex items-center justify-between mb-3 px-2">
            <p className="font-semibold text-sm md:text-base text-gray-700">
              {title}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <SeatIcon
                  className="w-4 h-4 text-slate-600"
                  fill="currentColor"
                />
                <span>Libre</span>
              </div>
              <div className="flex items-center gap-1">
                <SeatIcon
                  className="w-4 h-4 text-gray-300"
                  fill="currentColor"
                />
                <span>Ocupado</span>
              </div>
            </div>
          </div>

          {/* 🟩 FUSELAJE: Bordes redondeados grandes y paddings laterales */}
          <div className="bg-[#050816] relative rounded-[3rem] border-x-4 border-slate-300 px-6 py-12 shadow-2xl text-white overflow-hidden">
            {/* Detalles decorativos del avión (Cabina) */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-2 bg-gray-700 rounded-b-xl opacity-50"></div>

            {/* Filas */}
            <div className="space-y-1">
              {rows.map(([rowNumber, rowSeats]) => {
                const rowHasExit = rowSeats.some((s) => isExitRow(s));

                const formatted = rowSeats
                  .map((s) => ({ seat: s, ...parseSeatNumber(s) }))
                  .sort((a, b) => a.col.localeCompare(b.col));

                const leftSeats = formatted.filter((x) => x.col < "D");
                const rightSeats = formatted.filter((x) => x.col >= "D");

                return (
                  <div
                    key={rowNumber}
                    className={`relative py-1 px-2 rounded-lg transition-colors ${
                      rowHasExit ? "bg-red-900/20 my-4" : "hover:bg-white/5"
                    }`}
                  >
                    {rowHasExit && (
                      <div className="absolute -top-3 inset-x-0 text-center text-[9px] text-red-400 flex items-center justify-center gap-1 uppercase tracking-wider font-bold">
                        <AlertTriangle className="w-3 h-3" />
                        Salida de Emergencia
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-4 md:gap-8">
                      {/* Lado Izquierdo */}
                      <div className="flex gap-1 md:gap-2">
                        {leftSeats.map((x) => renderSeatButton(x.seat, leg))}
                      </div>

                      {/* Pasillo con numero de fila */}
                      <div className="w-6 md:w-8 flex flex-col items-center justify-center">
                        <span className="text-[10px] md:text-xs text-gray-500 font-mono">
                          {rowNumber}
                        </span>
                      </div>

                      {/* Lado Derecho */}
                      <div className="flex gap-1 md:gap-2">
                        {rightSeats.map((x) => renderSeatButton(x.seat, leg))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="bg-white rounded-2xl shadow-md p-5 md:p-6">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-sm md:text-base font-semibold text-gray-800">
            {flightLabel}
          </h3>
          <span className="text-xs md:text-sm text-gray-500">
            {pasajeros} Pasajero(s)
          </span>
        </div>

        {renderCabin("Business", cabins.Business)}
        {renderCabin("Premium Economy", cabins["Premium Economy"])}
        {renderCabin("Premium", cabins.Premium)}
        {renderCabin("Economy", cabins.Economy)}
        {renderCabin("First", cabins.First)}
      </div>
    );
  };

  // ================================
  // UI Principal
  // ================================
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
              {originLabelIda} ↔ {destLabelIda}
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
              Desde USD{" "}
              {vueloIda?.Price ? Number(vueloIda.Price).toFixed(2) : "0.00"}
            </span>
          </div>
        </div>
      </header>

      {/* 🟩 BARRA DE PROGRESO — fija debajo del navbar */}
      <div className="fixed top-[60px] left-0 right-0 h-1.5 bg-gray-200 z-40 hidden md:block">
        <div className="bg-[#00b050] h-1.5 w-4/5 rounded-r-full"></div>
      </div>

      {/* 🟩 ESPACIADOR para que el contenido no se esconda detrás del navbar */}
      <div className="pt-[90px] md:pt-[40px]"></div>

      {/* CONTENIDO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 p-4 md:p-8 pt-6 md:pt-10">
        {/* 👉 IZQUIERDA (MODIFICADO: Sticky para evitar espacio en blanco) */}
        <div className="h-fit lg:sticky lg:top-24">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
            Selecciona tus asientos
          </h2>

          <div className="bg-white rounded-2xl shadow-md p-5 md:p-6 mb-5 md:mb-8">
            <div className="flex justify-between items-center text-xs md:text-sm font-semibold border-b pb-3 mb-3">
              <span className="text-green-700">
                {originLabelIda} - {destLabelIda}
              </span>
              {vueloVuelta && (
                <span className="text-gray-500">
                  {originLabelVuelta} - {destLabelVuelta}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {Array.from({ length: pasajeros }).map((_, idx) => {
                const { ida, vuelta } = buildPassengerInfo(idx);
                const label = `Pasajero ${idx + 1}`;

                return (
                  <div
                    key={idx}
                    className="border border-green-500 rounded-xl p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors hover:bg-green-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-900 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold text-xs md:text-sm shadow-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-sm md:text-base">
                          {label}
                        </p>
                        <p className="text-[11px] md:text-xs text-gray-500">
                          {tipo === "ida_vuelta"
                            ? `Ida: ${ida} · Vuelta: ${vuelta}`
                            : `Ida: ${ida}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] md:text-xs text-gray-500 md:text-right">
                      <p>Haz clic en el mapa para asignar.</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-xs md:text-sm text-gray-600 space-y-2 bg-blue-50 p-4 rounded-xl">
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-600 rounded-full"></span>{" "}
              Selecciona un asiento disponible para cada pasajero.
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>{" "}
              Asientos Business tienen costo adicional.
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>{" "}
              Asientos Premium tienen más espacio.
            </p>
          </div>
          {/* 🟩 Sección extra de información — para rellenar la izquierda */}
          <div className="bg-white mt-5 rounded-2xl shadow-md p-5 md:p-6 space-y-8">
            {/* ✨ Beneficios Business */}
            <div>
              <h3 className="text-sm md:text-base font-semibold mb-2 flex items-center gap-2">
                🥂 Beneficios de Asientos Business
              </h3>
              <ul className="text-xs md:text-sm text-gray-600 space-y-1 list-disc ml-4">
                <li>Asientos reclinables tipo cama (*según aeronave*)</li>
                <li>
                  Acceso exclusivo al <strong>SkyAndes Lounge Bar</strong>
                </li>
                <li>Comidas premium de cortesía</li>
                <li>Pantallas táctiles con más de 300 películas</li>
                <li>Servicio prioritario de check-in y embarque</li>
                <li>Espacio adicional para equipaje de mano</li>
              </ul>
            </div>

            {/* 💺 Beneficios Premium */}
            <div>
              <h3 className="text-sm md:text-base font-semibold mb-2 flex items-center gap-2">
                🌟 Beneficios de Asientos Premium Economy
              </h3>
              <ul className="text-xs md:text-sm text-gray-600 space-y-1 list-disc ml-4">
                <li>Mayor espacio para piernas (hasta +15 cm)</li>
                <li>Asientos con reclinación mejorada</li>
                <li>Entretenimiento en pantallas HD individuales</li>
                <li>Snacks y bebidas incluidos</li>
                <li>Zona más silenciosa del avión</li>
                <li>Atención preferencial del personal</li>
              </ul>
            </div>

            {/* 🚨 Reglas de salida de emergencia */}
            <div>
              <h3 className="text-sm md:text-base font-semibold mb-2 flex items-center gap-2">
                ⚠️ Reglas de Salida de Emergencia
              </h3>
              <ul className="text-xs md:text-sm text-gray-600 space-y-1 list-disc ml-4">
                <li>Debes tener mínimo 15 años</li>
                <li>No presentar limitaciones de movilidad</li>
                <li>Debes poder asistir al personal durante una emergencia</li>
                <li>No se permite equipaje debajo del asiento</li>
                <li>
                  El personal puede reasignarte si no cumples los requisitos
                </li>
              </ul>
            </div>

            {/* 📘 Indicaciones generales */}
            <div>
              <h3 className="text-sm md:text-base font-semibold mb-2 flex items-center gap-2">
                💺 Indicaciones Generales
              </h3>
              <ul className="text-xs md:text-sm text-gray-600 space-y-2 list-disc ml-4">
                <li>Haz clic en un asiento disponible para asignarlo.</li>
                <li>
                  Los asientos ocupados o bloqueados no se pueden seleccionar.
                </li>
                <li>
                  <strong className="text-green-600">
                    Dispones de 10 minutos
                  </strong>{" "}
                  para completar tu pago tras seleccionar los asientos.
                </li>
                <li>
                  Si el tiempo expira, los asientos se liberarán
                  automáticamente.
                </li>
                <li>
                  Puedes reubicarte en otro asiento mientras esté disponible.
                </li>
                <li>
                  Si viajas con acompañantes, intenta asignar asientos
                  contiguos.
                </li>
              </ul>
            </div>

            {/* 🛫 Servicios a bordo */}
            <div>
              <h3 className="text-sm md:text-base font-semibold mb-2 flex items-center gap-2">
                🍽️ Servicios a Bordo SkyAndes
              </h3>
              <ul className="text-xs md:text-sm text-gray-600 space-y-1 list-disc ml-4">
                <li>Bebidas calientes y frías incluidas</li>
                <li>Snack SkyAndes especial del día</li>
                <li>Pantallas de entretenimiento con contenido actualizado</li>
                <li>Opciones vegetarianas, veganas y sin gluten</li>
                <li>WiFi satelital disponible en rutas seleccionadas</li>
                <li>Atención amable y personalizada durante todo el vuelo</li>
              </ul>
            </div>

            {/* 💙 Experiencia SkyAndes */}
            <div>
              <h3 className="text-sm md:text-base font-semibold mb-2 flex items-center gap-2">
                ✈️ Experiencia SkyAndes
              </h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                En <strong>SkyAndes</strong> trabajamos para ofrecerte una
                experiencia única. Desde procesos rápidos en aeropuerto hasta un
                servicio cálido y cercano, cada detalle está diseñado para que
                disfrutes tu viaje.
              </p>
              <p className="text-xs md:text-sm text-gray-600 mt-2">
                La comodidad, seguridad y satisfacción de nuestros pasajeros es
                nuestra mayor prioridad. 💙
              </p>
            </div>

            {/* 🛡️ Medidas de seguridad y salud */}
            <div>
              <h3 className="text-sm md:text-base font-semibold mb-2 flex items-center gap-2">
                🛡️ Medidas de Seguridad y Salud
              </h3>
              <ul className="text-xs md:text-sm text-gray-600 space-y-1 list-disc ml-4">
                <li>Cabinas desinfectadas antes de cada vuelo</li>
                <li>
                  Sistemas de filtración HEPA que renuevan el aire cada 3
                  minutos
                </li>
                <li>Tripulación entrenada en primeros auxilios</li>
                <li>Protocolos estrictos de seguridad operacional</li>
                <li>Botiquín médico disponible en todas las aeronaves</li>
              </ul>
            </div>

            {/* 🎨 Leyenda de Asientos */}
            <div>
              <h3 className="text-sm md:text-base font-semibold mb-2 flex items-center gap-2">
                Leyenda de Asientos
              </h3>

              <div className="flex flex-col gap-2 text-xs md:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-indigo-600 rounded-sm"></span>
                  Asiento Business
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-amber-500 rounded-sm"></span>
                  Asiento Premium
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-600 rounded-sm"></span>
                  Estándar disponible
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-gray-300 rounded-sm"></span>
                  Ocupado / Bloqueado
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-red-600 rounded-sm"></span>
                  Fila de emergencia
                </div>
              </div>
            </div>
            {/* 🧳 Política de Equipaje SkyAndes */}
            <div>
              <h3 className="text-sm md:text-base font-semibold mb-2 flex items-center gap-2">
                🧳 Política de Equipaje SkyAndes
              </h3>

              <ul className="text-xs md:text-sm text-gray-600 space-y-1 list-disc ml-4">
                <li>
                  <strong>Equipaje de mano:</strong> 1 pieza de hasta 10 kg
                  incluida en todas las tarifas.
                </li>
                <li>
                  <strong>Equipaje facturado:</strong> Disponible según tu
                  tarifa o con costo adicional.
                </li>
                <li>
                  Líquidos en envases de hasta 100 ml dentro de una bolsa
                  transparente.
                </li>
                <li>
                  Artículos peligrosos (inflamables, explosivos, químicos) están
                  prohibidos.
                </li>
                <li>
                  Equipaje extra o con sobrepeso puede tener tarifas
                  adicionales.
                </li>
                <li>Revisa siempre tu tarifa antes de continuar al pago.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 👉 DERECHA */}
        <div className="space-y-4 md:space-y-6">
          {vueloVuelta && (
            <div className="flex justify-center mb-1 sticky top-20 z-30 py-2">
              <div className="inline-flex bg-white/90 backdrop-blur-md rounded-full shadow-lg p-1 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveLeg("ida")}
                  className={`px-4 py-1 text-xs md:text-sm rounded-full transition-all ${
                    activeLeg === "ida"
                      ? "bg-black text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Vuelo de ida
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLeg("vuelta")}
                  className={`px-4 py-1 text-xs md:text-sm rounded-full transition-all ${
                    activeLeg === "vuelta"
                      ? "bg-black text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Vuelo de regreso
                </button>
              </div>
            </div>
          )}

          {errorSeats && (
            <p className="text-center text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
              {errorSeats}
            </p>
          )}

          {activeLeg === "ida" && renderPlane("ida")}
          {vueloVuelta && activeLeg === "vuelta" && renderPlane("vuelta")}
        </div>
      </div>

      {/* FOOTER */}
      <div className="sticky bottom-0 z-50 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 px-4 md:px-8 py-4 bg-white/95 backdrop-blur-lg border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => navigate("/pasajeros")}
          className="border border-gray-700 text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition text-sm"
        >
          Atrás
        </button>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="text-right hidden md:block">
            <p className="text-xs md:text-sm text-gray-500">
              Precio total asientos:
            </p>
            <p className="text-lg md:text-xl font-bold text-green-600">
              USD {calcularTotal.toFixed(2)}
            </p>
          </div>

          {/* Mostrar precio en movil al lado del boton */}
          <div className="md:hidden text-right mr-2">
            <span className="font-bold text-green-600 block">
              USD {calcularTotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleSiguiente}
            className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1a1a1a] transition shadow-lg text-sm md:text-base transform hover:scale-105 active:scale-95"
          >
            Continuar
          </button>
        </div>
      </div>

      <footer className="text-center text-[10px] md:text-xs text-gray-500 pb-4 pt-4">
        Copyright © SkyAndes 2025
      </footer>
    </div>
  );
}
