import { useEffect, useState } from 'react';
import axios from 'axios';
import NavCub from '../componentes/navegacion';
import './tablasA.css'; 

function ProyectosPos() {
    const [proyectos, setProyectos] = useState([]);

    const columnasDisponibles = {
        id_proyecto: 'ID',
        nombre_proyecto: 'Nombre',
        status_proyecto: 'Status',
        id_campus: 'Campus',
        grupo: 'Grupo',
        fecha_postulacion_proyecto: 'Fecha Postulación',
        crn: 'CRN',
        clave_materia: 'Clave Materia',
        problema_social: 'Problema Social',
        vulnerabilidad_atendida: 'Vulnerabilidad',
        numero_beneficiarios_proyecto: 'Beneficiarios',
        objetivo_proyecto: 'Objetivo',
        modalidad: 'Modalidad',
        cupos_proyecto: 'Cupos',
        region_proyecto: 'Región',
        fecha_implementacion: 'Fecha Implementación',
        horario: 'Horario',
        horas_acreditar: 'Horas a Acreditar',
        valor_proyecto: 'Valor',
        // Agrega aquí cualquier otro campo que quieras mostrar
    };

    const [columnasVisibles, setColumnasVisibles] = useState([]);


    useEffect(() => {
        axios.get('http://localhost:5000/proyectos')
            .then(response => {
                setProyectos(response.data);
            })
            .catch(error => {
                console.error('Error al obtener proyectos:', error);
            });
    }, []);

    function actualizarStatus(id, nuevoStatus) {
        axios.put(`http://localhost:5000/proyecto/${id}/status`, { status: nuevoStatus })
            .then(() => {
                setProyectos(prev =>
                    prev.filter(proyecto => proyecto.id_proyecto !== id)
                );
            })
            .catch(error => {
                console.error('Error al actualizar el status:', error);
            });
    }

    return (
        <div className="cube" style={{ marginLeft: '260px', padding: '20px' }}>
            <NavCub />
            <h1>Proyectos Postulados Pendientes</h1>

            <div className="filtros-columnas">
                <h3>Columnas a mostrar:</h3>
                {Object.entries(columnasDisponibles).map(([key, label]) => (
                    <label key={key} style={{ marginRight: '10px' }}>
                        <input
                            type="checkbox"
                            checked={columnasVisibles.includes(key)}
                            onChange={() => {
                                setColumnasVisibles(prev =>
                                    prev.includes(key)
                                        ? prev.filter(col => col !== key)
                                        : [...prev, key]
                                );
                            }}
                        />
                        {label}
                    </label>
                ))}
            </div>

            <div className="tabla-container">
    <div className="tabla-scroll-wrapper">
        <table className="tabla-proyectos">
            <thead>
                <tr>
                    {columnasVisibles.map(col => (
                        <th key={col}>{columnasDisponibles[col]}</th>
                    ))}
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {proyectos.map(proyecto => (
                    <tr key={proyecto.id_proyecto}>
                        {columnasVisibles.map(col => (
                            <td key={col}>{proyecto[col]}</td>
                        ))}
                        <td>
    <button
        className="aprobar"
        onClick={() => actualizarStatus(proyecto.id_proyecto, 'aprobado')}
    >
        Aprobar
    </button>
    <button
        className="rechazar"
        onClick={() => actualizarStatus(proyecto.id_proyecto, 'rechazado')}
        style={{ marginLeft: '8px' }}
    >
        Rechazar
    </button>
</td>

                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>
        </div>
    );
}

export default ProyectosPos;
