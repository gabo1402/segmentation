import { useEffect, useState } from 'react';
import axios from 'axios';
import NavCub from '../componentes/navegacion';
import './tablasA.css';

function ProyectosPos() {
    const [proyectos, setProyectos] = useState([]);
    const [columnasVisibles, setColumnasVisibles] = useState([]);
    const [celdaSeleccionada, setCeldaSeleccionada] = useState(null); // { filaId, columna }
    const [valorEditado, setValorEditado] = useState('');
    const [valorOriginal, setValorOriginal] = useState('');

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
    };

    useEffect(() => {
        axios.get('http://localhost:5000/proyectos')
            .then(response => {
                setProyectos(response.data);
            })
            .catch(error => {
                console.error('Error al obtener proyectos:', error);
            });
    }, []);

    const handleCeldaClick = (filaId, columna, valorActual) => {
        setCeldaSeleccionada({ filaId, columna });
        setValorEditado(valorActual);
        setValorOriginal(valorActual);
    };

    const guardarCambio = async () => {
        const { filaId, columna } = celdaSeleccionada;  // Aquí obtienes la fila y la columna seleccionadas
        const nuevoValor = valorEditado;  // El valor que has editado en el input
    
        try {
            // Realizar la solicitud PUT con el valor de la columna y el nuevo valor
            const response = await fetch(`http://localhost:5000/proyecto/${filaId}/editar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ columna, nuevoValor }),  // Enviar columna y nuevo valor al backend
            });
    
            // Verificar si la respuesta fue exitosa
            const data = await response.json();
            if (response.ok) {
                // Si la respuesta es exitosa, obtén los proyectos actualizados desde el backend
                const proyectosActualizados = await axios.get('http://localhost:5000/proyectos');
                setProyectos(proyectosActualizados.data);  // Actualizar los proyectos en el estado
    
                setCeldaSeleccionada(null);  // Desmarcar la celda seleccionada
                setValorEditado('');  // Limpiar el valor editado
            } else {
                console.error('Error al actualizar proyecto:', data.message);
            }
        } catch (error) {
            console.error('Error al guardar cambio:', error);
        }
    };
    

    const cancelarEdicion = () => {
        setCeldaSeleccionada(null);
        setValorEditado('');
        setValorOriginal('');
    };

    function actualizarStatus(id, nuevoStatus) {
        axios.put(`http://localhost:5000/proyecto/${id}/status`, { status: nuevoStatus })
            .then(() => {
                setProyectos(prev =>
                    prev.map(proy =>
                        proy.id_proyecto === id ? { ...proy, status_proyecto: nuevoStatus } : proy
                    )
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
                                        <td
                                            key={col}
                                            onClick={() =>
                                                handleCeldaClick(proyecto.id_proyecto, col, proyecto[col])
                                            }
                                        >
                                            {celdaSeleccionada &&
                                            celdaSeleccionada.filaId === proyecto.id_proyecto &&
                                            celdaSeleccionada.columna === col ? (
                                                <input
                                                    type="text"
                                                    value={valorEditado}
                                                    onChange={e => setValorEditado(e.target.value)}
                                                    onBlur={guardarCambio}
                                                    autoFocus
                                                />
                                            ) : (
                                                proyecto[col]
                                            )}
                                        </td>
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

            {celdaSeleccionada && (
                <div className="editor-container" style={{ marginTop: '20px' }}>
                    <h3>Editando: {columnasDisponibles[celdaSeleccionada.columna]}</h3>
                    <input
                        type="text"
                        value={valorEditado}
                        onChange={(e) => setValorEditado(e.target.value)}
                        style={{ marginRight: '10px' }}
                    />
                    <button onClick={guardarCambio}>Guardar cambios</button>
                    <button onClick={cancelarEdicion} style={{ marginLeft: '8px' }}>Cancelar</button>
                </div>
            )}
        </div>
    );
}

export default ProyectosPos;