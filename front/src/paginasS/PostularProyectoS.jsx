import React from 'react';
import NavCub from '../componentes/navegacionS';
import styles from './PostularProyectoS.module.css';
import { useState , useEffect} from "react";

export default function PostularProyectoS() {
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [modalidad, setModalidad] = useState("Presencial");
  const [direccionEscrita, setDireccionEscrita] = useState("");
  const [cuposDisponibles, setCuposDisponibles] = useState(3);
  const [campus, setCampus] = useState("");
  const [ods, setOds] = useState("");
  const [campusList, setCampusList] = useState([]);
  const [odsList, setOdsList] = useState([]);
  const [error, setError] = useState(null);
  const [problemaSocial, setProblemaSocial] = useState("");
  const [vulnerabilidadAtendida, setVulnerabilidadAtendida] = useState("");
  const [edadPoblacion, setEdadPoblacion] = useState("");
  const [zonaPoblacion, setZonaPoblacion] = useState("");
  const [numeroBeneficiarios, setNumeroBeneficiarios] = useState("");
  const [objetivoProyecto, setObjetivoProyecto] = useState("");
  const [accionesEstudiantado, setAccionesEstudiantado] = useState("");
  const [valorProyecto, setValorProyecto] = useState("");
  const [diasActividades, setDiasActividades] = useState("");
  const [carrerasProyecto, setCarrerasProyecto] = useState("");
  const [habilidadesAlumno, setHabilidadesAlumno] = useState("");

  useEffect(() => {
    // Cargar campus y ODS del backend
    const fetchData = async () => {
      const campusRes = await fetch("http://localhost:5001/campus");
      const campusData = await campusRes.json();
      setCampusList(campusData);

      const odsRes = await fetch("http://localhost:5001/ods");
      const odsData = await odsRes.json();
      setOdsList(odsData);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombreProyecto || !direccionEscrita || !problemaSocial || !vulnerabilidadAtendida || !objetivoProyecto || !accionesEstudiantado || !valorProyecto || !habilidadesAlumno) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    const proyectoData = {
      nombre_proyecto: nombreProyecto,
      modalidad,
      direccion_escrita: direccionEscrita,
      cupos_disponibles: cuposDisponibles,
      campus,  // Enviar el ID del campus
      ods,  // Enviar el ID del ODS
      problema_social: problemaSocial,
      vulnerabilidad_atendida: vulnerabilidadAtendida,
      edad_poblacion: edadPoblacion,
      zona_poblacion: zonaPoblacion,
      numero_beneficiarios_proyecto: numeroBeneficiarios,
      objetivo_proyecto: objetivoProyecto,
      acciones_estudiantado: accionesEstudiantado,
      valor_proyecto: valorProyecto,
      dias_actividades: diasActividades,
      carreras_proyecto: carrerasProyecto,
      habilidades_alumno: habilidadesAlumno,
    };

    try {
      const response = await fetch("http://localhost:5001/proyecto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proyectoData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Proyecto creado exitosamente!");
      } else {
        setError(data.message || "Error al crear proyecto");
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
      setError("Error de red");
    }
  };

  return (
    <div className={`${styles.page} cube`}>
      <NavCub />

      <div className={styles.formBox}>
        <h1 className={styles.title}>Añadir nuevo proyecto</h1>

        <form onSubmit={handleSubmit}>
          {/* ---- Nombre ---- */}
          <label className={styles.label}>Nombre del proyecto</label>
          <input
            className={styles.input}
            type="text"
            value={nombreProyecto}
            onChange={(e) => setNombreProyecto(e.target.value)}
          />

          {/* ---- Ubicación ---- */}
          <label className={styles.label}>Ubicación</label>
          <input
            className={styles.input}
            type="text"
            value={direccionEscrita}
            onChange={(e) => setDireccionEscrita(e.target.value)}
          />

          {/* ---- Modalidad ---- */}
          <label className={styles.label}>Modalidad</label>
          <select
            className={styles.select}
            value={modalidad}
            onChange={(e) => setModalidad(e.target.value)}
          >
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Híbrido">Híbrido</option>
          </select>

          {/* ---- Cupos ---- */}
          <label className={styles.label}>Cuántos cupos necesitas</label>
          <input
            className={styles.input}
            type="number"
            value={cuposDisponibles}
            onChange={(e) => setCuposDisponibles(e.target.value)}
          />

          {/* ---- Campus ---- */}
          <label className={styles.label}>Campus</label>
          <select
            className={styles.select}
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
          >
            <option value="">Selecciona el campus</option>
            {campusList.map((item) => (
              <option key={item.id_campus} value={item.id_campus}>
                {item.campus}
              </option>
            ))}
          </select>

          {/* ---- ODS ---- */}
          <label className={styles.label}>ODS (Objetivos de Desarrollo Sostenible)</label>
          <select
            className={styles.select}
            value={ods}
            onChange={(e) => setOds(e.target.value)}
          >
            <option value="">Selecciona un ODS</option>
            {odsList.map((odsItem) => (
              <option key={odsItem.id_ods} value={odsItem.id_ods}>
                {odsItem.nombre_ods}
              </option>
            ))}
          </select>

          {/* ---- Textareas ---- */}
          <label className={styles.label}>Problema social</label>
          <textarea
            className={styles.textarea}
            value={problemaSocial}
            onChange={(e) => setProblemaSocial(e.target.value)}
          />

          <label className={styles.label}>Vulnerabilidad atendida</label>
          <textarea
            className={styles.textarea}
            value={vulnerabilidadAtendida}
            onChange={(e) => setVulnerabilidadAtendida(e.target.value)}
          />

          <label className={styles.label}>Edad población</label>
          <input
            className={styles.input}
            type="number"
            value={edadPoblacion}
            onChange={(e) => setEdadPoblacion(e.target.value)}
          />

          <label className={styles.label}>Zona población</label>
          <textarea
            className={styles.textarea}
            value={zonaPoblacion}
            onChange={(e) => setZonaPoblacion(e.target.value)}
          />

          <label className={styles.label}>Número de beneficiarios</label>
          <input
            className={styles.input}
            type="number"
            value={numeroBeneficiarios}
            onChange={(e) => setNumeroBeneficiarios(e.target.value)}
          />

          <label className={styles.label}>Objetivo del proyecto</label>
          <textarea
            className={styles.textarea}
            value={objetivoProyecto}
            onChange={(e) => setObjetivoProyecto(e.target.value)}
          />

          <label className={styles.label}>Acciones de estudiantado</label>
          <textarea
            className={styles.textarea}
            value={accionesEstudiantado}
            onChange={(e) => setAccionesEstudiantado(e.target.value)}
          />

          <label className={styles.label}>Valor del proyecto</label>
          <textarea
            className={styles.textarea}
            value={valorProyecto}
            onChange={(e) => setValorProyecto(e.target.value)}
          />

          <label className={styles.label}>Días de actividades</label>
          <input
            className={styles.input}
            type="text"
            value={diasActividades}
            onChange={(e) => setDiasActividades(e.target.value)}
          />

          <label className={styles.label}>Carreras del proyecto</label>
          <input
            className={styles.input}
            type="text"
            value={carrerasProyecto}
            onChange={(e) => setCarrerasProyecto(e.target.value)}
          />

          <label className={styles.label}>Habilidades para los alumnos</label>
          <textarea
            className={styles.textarea}
            value={habilidadesAlumno}
            onChange={(e) => setHabilidadesAlumno(e.target.value)}
          />

          {/* ---- Error y botón ---- */}
          {error && <p className={styles.errorMsg}>{error}</p>}

          <button type="submit" className={styles.button}>
            Añadir
          </button>
        </form>
      </div>
    </div>
  );
}
