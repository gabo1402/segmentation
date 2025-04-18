import React from 'react';
import { Link } from 'react-router-dom';
import './navegacion.css';

function NavCub() {
  return (
    <div className="layout">
      <nav className="nav-bar">
        <ul>
          <img src="./src/assets/logo_servicio.png" alt="Logo" className="logo servicio social" />
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/dashBoard">DashBoard</Link></li>
          <li><Link to="/proyectosPos">Proyectso Pos</Link></li>
          <li><Link to="/alumnosPos">Alumnos Pos</Link></li>
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
