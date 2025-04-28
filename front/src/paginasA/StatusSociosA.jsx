import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavCub from '../componentes/navegacion';
import './PaginasA.css';

function StatusSocios() {
  const [socios, setSocios] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/socio/pendiente')
      .then(response => setSocios(response.data))
      .catch(error => console.error('Error al obtener socios:', error));
  }, []);

  const cambiarStatus = (id, nuevoStatus) => {
    axios.put(`http://localhost:5000/socio/${id}/status`, { status: nuevoStatus })
      .then(() => {
        alert('Status actualizado');
        window.location.reload();
      })
      .catch(error => console.error('Error al actualizar status:', error));
  };

  const badgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'aprobado': return 'badge aprobado';
      case 'aceptado': return 'badge aceptado';
      case 'en proceso': return 'badge en-proceso';
      case 'rechazado':
      case 'no aceptado': return 'badge rechazado';
      default: return 'badge pendiente';
    }
  };

  return (
    <div className="cube">
      <NavCub />
      <h1>Socios pendientes</h1>
      <table className="socios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Cambiar Estado</th>
          </tr>
        </thead>
        <tbody>
          {socios.map((socio, index) => (
            <tr key={socio.id_socio}>
              <td>000{index + 1}</td>
              <td>{socio.nombre}</td>
              <td>{socio.correo}</td>
              <td><span className={badgeClass(socio.status)}>{socio.status}</span></td>
              <td>
                <select onChange={(e) => cambiarStatus(socio.id_socio, e.target.value)} defaultValue="">
                  <option value="" disabled>Selecciona</option>
                  <option value="aceptado">Aceptado</option>
                  <option value="no aceptado">No Aceptado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StatusSocios;


