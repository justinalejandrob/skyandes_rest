import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { logout } from "../utils/logout";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // ⭐ Scroll suave hacia una sección
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // ⭐ Si está loggeado → scroll. Si no → login
  const handleProtectedNavigation = (id) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    scrollToSection(id);
  };

  return (
    <nav className="bg-[#000000] text-white px-6 py-4 shadow-md rounded-2xl mx-4 mt-4 flex items-center justify-between">
      {/* LOGO */}
      <div className="flex items-center space-x-3">
        <img
          src="/images/logoSkyAndes.png"
          alt="SkyAndes Logo"
          className="h-10"
        />
      </div>

      {/* 🟧 NAV DESKTOP */}
      <div className="hidden md:flex items-center space-x-8 font-semibold">
        <Link to="/dashboard" className="hover:text-gray-300">
          Inicio
        </Link>

        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center hover:text-gray-300 transition"
          >
            Opciones <ChevronDown className="ml-1 h-4 w-4" />
          </button>

          {openDropdown && (
            <div
              className="absolute left-0 mt-2 w-52 bg-[#111111] text-sm rounded-lg shadow-lg border border-gray-700 z-50"
              onMouseLeave={() => setOpenDropdown(false)}
            >
              <ul className="py-2">
                {/* ⭐ RESERVAR VUELO */}
                <li>
                  <button
                    onClick={() =>
                      handleProtectedNavigation("flight-search-box")
                    }
                    className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition"
                  >
                    Reservar vuelo
                  </button>
                </li>

                {/* ⭐ DESTINOS */}
                <li>
                  <button
                    onClick={() => handleProtectedNavigation("ofertas-desde")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-800 transition"
                  >
                    Destinos
                  </button>
                </li>

                {/* 🟩 ADMIN solo si es Admin */}
                {user?.Role === "Admin" && (
                  <li>
                    <Link
                      to="/admin"
                      className="block px-4 py-2 hover:bg-gray-800 transition text-[#00b050] font-semibold"
                    >
                      Administrar
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <a href="#" className="hover:text-gray-300">
          Centro de Ayuda
        </a>
      </div>

      {/* 🟧 DERECHA DESKTOP */}
      <div className="hidden md:flex items-center space-x-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
          alt="USA Flag"
          className="h-6 w-6 rounded-full"
        />
        <span className="text-sm font-semibold">USD . $</span>

        {!isAuthenticated ? (
          <Link
            to="/login"
            className="bg-gradient-to-b from-[#1a1a1a] to-[#111111] px-5 py-2 rounded-full text-white font-semibold hover:brightness-125 transition"
          >
            Iniciar Sesión
          </Link>
        ) : (
          <div className="flex items-center space-x-3">
            <span className="font-semibold">
              Hola, {user.FullName.split(" ")[0]}
            </span>

            <button
              onClick={logout}
              className="ml-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm font-medium transition"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* 🟧 MENÚ HAMBURGUESA (MOBILE) */}
      <button
        className="md:hidden text-white"
        onClick={() => setOpenMobile(!openMobile)}
      >
        {openMobile ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* 🟧 MOBILE MENU */}
      {openMobile && (
        <div className="absolute top-20 left-0 w-full bg-[#000000] text-white p-6 flex flex-col space-y-4 shadow-xl md:hidden transition">
          {/* Inicio */}
          <Link
            to="/dashboard"
            className="hover:text-gray-300 text-lg font-medium"
            onClick={() => setOpenMobile(false)}
          >
            Inicio
          </Link>

          {/* ⭐ Reservar vuelo MOBILE */}
          <button
            onClick={() => {
              setOpenMobile(false);
              handleProtectedNavigation("flight-search-box");
            }}
            className="text-left hover:text-gray-300 text-lg font-medium"
          >
            Reservar vuelo
          </button>

          {/* ⭐ Destinos MOBILE */}
          <button
            onClick={() => {
              setOpenMobile(false);
              handleProtectedNavigation("ofertas-desde");
            }}
            className="text-left hover:text-gray-300 text-lg font-medium"
          >
            Destinos
          </button>

          {/* Centro de ayuda */}
          <a href="#" className="hover:text-gray-300 text-lg font-medium">
            Centro de Ayuda
          </a>

          {/* ADMIN MOBILE */}
          {user?.Role === "Admin" && (
            <Link
              to="/admin"
              onClick={() => setOpenMobile(false)}
              className="hover:text-[#00b050] text-lg font-medium font-semibold"
            >
              Administrar
            </Link>
          )}

          <div className="border-t border-gray-700 my-3"></div>

          {/* Login / Logout */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="bg-[#1a1a1a] px-4 py-2 rounded-lg text-center"
            >
              Iniciar Sesión
            </Link>
          ) : (
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-center"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
