import React from "react";
import { useNavigate } from "react-router-dom";
import "./PaginasA.css";
import NavCub from "../componentes/navegacion";

function Inicio() {
  const navigate = useNavigate();

  const cards = [
    { title: "Agregar Admins", route: "/agregarAdminA" },
    { title: "Status Socios", route: "/statusSociosA" },
  ];

  return (
    <div className="cube">
      <NavCub />
      <h1 className="titulo">Inicio</h1>
      <div className="card-container">
        {cards.map((card, index) => (
          <div key={index} className="info-card" onClick={() => navigate(card.route)}>
            {card.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inicio;
