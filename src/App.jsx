import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import CrearCuenta from "./pages/CrearCuenta";

import HomeDashboard from "./pages/HomeDashboard";
import SeleccionVuelo from "./pages/SeleccionVuelo";
import SeleccionVueloVuelta from "./pages/SeleccionVueloVuelta";
import ResumenVuelo from "./pages/ResumenVuelo";
import Pasajeros from "./pages/Pasajeros";
import SeleccionAsientos from "./pages/SeleccionAsientos";
import Pago from "./pages/Pago";
import Confirmacion from "./pages/Confirmacion";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import UsersAdmin from "./pages/UsersAdmin";
import FlightsAdmin from "./pages/FlightsAdmin";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌍 Público */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/crear-cuenta" element={<CrearCuenta />} />

        {/* 🔒 PROTEGIDAS (solo usuarios logueados) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seleccion-vuelo"
          element={
            <ProtectedRoute>
              <SeleccionVuelo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seleccion-vuelo-vuelta"
          element={
            <ProtectedRoute>
              <SeleccionVueloVuelta />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resumen-vuelo"
          element={
            <ProtectedRoute>
              <ResumenVuelo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pasajeros"
          element={
            <ProtectedRoute>
              <Pasajeros />
            </ProtectedRoute>
          }
        />

        <Route
          path="/asientos"
          element={
            <ProtectedRoute>
              <SeleccionAsientos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pago"
          element={
            <ProtectedRoute>
              <Pago />
            </ProtectedRoute>
          }
        />

        <Route
          path="/confirmacion"
          element={
            <ProtectedRoute>
              <Confirmacion />
            </ProtectedRoute>
          }
        />
        {/* 🟩 NUEVA RUTA ADMIN — SOLO ROLE "Admin" */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute role="Admin">
              <UsersAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vuelos"
          element={
            <ProtectedRoute role="Admin">
              <FlightsAdmin />
            </ProtectedRoute>
          }
        />

        {/* Ruta desconocida */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
