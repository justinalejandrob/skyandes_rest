// src/components/HeaderAdmin.jsx
import React from "react";
import { Bell, LogOut, Menu } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { logout } from "../utils/logout";

export default function HeaderAdmin({ onToggleSidebar }) {
  const { user } = useAuth();

  return (
    <header
      className="
        w-full 
        bg-[#0e0e0e]
        text-white 
        flex 
        items-center 
        justify-between 
        px-6 
        py-4 
        shadow-lg 
        border border-gray-800 
        sticky top-0 z-40 
        rounded-xl
        mx-3 mt-3
      "
    >
      {/* ----- MENU HAMBURGUESA (solo móvil) ----- */}
      <button
        onClick={onToggleSidebar}
        className="md:hidden bg-[#1a1a1a] p-2 rounded-lg hover:bg-[#222] transition"
      >
        <Menu size={24} />
      </button>

      {/* TÍTULO */}
      <h1 className="text-base font-medium tracking-wide hidden md:block">
        Dashboard
      </h1>

      {/* ----- ICONOS DERECHA ----- */}
      <div className="flex items-center gap-4">
        {/* Notificaciones */}
        <button className="relative hover:text-[#00b050] transition">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 bg-[#00b050] text-black text-[10px] font-bold rounded-full px-1">
            3
          </span>
        </button>

        {/* Logout (solo icono en móvil) */}
        <button
          onClick={logout}
          className="
            bg-red-600 hover:bg-red-700 
            px-4 py-2 rounded-full 
            text-sm font-medium transition 
            flex items-center gap-2
          "
        >
          <LogOut size={18} />
          <span className="hidden md:block">Salir</span>
        </button>
      </div>
    </header>
  );
}
