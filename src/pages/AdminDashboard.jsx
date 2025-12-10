// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Users,
  Plane,
  Receipt,
  CreditCard,
  Ticket,
  BarChart2,
} from "lucide-react";

import SidebarAdmin from "../components/SidebarAdmin";
import HeaderAdmin from "../components/HeaderAdmin";

// ============================================================
// COMPONENTE DE FONDO DE GALAXIA (SVG CANVAS)
// Reutilizado del componente anterior
// ============================================================
const GalaxyBackground = () => (
  <>
    {/* Reglas CSS para la animación de las estrellas */}
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
      style={{
        backgroundColor: "#0A0A1F", // Fondo azul muy oscuro / casi negro
      }}
    >
      {/* Estrellas con animación de twinkle aplicada */}
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
      <circle
        className="star"
        cx="15%"
        cy="15%"
        r="0.4"
        fill="#fff"
        opacity="0.2"
        style={{ animationDelay: "4s" }}
      />
      <circle
        className="star"
        cx="60%"
        cy="40%"
        r="1.3"
        fill="#fff"
        style={{ animationDelay: "4.5s" }}
      />
      <circle
        className="star"
        cx="25%"
        cy="50%"
        r="0.8"
        fill="#fff"
        style={{ animationDelay: "5s" }}
      />
      <circle
        className="star"
        cx="75%"
        cy="30%"
        r="0.5"
        fill="#fff"
        style={{ animationDelay: "5.5s" }}
      />

      {/* Nebulosa sutil - Filtro de desenfoque aplicado a formas grandes */}
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
          fill="#3F37C9" // Morado
          opacity="0.1"
        />
        <ellipse
          cx="0%"
          cy="100%"
          rx="150"
          ry="80"
          fill="#4CC9F0" // Cian
          opacity="0.08"
        />
        <circle cx="50%" cy="50%" r="50" fill="#F72585" opacity="0.05" />{" "}
        {/* Rosa */}
      </g>
    </svg>
  </>
);

// ============================================================
// COMPONENTE TARJETA DE ESTADÍSTICA
// Diseñado con el estilo Galaxia/Glow
// ============================================================
const StatCard = ({ icon, label, value, color, link }) => {
  // Define un color de sombra sutil basado en el color principal
  const shadowColor = color.replace(")", ", 0.4)");

  return (
    <a
      href={link}
      className="
        bg-white/10 backdrop-blur-sm rounded-3xl p-6 transition-all duration-300
        border border-gray-700/50 
        flex flex-col items-center text-center relative overflow-hidden
        hover:bg-white/15 hover:shadow-xl hover:scale-[1.02]
        hover:border-indigo-500/50
        shadow-[0_0_10px_rgba(0,0,0,0.2)] 
      "
      style={{
        // Agrega un sutil glow de borde al pasar el ratón usando el before
        "--card-color": color,
      }}
    >
      {/* GLOW EFFECT ON HOVER */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: `0 0 40px ${color}`,
          zIndex: 0,
          borderRadius: "1.5rem",
          pointerEvents: "none",
        }}
      ></div>

      <div
        className="p-4 rounded-full mb-4 text-white relative z-10 shadow-lg"
        style={{ backgroundColor: color, boxShadow: `0 0 15px ${shadowColor}` }}
      >
        {icon}
      </div>

      <h3 className="text-4xl font-extrabold text-white relative z-10 transition-colors duration-300">
        {value}
      </h3>
      <p className="text-indigo-300 font-medium mt-1 relative z-10 uppercase tracking-widest text-sm">
        {label}
      </p>

      <div className="mt-6 w-full relative z-10">
        <button
          className="
            w-full px-4 py-2 rounded-xl text-sm font-bold 
            bg-indigo-600 text-white hover:bg-indigo-700 
            transition-all duration-300 shadow-lg 
            shadow-indigo-500/50 hover:shadow-indigo-500/70
            transform hover:-translate-y-0.5
          "
        >
          Gestionar
        </button>
      </div>
    </a>
  );
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Simulación de carga de datos
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    usuarios: 0,
    vuelos: 0,
    reservas: 0,
    pagos: 0,
    tickets: 0,
  });

  const [ingresosTotales, setIngresosTotales] = useState(0);

  useEffect(() => {
    // Simular la carga de datos con un delay
    setLoading(true);
    setTimeout(() => {
      setStats({
        usuarios: 124,
        vuelos: 32,
        reservas: 580,
        pagos: 550,
        tickets: 580,
      });
      setIngresosTotales(45800.75);
      setLoading(false);
    }, 1500); // 1.5 segundos de carga
  }, []);

  // Paleta Galaxia: Verde, Cian, Naranja, Púrpura, Amarillo
  const cards = [
    {
      icon: <Users size={26} />,
      label: "Usuarios",
      value: loading ? "..." : stats.usuarios.toLocaleString(),
      color: "#00b050", // Verde vibrante
      link: "/admin/usuarios",
    },
    {
      icon: <Plane size={26} />,
      label: "Vuelos",
      value: loading ? "..." : stats.vuelos.toLocaleString(),
      color: "#4CC9F0", // Cian brillante
      link: "/admin/vuelos",
    },
    {
      icon: <Receipt size={26} />,
      label: "Reservas",
      value: loading ? "..." : stats.reservas.toLocaleString(),
      color: "#ff6b00", // Naranja
      link: "/admin/reservas",
    },
    {
      icon: <CreditCard size={26} />,
      label: "Pagos",
      value: loading ? "..." : stats.pagos.toLocaleString(),
      color: "#8b5cf6", // Púrpura (Indigo de Tailwind)
      link: "/admin/pagos",
    },
    {
      icon: <Ticket size={26} />,
      label: "Tickets",
      value: loading ? "..." : stats.tickets.toLocaleString(),
      color: "#eab308", // Amarillo/Oro
      link: "/admin/tickets",
    },
    {
      icon: <BarChart2 size={26} />,
      label: "Ingresos Totales",
      value: loading
        ? "Cargando..."
        : `$${ingresosTotales.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
          })}`,
      color: "#F72585", // Rosa Neón
      link: "/admin/ingresos",
    },
  ];

  return (
    <div className="flex font-sans">
      <GalaxyBackground />

      {/* SIDEBAR */}
      <SidebarAdmin open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* CONTENIDO */}
      <main className="flex-1 md:ml-64 p-8 min-h-screen relative z-10">
        <HeaderAdmin onToggleSidebar={() => setSidebarOpen(true)} />

        {/* TÍTULO */}
        <h1 className="text-2xl font-extrabold text-white mb-10 mt-4 tracking-tight">
          <span className="text-indigo-400">Panel de Control</span>
        </h1>

        {/* MENSAJE DE BIENVENIDA MÁS MODERNO */}
        <div className="bg-indigo-600/30 backdrop-blur-sm p-5 rounded-2xl mb-8 border border-indigo-500/50 shadow-xl">
          <p className="text-xl font-semibold text-white">
            ¡Bienvenido/a SkyAndes!
          </p>
          <p className="text-indigo-200 text-sm mt-1">
            Monitorea y gestiona todos los sistemas clave de tu aerolínea.
          </p>
        </div>

        {/* CARDS ESTADÍSTICAS */}
        <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <StatCard key={i} {...c} />
          ))}
        </div>

        <footer className="mt-12 text-center text-indigo-400/50 text-sm">
          © SkyAndes Airlines 2025 — Panel Administrativo
        </footer>
      </main>
    </div>
  );
}
