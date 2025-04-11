import React, { useEffect, useState } from "react";
import "./PaginasA.css";
import NavCub from "../componentes/navegacion";
import axios from "axios";

function Inicio() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/data") //llama al end point
      .then((response) => setData(response.data)) //peticion exitosa actializa estado
      .catch((error) => console.error("Error al obtener datos:", error)); 
  }, []);

  return (
    <div className="cube-container">
      <NavCub />
      <div className="cube">
        <h1>Página de Inicio</h1>
        <p>Bienvenido a nuestra página de inicio.</p>

        <h3>Datos de la Base de Datos</h3>
        {data.length > 0 ? (
          <table border="1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.id}</td> 
                  <td>{row.nombre}</td> 
                  <td>{row.direccion}</td> 
                  <td>{row.fecha}</td> 
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
