import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavCub from '../componentes/navegacion';
import "./PaginasA.css";

function SociosAprobados() {
  const [socios, setSocios] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/socio/aprobados')
      .then(response => setSocios(response.data))
      .catch(error => console.error('Error al obtener socios:', error));
  }, []);

  return (
    <div className="cube">
      <NavCub />
      <h1 className="titulo">Socios que han sido aprobados</h1>
      <div className="card-container">
        {socios.map((socio) => (
          <div key={socio.id_socio} className="info-card">
            <div>
              <div><strong>{socio.nombre}</strong></div>
              <div>{socio.correo}</div>
              <div className="badge aprobado">{socio.tipo_socio}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SociosAprobados;
