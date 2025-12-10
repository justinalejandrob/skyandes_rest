import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

// Importación de imágenes locales
import destinoQuito from "../images/destinoQuito.png";
import destinoGuayaquil from "../images/destinoGuayaquil.png";
import destinoCuenca from "../images/destinoCuenca.png";
import destinoMiami from "../images/destinoMiami.png";
import destinoFrancia from "../images/destinoFrancia.png";

export default function OfertasDesde() {
  const [origen, setOrigen] = useState("Quito");
  const [open, setOpen] = useState(false);

  const ciudades = ["Quito", "Guayaquil", "Cuenca", "Miami", "Paris"];

  // ✅ Imágenes locales según tu carpeta src/images
  const ofertas = {
    Quito: [
      {
        ciudad: "Guayaquil",
        precio: 55,
        img: destinoGuayaquil,
      },
      {
        ciudad: "Cuenca",
        precio: 58,
        img: destinoCuenca,
      },
      {
        ciudad: "Miami",
        precio: 320,
        img: destinoMiami,
      },
    ],
    Guayaquil: [
      {
        ciudad: "Quito",
        precio: 50,
        img: destinoQuito,
      },
      {
        ciudad: "Cuenca",
        precio: 54,
        img: destinoCuenca,
      },
      {
        ciudad: "Paris",
        precio: 870,
        img: destinoFrancia,
      },
    ],
    Cuenca: [
      {
        ciudad: "Quito",
        precio: 56,
        img: destinoQuito,
      },
      {
        ciudad: "Guayaquil",
        precio: 60,
        img: destinoGuayaquil,
      },
      {
        ciudad: "Miami",
        precio: 310,
        img: destinoMiami,
      },
    ],
    Miami: [
      {
        ciudad: "Quito",
        precio: 580,
        img: destinoQuito,
      },
      {
        ciudad: "Paris",
        precio: 720,
        img: destinoFrancia,
      },
      {
        ciudad: "Guayaquil",
        precio: 540,
        img: destinoGuayaquil,
      },
    ],
    Paris: [
      {
        ciudad: "Quito",
        precio: 900,
        img: destinoQuito,
      },
      {
        ciudad: "Guayaquil",
        precio: 920,
        img: destinoGuayaquil,
      },
      {
        ciudad: "Cuenca",
        precio: 870,
        img: destinoCuenca,
      },
    ],
  };

  return (
    <section className="py-20 bg-black text-white">
      <div className="w-[90%] mx-auto max-w-6xl text-center">
        {/* Título */}
        <h2 className="text-3xl font-bold mb-8">
          Ofertas desde{" "}
          <span
            onClick={() => setOpen(!open)}
            className="text-[#ff6b00] cursor-pointer hover:text-[#e55f00] relative inline-flex items-center"
          >
            {origen}
            {open ? (
              <ChevronUp className="ml-1 w-5 h-5 text-[#ff6b00]" />
            ) : (
              <ChevronDown className="ml-1 w-5 h-5 text-[#ff6b00]" />
            )}
          </span>
          {/* Dropdown ciudades */}
          {open && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-3 bg-[#111] border border-gray-800 rounded-xl shadow-xl p-3 w-56 z-50 text-left">
              {ciudades.map((ciudad) => (
                <div
                  key={ciudad}
                  onClick={() => {
                    setOrigen(ciudad);
                    setOpen(false);
                  }}
                  className="px-3 py-2 text-gray-300 hover:bg-[#ff6b00] hover:text-white rounded-lg cursor-pointer transition"
                >
                  {ciudad}
                </div>
              ))}
            </div>
          )}
        </h2>

        {/* Animación de las tarjetas */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.2 }}
          variants={{
            visible: { transition: { staggerChildren: 0.25 } },
          }}
        >
          {ofertas[origen]?.map((oferta, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="rounded-2xl overflow-hidden shadow-md hover:shadow-[#ff6b00]/50 transition bg-[#111]"
            >
              <div className="relative">
                <img
                  src={oferta.img}
                  alt={oferta.ciudad}
                  className="w-full h-56 object-cover brightness-90 hover:brightness-100 transition-all duration-300"
                />
              </div>

              <div className="p-5 text-left">
                <h3 className="text-lg font-bold text-white mb-1">
                  {oferta.ciudad}
                </h3>
                <p className="text-gray-400 text-sm mb-3">Por trayecto desde</p>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">
                    Acumula millas
                  </span>
                  <span className="text-lg font-bold text-[#ff6b00]">
                    USD {oferta.precio}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
