import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavCub from '../componentes/navegacion';
import "./PaginasA.css";
import { Link } from 'react-router-dom';

function SociosAprobados() {
  const [socios, setSocios] = useState([]);
  const [filteredText, setFilteredText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/socio/aprobados')
      .then(response => setSocios(response.data))
      .catch(error => console.error('Error al obtener socios:', error));
  }, []);

  const sociosFiltrados = socios.filter(socio =>
    Object.values(socio).some(valor =>
      valor && valor.toString().toLowerCase().includes(filteredText.toLowerCase())
    )
  );

  return (
    <div className="cube">
      <NavCub />
      <h1 className="titulo">Socios que han sido aprobados</h1>

      <div className="tabla-container">
      <label>Buscar: </label>
        <input
          type="text"
          value={filteredText}
          onChange={(e) => setFilteredText(e.target.value)}
          placeholder="Texto de demonstracion"
        />
        <table className="tabla-proyectos">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Tipo de Socio</th>
              <th>Ver más</th>
            </tr>
          </thead>
          <tbody>
            {sociosFiltrados.map((socio) => (
              <tr key={socio.id_socio}>
                <td>{socio.nombre}</td>
                <td>{socio.correo}</td>
                <td>
                  <span className="badge aprobado">{socio.tipo_socio}</span>
                </td>
                <td>
                  <Link to={`/socio/info/${socio.id_socio}`} className="ver-mas-link">
                    Ver más
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SociosAprobados;