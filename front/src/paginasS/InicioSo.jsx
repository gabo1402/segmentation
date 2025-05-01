import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavCub from '../componentes/navegacionS';

function InicioS() {
  const navigate = useNavigate();

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('jwt'); // Eliminar el JWT
    navigate('/login'); // Redirigir al login
  };

  return (
    <div className="cube">
      <NavCub />
      <h1>Inicio Socios</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default InicioS;
