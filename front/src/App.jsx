import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Inicio from './paginasA/InicioA';
import AgregarAdmin from "./paginasA/AgregarAdminA";
import StatusSocios from "./paginasA/StatusSociosA";

import Dashboard from './paginasA//DashBoardA';
import ProyectosPos from './paginasA/ProyectosPosA';
import AlumnosPos from './paginasA/AlumnosPosA';

import InicioE from './paginasE/InicioE';
import VisualizarProyectos from './paginasE/VisualizarProyectosE';
import MisPostulaciones from './paginasE/MisPostulacionesE';

import InicioS from './paginasS/InicioSo';
import PostularProyecto from './paginasS/NuestrosProyectosS';
import NuestrosProyectos from './paginasS/PostularProyectoS';

import Login from './logIn/Login';
import CrearCuenta from './logIn/crearCuenta';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/agregarAdmin" element={<AgregarAdmin />} />
        <Route path="/socios" element={<StatusSocios />} />


        <Route path="/dashBoard" element={<Dashboard />} />
        <Route path="/proyectosPos" element={<ProyectosPos />} />
        <Route path="/alumnosPos" element={<AlumnosPos />} />

        <Route path="/inicioE" element={<InicioE />} />
        <Route path="/visualizarProyectos" element={<VisualizarProyectos />} />
        <Route path="/misPostulaciones" element={<MisPostulaciones />} />

        <Route path="/inicioS" element={<InicioS />} />
        <Route path="/nuestrosProyectosS" element={<PostularProyecto/>} />
        <Route path="/postularProyectoS" element={<NuestrosProyectos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/crearCuenta" element={<CrearCuenta />} />
      </Routes>
    </>
  );
}

export default App;
