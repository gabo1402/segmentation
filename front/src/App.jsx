import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Inicio from './paginasA/InicioA';
import Productos from './paginasA/ProductosA';
import Servicios from './paginasA/ServiciosA';
import Contacto from './paginasA/ContactoA';
import Login from './Login';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
