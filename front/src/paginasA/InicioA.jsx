import React, { useEffect, useState } from "react";
import "./PaginasA.css";
import NavCub from "../componentes/navegacion";
import axios from "axios";

function Inicio() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/data")
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error al obtener datos:", error));
  }, []);

  return (
    <div className="cube-container">
      <NavCub />
      <div className="cube">
        <h1>Página de Inicio</h1>
        <p>Bienvenido a nuestra página de inicio.</p>

        <h3>Datos del Archivo Excel</h3>
        {data.length > 0 ? (
          <table border="1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Fecha</th>
                <th>Hora SS</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.ID}</td>
                  <td>{row.Name}</td>
                  <td>{row.Direccion}</td>
                  <td>{row.Fecha}</td>
                  <td>{row.Hora_ss}</td>
                  <td>{row.Estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Cargando datos...</p>
        )}
      </div>
    </div>
  );
}

export default Inicio;
