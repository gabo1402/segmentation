import React from 'react';
import { Link } from 'react-router-dom';
import './navegacion.css';

function NavCub({ onLogout }) {  // Recibimos la prop onLogout
  return (
    <div className="layout">
      <nav className="nav-bar">
        <ul>
          <img src="./src/assets/logo_servicio.png" alt="Logo" className="logo servicio social" />
          <li><Link to="/inicioS">Inicio Socio</Link></li>
          <li><Link to="/postularProyectoS">Postular Proyecto</Link></li>
          <li><Link to="/nuestrosProyectosS">Nuetros proyectos</Link></li>
        </ul>
        <button onClick={onLogout} className="logout-button">Cerrar sesión</button> {/* Botón de cerrar sesión */}
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
