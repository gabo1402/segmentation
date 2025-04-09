import React, { useEffect, useState } from "react";
import "./PaginasE.css";
import NavCub from "../componentes/navegacionE";
import axios from "axios";

function InicioE() {

  return (
    <div className="cube-container">
      <NavCub />
      <div className="cube">
        <h1>Hola Estudiante</h1>
      </div>
    </div>
  );
}

export default InicioE;
