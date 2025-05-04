import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavCub from '../componentes/navegacion';
import axios from 'axios';


function InfoSocioA() {
  const { id } = useParams();
  const [socio, setSocio] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/socio/${id}`)
      .then(response => setSocio(response.data))
      .catch(error => console.error('Error al obtener info del socio:', error));
  }, [id]);
  if (!socio) return <div>Cargando...</div>;

  return (
    <div className="cube">
        <NavCub />
      <h2>{socio.nombre}</h2>
      <p>Correo: {socio.correo}</p>
      <p>Tipo de socio: {socio.tipo_socio}</p>
      <p>Tipo de socio: {socio.telefono_socio}</p>
      <p>Tipo de socio: {socio.redes_sociales}</p>
    </div>
  );
}

export default InfoSocioA;
