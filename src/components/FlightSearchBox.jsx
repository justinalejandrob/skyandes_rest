import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  PlaneTakeoff,
  PlaneLanding,
  Search,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";

export default function FlightSearchBox() {
  const [tripType, setTripType] = useState("roundtrip");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  const destinos = [
    { ciudad: "Quito", pais: "Ecuador", codigo: "UIO" },
    { ciudad: "Guayaquil", pais: "Ecuador", codigo: "GYE" },
    { ciudad: "Cuenca", pais: "Ecuador", codigo: "CUE" },
    { ciudad: "Miami", pais: "Estados Unidos", codigo: "MIA" },
    { ciudad: "París", pais: "Francia", codigo: "CDG" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    if (!origin || !destination || !departureDate) {
      alert("Por favor, completa todos los campos requeridos ✈️");
      return;
    }

    // Formato para backend (OBLIGATORIO)
    const fecha = departureDate.toISOString().split("T")[0];

    // Formatos para UI
    const fechaIda = fecha;
    const fechaVuelta = returnDate
      ? returnDate.toISOString().split("T")[0]
      : "";

    const params = new URLSearchParams({
      origen: origin.ciudad,
      destino: destination.ciudad,
      fecha, // <- ESTE ES EL QUE NECESITA TU API
      fechaIda, // <- PARA MOSTRAR EN SELECCION-VUELO
      fechaVuelta, // <- SOLO SI ES ROUNDTRIP
      passengers,
      tipo: tripType === "roundtrip" ? "ida_vuelta" : "solo_ida",
    });

    navigate(`/seleccion-vuelo?${params.toString()}`);
  };

  return (
    <div className="bg-[#0a0a0a] text-white rounded-2xl shadow-2xl p-6 mx-auto w-[90%] max-w-6xl -mt-20 relative z-40 border border-gray-700 backdrop-blur-md">
      {/* Tipo de vuelo */}
      <div className="flex items-center gap-6 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="roundtrip"
            checked={tripType === "roundtrip"}
            onChange={() => setTripType("roundtrip")}
            className="accent-[#ff6b00]"
          />
          <span>Ida y vuelta</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="oneway"
            checked={tripType === "oneway"}
            onChange={() => setTripType("oneway")}
            className="accent-[#ff6b00]"
          />
          <span>Solo ida</span>
        </label>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-[#111] p-5 rounded-xl relative"
      >
        {/* ORIGEN */}
        <div className="relative col-span-2">
          <label className="text-xs text-gray-400 flex items-center gap-2 mb-1">
            <PlaneTakeoff className="w-4 h-4 text-[#ff6b00]" /> Origen
          </label>
          <div
            onClick={() =>
              setActiveDropdown(activeDropdown === "origin" ? null : "origin")
            }
            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-sm cursor-pointer hover:border-[#ff6b00] transition"
          >
            {origin ? `${origin.ciudad} (${origin.pais})` : "Selecciona origen"}
          </div>

          <AnimatePresence>
            {activeDropdown === "origin" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 top-20 bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 w-full z-50 shadow-lg"
              >
                {destinos.map((d) => (
                  <div
                    key={d.codigo}
                    onClick={() => {
                      setOrigin(d);
                      setActiveDropdown(null);
                      if (destination?.codigo === d.codigo) setDestination("");
                    }}
                    className={`px-3 py-2 rounded-lg hover:bg-[#ff6b00] hover:text-white cursor-pointer transition ${
                      destination?.codigo === d.codigo
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {d.ciudad} ({d.pais})
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* DESTINO */}
        <div className="relative col-span-2">
          <label className="text-xs text-gray-400 flex items-center gap-2 mb-1">
            <PlaneLanding className="w-4 h-4 text-[#ff6b00]" /> Destino
          </label>
          <div
            onClick={() =>
              setActiveDropdown(
                activeDropdown === "destination" ? null : "destination"
              )
            }
            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-sm cursor-pointer hover:border-[#ff6b00] transition"
          >
            {destination
              ? `${destination.ciudad} (${destination.pais})`
              : "Selecciona destino"}
          </div>

          <AnimatePresence>
            {activeDropdown === "destination" && origin && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 top-20 bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 w-full z-50 shadow-lg"
              >
                {destinos
                  .filter((d) => d.codigo !== origin?.codigo)
                  .map((d) => (
                    <div
                      key={d.codigo}
                      onClick={() => {
                        setDestination(d);
                        setActiveDropdown(null);
                      }}
                      className="px-3 py-2 rounded-lg hover:bg-[#ff6b00] hover:text-white cursor-pointer transition"
                    >
                      {d.ciudad} ({d.pais})
                    </div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FECHAS */}
        <div>
          <label className="text-xs text-gray-400 flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-[#ff6b00]" /> Ida
          </label>
          <DatePicker
            selected={departureDate}
            onChange={(date) => setDepartureDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona fecha de ida"
            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-sm text-white"
            minDate={new Date()}
          />
        </div>

        {tripType === "roundtrip" && (
          <div>
            <label className="text-xs text-gray-400 flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-[#ff6b00]" /> Vuelta
            </label>
            <DatePicker
              selected={returnDate}
              onChange={(date) => setReturnDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecciona fecha de regreso"
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-sm text-white"
              minDate={new Date()}
            />
          </div>
        )}

        {/* PASAJEROS */}
        <div>
          <label className="text-xs text-gray-400 flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-[#ff6b00]" /> Pasajeros
          </label>
          <input
            type="number"
            min="1"
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-sm"
          />
        </div>

        {/* BOTÓN */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-[#ff6b00] hover:bg-[#e55f00] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Search className="w-5 h-5" /> Buscar vuelos
          </button>
        </div>
      </form>
    </div>
  );
}
