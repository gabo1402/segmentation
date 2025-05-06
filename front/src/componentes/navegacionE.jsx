import React from 'react';
import { Link } from 'react-router-dom';
import './navegacion.css';

function NavCub() {
  return (
    <div className="layout">
      <nav className="nav-bar">
        <img src="./src/assets/logo_servicio.png" alt="Logo" className="logo-servicio" />
        <ul>
          <li><Link to="/inicioE">Inicio Estudiante</Link></li>
          <li><Link to="/visualizarProyectos">Catálogo de Proyectos</Link></li>
          <li><Link to="/misPostulaciones">Mis Postulaciones</Link></li>
        </ul>
      </nav>

      {/* Barra superior */}
      <header className="top-bar">
        <div className="user-info">
          <span className="notifications">🔔</span>
          <span className="username">Alejandra Ramírez</span>
        </div>
      </header>
    </div>
  );
}

export default NavCub;