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
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/servicios">Servicios</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>
      </nav>
      <header className="top-bar">
        <input type="text" placeholder="Search" className="search-bar" />
        <div className="user-info">
          <span className="notifications">🔔</span>
          <span className="username">Alejandra Ramírez</span>
          <img src="/path-to-avatar.jpg" alt="User Avatar" className="avatar" />
        </div>
      </header>
    </div>
  );
}

export default NavCub;
