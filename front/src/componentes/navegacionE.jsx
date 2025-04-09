import React from 'react';
import { Link } from 'react-router-dom';
import './navegacion.css';

function NavCub() {
  return (
    <div className="layout">
      {/* Barra lateral izquierda */}
      <nav className="nav-bar">
        <ul>
          <img src="./src/assets/logo_servicio.png" alt="Logo" className="logo servicio social" />
          <li><Link to="/inicioE">Inicio Estudiante</Link></li>
          <li><Link to="/visualizarProyectos">Visualizar Proyectos</Link></li>
          <li><Link to="/misPostulaciones">Mis Postulaciones</Link></li>
        </ul>
      </nav>
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
