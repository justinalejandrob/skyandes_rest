// src/components/SidebarAdmin.jsx
import {
  Users,
  Plane,
  Receipt,
  CreditCard,
  Ticket,
  LayoutDashboard,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function SidebarAdmin({ open, onClose }) {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { label: "Usuarios", icon: <Users size={20} />, path: "/admin/usuarios" },
    { label: "Vuelos", icon: <Plane size={20} />, path: "/admin/vuelos" },
    { label: "Reservas", icon: <Receipt size={20} />, path: "/admin/reservas" },
    { label: "Pagos", icon: <CreditCard size={20} />, path: "/admin/pagos" },
    { label: "Tickets", icon: <Ticket size={20} />, path: "/admin/tickets" },
  ];

  return (
    <>
      {/* Fondo oscuro SOLO en móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-40"
          onClick={onClose}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-black text-white shadow-xl z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header móvil con botón cerrar */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={onClose}>
            <X size={26} className="text-white" />
          </button>
        </div>

        {/* LOGO */}
        <div className="flex flex-col items-center py-6 border-b border-gray-800">
          <img src="/images/logoSkyAndes.png" className="h-16 mb-2" />
        </div>

        {/* MENU */}
        <nav className="mt-4 flex-1">
          {menuItems.map((item, i) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={i}
                to={item.path}
                onClick={onClose} // cerrar menú en móvil
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition
                  ${
                    active
                      ? "bg-[#00b050] text-black rounded-r-full"
                      : "hover:bg-gray-900"
                  }
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-800">
          © SkyAndes 2025
        </footer>
      </aside>
    </>
  );
}
