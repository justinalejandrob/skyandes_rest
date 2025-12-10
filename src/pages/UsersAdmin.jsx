import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import SidebarAdmin from "../components/SidebarAdmin";
import HeaderAdmin from "../components/HeaderAdmin";

// ============================================================
// COMPONENTE DE FONDO DE GALAXIA (SVG CANVAS)
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

      {/* Más estrellas pequeñas y sutiles sin animación */}
      <circle cx="5%" cy="5%" r="0.3" fill="#fff" opacity="0.3" />
      <circle cx="95%" cy="95%" r="0.4" fill="#fff" opacity="0.3" />
      <circle cx="5%" cy="95%" r="0.2" fill="#fff" opacity="0.2" />
      <circle cx="95%" cy="5%" r="0.3" fill="#fff" opacity="0.4" />
      <circle cx="50%" cy="60%" r="0.5" fill="#fff" opacity="0.6" />

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
  "https://skyandesairlines-ws.runasp.net/SkyAndes_SOAP/WS_User.asmx";
const NS = "http://skyandes.com/ws/users";

export default function UsersAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(true);

  // BUSCADOR
  const [search, setSearch] = useState("");

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 7;

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentUsers = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / perPage);

  // MODALES
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    FullName: "",
    Email: "",
    Role: "Customer",
    Status: "ACTIVE",
    PasswordHash: "123456",
  });

  const [editUser, setEditUser] = useState(null);

  // ============================================================
  // LISTAR USUARIOS
  // ============================================================
  async function listarUsuarios() {
    const envelope = `
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:u="${NS}">
      <soap:Body>
        <u:Listar />
      </soap:Body>
    </soap:Envelope>`;

    const resp = await fetch(SOAP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: `"${NS}/Listar"`,
      },
      body: envelope,
    });

    const raw = await resp.text();
    const xml = new window.DOMParser().parseFromString(raw, "text/xml");
    const nodes = [...xml.getElementsByTagName("DTOUser")];

    const lista = nodes.map((n) => ({
      UserId: n.getElementsByTagName("UserId")[0]?.textContent,
      FullName: n.getElementsByTagName("FullName")[0]?.textContent,
      Email: n.getElementsByTagName("Email")[0]?.textContent,
      Role: n.getElementsByTagName("Role")[0]?.textContent,
      Status: n.getElementsByTagName("Status")[0]?.textContent,
      CreatedAt: n.getElementsByTagName("CreatedAt")[0]?.textContent,
    }));

    setUsuarios(lista);
    setFiltered(lista);
    setLoading(false);
  }

  useEffect(() => {
    listarUsuarios();
  }, []);

  // ============================================================
  // BUSCAR
  // ============================================================
  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      usuarios.filter(
        (u) =>
          u.FullName.toLowerCase().includes(s) ||
          u.Email.toLowerCase().includes(s)
      )
    );
    setCurrentPage(1);
  }, [search, usuarios]);

  // ============================================================
  // ELIMINAR
  // ============================================================
  async function eliminarUsuario(id) {
    if (!confirm("¿Eliminar usuario?")) return;

    const envelope = `
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:u="${NS}">
      <soap:Body>
        <u:Eliminar><u:id>${id}</u:id></u:Eliminar>
      </soap:Body>
    </soap:Envelope>`;

    await fetch(SOAP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: `"${NS}/Eliminar"`,
      },
      body: envelope,
    });

    listarUsuarios();
  }

  // ============================================================
  // AGREGAR
  // ============================================================
  async function agregarUsuario() {
    if (!nuevoUsuario.FullName || !nuevoUsuario.Email) {
      alert("Completa todos los campos");
      return;
    }

    const envelope = `
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:u="${NS}">
      <soap:Body>
        <u:Agregar>
          <u:user>
            <u:UserId>0</u:UserId>
            <u:FullName>${nuevoUsuario.FullName}</u:FullName>
            <u:Email>${nuevoUsuario.Email}</u:Email>
            <u:Role>${nuevoUsuario.Role}</u:Role>
            <u:Status>${nuevoUsuario.Status}</u:Status>
            <u:PasswordHash>${nuevoUsuario.PasswordHash}</u:PasswordHash>
          </u:user>
        </u:Agregar>
      </soap:Body>
    </soap:Envelope>`;

    await fetch(SOAP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: `"${NS}/Agregar"`,
      },
      body: envelope,
    });

    setShowAddModal(false);
    listarUsuarios();
  }

  // ============================================================
  // ACTUALIZAR
  // ============================================================
  async function actualizarUsuario() {
    const u = editUser;

    const envelope = `
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:u="${NS}">
      <soap:Body>
        <u:Actualizar>
          <u:user>
            <u:UserId>${u.UserId}</u:UserId>
            <u:FullName>${u.FullName}</u:FullName>
            <u:Email>${u.Email}</u:Email>
            <u:Role>${u.Role}</u:Role>
            <u:Status>${u.Status}</u:Status>
            <u:PasswordHash>123456</u:PasswordHash>
          </u:user>
        </u:Actualizar>
      </soap:Body>
    </soap:Envelope>`;

    await fetch(SOAP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: `"${NS}/Actualizar"`,
      },
      body: envelope,
    });

    setShowEditModal(false);
    listarUsuarios();
  }

  // ============================================================
  // BADGES Y AVATAR
  // ============================================================
  const Badge = ({ text, type }) => {
    // CORRECCIÓN: Verde para ACTIVE, Rojo para INACTIVE
    const color =
      type === "Active" ? "bg-green-600 text-white" : "bg-red-600 text-white";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm transition-colors ${color}`}
      >
        {text}
      </span>
    );
  };

  const RoleBadge = ({ role }) => {
    const color =
      role === "Admin"
        ? "bg-purple-600 text-white"
        : "bg-indigo-600 text-white";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm transition-colors ${color}`}
      >
        {role}
      </span>
    );
  };

  const Avatar = ({ name }) => {
    const initial = name?.charAt(0)?.toUpperCase() ?? "?";
    return (
      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-700 text-white font-bold shadow-md">
        {initial}
      </div>
    );
  };

  // ============================================================
  // PAGINACIÓN UI
  // ============================================================
  const Pagination = () => (
    <div className="flex justify-center mt-6 gap-2">
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        const active = page === currentPage;

        return (
          <button
            key={i}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 
            ${
              active
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 transform scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="flex font-sans">
      {/* Añadir el fondo de galaxia con animación */}
      <GalaxyBackground />

      <SidebarAdmin open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Contenido Principal */}
      <main className="flex-1 md:ml-64 p-8 min-h-screen relative z-10">
        <HeaderAdmin onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Título más pequeño: text-3xl */}
        <h1 className="text-2xl font-extrabold text-white mb-8 mt-4 tracking-tight">
          Gestión de Usuarios
        </h1>

        {/* BUSCADOR */}
        <div className="w-full mb-8 relative p-4 bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
          <Search className="absolute left-7 top-7 text-gray-300" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-900/50 text-white placeholder-gray-400 border border-gray-700 rounded-xl shadow-inner focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* BOTÓN FLOTANTE */}
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-10 right-10 bg-indigo-600 text-white p-5 rounded-full shadow-2xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-110 z-50"
          title="Agregar nuevo usuario"
        >
          <Plus size={28} />
        </button>

        {/* TABLA MODERNA */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-white/20 overflow-x-auto">
          {loading ? (
            <p className="text-indigo-200 text-center py-10">
              Cargando datos ...
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-indigo-200 text-center py-10">
              No se encontraron usuarios.
            </p>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 text-indigo-300 text-xs uppercase tracking-wider">
                    <th className="text-left py-4 px-3">Usuario</th>
                    <th className="text-left py-4 px-3">Email</th>
                    <th className="text-left py-4 px-3">Rol</th>
                    <th className="text-left py-4 px-3">Estado</th>
                    <th className="text-left py-4 px-3">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {currentUsers.map((u) => (
                    <tr
                      key={u.UserId}
                      className="border-b border-gray-800 text-gray-200 hover:bg-white/5 transition-all duration-150"
                    >
                      <td className="py-4 px-3 flex items-center gap-3">
                        <Avatar name={u.FullName} />
                        <div>
                          <p className="font-semibold text-white">
                            {u.FullName}
                          </p>
                          <p className="text-xs text-indigo-300">
                            ID: {u.UserId}
                          </p>
                        </div>
                      </td>

                      <td className="text-gray-300 px-3">{u.Email}</td>

                      <td className="px-3">
                        {/* Se usa el RoleBadge original */}
                        <RoleBadge role={u.Role} />
                      </td>

                      <td className="px-3">
                        {/* Se usa el Badge con la corrección de color */}
                        <Badge text={u.Status} type={u.Status} />
                      </td>

                      <td className="px-3">
                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              setEditUser(u);
                              setShowEditModal(true);
                            }}
                            className="text-indigo-400 hover:text-indigo-200 p-1 rounded-full transition-colors duration-150 hover:bg-white/10"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>

                          <button
                            onClick={() => eliminarUsuario(u.UserId)}
                            className="text-red-500 hover:text-red-300 p-1 rounded-full transition-colors duration-150 hover:bg-white/10"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Pagination />
            </>
          )}
        </div>

        {/* MODAL AGREGAR */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-2xl border border-indigo-700/50">
              <h2 className="text-2xl font-bold mb-6 text-white border-b border-indigo-600 pb-2">
                ➕ Agregar Usuario
              </h2>

              <input
                className="border-0 p-3 rounded-lg w-full mb-3 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Nombre completo"
                value={nuevoUsuario.FullName}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, FullName: e.target.value })
                }
              />

              <input
                className="border-0 p-3 rounded-lg w-full mb-3 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Email"
                type="email"
                value={nuevoUsuario.Email}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, Email: e.target.value })
                }
              />

              <select
                className="border-0 p-3 rounded-lg w-full mb-4 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                value={nuevoUsuario.Role}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, Role: e.target.value })
                }
              >
                <option value="Customer" className="bg-gray-800">
                  Customer
                </option>
                <option value="Admin" className="bg-gray-800">
                  Admin
                </option>
              </select>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 px-4 py-2 rounded-lg hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarUsuario}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/50"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDITAR */}
        {showEditModal && editUser && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-2xl border border-indigo-700/50">
              <h2 className="text-1xl font-bold mb-6 text-white border-b border-indigo-600 pb-2">
                Editar Usuario
              </h2>

              <input
                className="border-0 p-3 rounded-lg w-full mb-3 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
                value={editUser.FullName}
                onChange={(e) =>
                  setEditUser({ ...editUser, FullName: e.target.value })
                }
              />

              <input
                className="border-0 p-3 rounded-lg w-full mb-3 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
                type="email"
                value={editUser.Email}
                onChange={(e) =>
                  setEditUser({ ...editUser, Email: e.target.value })
                }
              />

              <select
                className="border-0 p-3 rounded-lg w-full mb-3 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                value={editUser.Role}
                onChange={(e) =>
                  setEditUser({ ...editUser, Role: e.target.value })
                }
              >
                <option value="Customer" className="bg-gray-800">
                  Customer
                </option>
                <option value="Admin" className="bg-gray-800">
                  Admin
                </option>
              </select>

              <select
                className="border-0 p-3 rounded-lg w-full mb-6 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                value={editUser.Status}
                onChange={(e) =>
                  setEditUser({ ...editUser, Status: e.target.value })
                }
              >
                <option value="Active" className="bg-gray-800">
                  Active
                </option>
                <option value="Inactive" className="bg-gray-800">
                  Inactive
                </option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 px-4 py-2 rounded-lg hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={actualizarUsuario}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/50"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
