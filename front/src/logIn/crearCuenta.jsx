import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

export default function CrearCuenta() {
  const [tipoUsuario, setTipoUsuario] = useState("estudiante");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");

  // Errores generales
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorNombre, setErrorNombre] = useState("");

  // Estudiante
  const [matricula, setMatricula] = useState("");
  const [carrera, setCarrera] = useState("");
  const [campus, setCampus] = useState("");
  const [dobleTitulacion, setDobleTitulacion] = useState(false); 
  const [candidatoGrado, setCandidatoGrado] = useState(false);     
  const [telefono, setTelefono] = useState("");      
  const [semestre, setSemestre] = useState("");
  //errores es
  const [errorMatricula, setErrorMatricula] = useState("");
  const [errorCarrera, setErrorCarrera] = useState("");
              

  // Socio
  const [tipoSocio, setTipoSocio] = useState("");
  const [telefonoSocio, setTelefonoSocio] = useState("");
  const [status, setStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // Socio
  const [errorTipoSocio, setErrorTipoSocio] = useState("");
  const [redesSociales, setRedesSociales] = useState("");
  const [notificacionesSocio, setNotificacionesSocio] = useState(false);

  const validarFormulario = () => {
    let esValido = true;
  
    setErrorEmail("");
    setErrorPassword("");
    setErrorNombre("");
    setErrorMatricula("");
    setErrorCarrera("");
    setErrorTipoSocio("");
  
    if (!email.includes("@")) {
      setErrorEmail("El correo no es válido.");
      esValido = false;
    }
  
    if (password.length < 6) {
      setErrorPassword("La contraseña debe tener al menos 6 caracteres.");
      esValido = false;
    }
  
    if (nombre.trim() === "") {
      setErrorNombre("El nombre no puede estar vacío.");
      esValido = false;
    }
  
    if (tipoUsuario === "estudiante") {
      if (matricula.trim() === "") {
        setErrorMatricula("La matrícula es obligatoria.");
        esValido = false;
      }
  
    if (carrera.trim() === "") {
        setErrorCarrera("La carrera es obligatoria.");
        esValido = false;
      }
    }
  
    if (tipoUsuario === "socio") {
      if (tipoSocio.trim() === "") {
        setErrorTipoSocio("El tipo de socio es obligatorio.");
        esValido = false;
      }
    }
  
    return esValido;
  };

  const handleRegistro = async () => {
    if (!validarFormulario()) return;
    let url = "";
    let body = {};

    if (tipoUsuario === "estudiante") {
      url = "http://localhost:5001/registro/alumno";
      body = {
        correo: email,
        contraseña: password,
        nombre,
        matricula,
        id_carrera: carrera,
        semestre,
        id_campus: campus, 
        doble_titulacion: dobleTitulacion,  
        candidato_graduar: candidatoGrado,   
        telefono: telefono                    
      };
    } else if (tipoUsuario === "socio") {
      url = "http://localhost:5001/registro/socio";
      body = {
        correo: email,
        contraseña: password,
        nombre,
        status: status,
        tipo_socio: tipoSocio,
        telefono_socio: telefonoSocio,
        redes_sociales: redesSociales,
        notificaciones_socio: notificacionesSocio,
      };
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Cuenta creada exitosamente");
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (error) {
      alert("❌ Ocurrió un error al crear la cuenta");
      console.error("Error:", error);
    }
  };

  return (
    <div className="login-container">
  <div className="login-form-box">
    <h1 className="title">Crear cuenta</h1>

    <label>Tipo de usuario</label>
    <select
      value={tipoUsuario}
      onChange={(e) => setTipoUsuario(e.target.value)}
    >
      <option value="estudiante">Estudiante</option>
      <option value="socio">Socio formador</option>
    </select>

    <div className="input-group">
      <label>Correo</label>
      <input
        type="email"
        placeholder="correo@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errorEmail && <span className="error">{errorEmail}</span>}
    </div>

    <div className="input-group">
      <label>Contraseña</label>
      <div className="input-box">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Introduce tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="toggle-btn" onClick={() => setShowPassword(!showPassword)}>
          <img src={showPassword ? "/src/assets/ojo.png" : "/src/assets/ojo (1).png"} alt="Mostrar" className="icon" />
        </button>
      </div>
      {errorPassword && <span className="error">{errorPassword}</span>}
    </div>

    <div className="input-group">
      <label>Nombre completo</label>
      <input
        type="text"
        placeholder="Tu nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      {errorNombre && <span className="error">{errorNombre}</span>}
    </div>

    {tipoUsuario === "socio" && (
      <>
        <div className="input-group">
          <label>Tipo de socio</label>
          <input
            type="text"
            placeholder="Tipo de socio"
            value={tipoSocio}
            onChange={(e) => setTipoSocio(e.target.value)}
          />
          {errorTipoSocio && <span className="error">{errorTipoSocio}</span>}
        </div>

        <div className="input-group">
          <label>Teléfono Socio</label>
          <input
            type="text"
            value={telefonoSocio}
            onChange={(e) => setTelefonoSocio(e.target.value)}
          />
        </div>

        <div className="input-group">
  <label>Redes Sociales</label>
  <input
    type="text"
    placeholder="Link de redes sociales"
    value={redesSociales}
    onChange={(e) => setRedesSociales(e.target.value)}
  />
</div>

<div className="input-group">
  <label>
    <input
      type="checkbox"
      checked={notificacionesSocio}
      onChange={(e) => setNotificacionesSocio(e.target.checked)}
    />
    ¿Desea recibir notificaciones?
  </label>
</div>
      </>
    )}

    {tipoUsuario === "estudiante" && (
      <>
        <div className="input-group">
          <label>Matrícula</label>
          <input
            type="text"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
          />
          {errorMatricula && <span className="error">{errorMatricula}</span>}
        </div>

        <div className="input-group">
          <label>Carrera</label>
          <input
            type="text"
            value={carrera}
            onChange={(e) => setCarrera(e.target.value)}
          />
          {errorCarrera && <span className="error">{errorCarrera}</span>}
        </div>

        <div className="input-group">
      <label>Semestre</label>
      <input
        type="number"
        value={semestre}
        onChange={(e) => setSemestre(e.target.value)}
        min="1" 
        max="12" // Suponiendo que el semestre sea de 1 a 12
      />
    </div>

        <div className="input-group">
          <label>¿Doble titulación?</label>
          <select
  value={dobleTitulacion}
  onChange={(e) => setDobleTitulacion(e.target.value === "true")}
>
  <option value="false">No</option>
  <option value="true">Sí</option>
</select>
        </div>

        <div className="input-group">
          <label>¿Candidato a graduar?</label>
          <select
  value={candidatoGrado}
  onChange={(e) => setCandidatoGrado(e.target.value === "true")}
>
  <option value="false">No</option>
  <option value="true">Sí</option>
</select>
        </div>

        <div className="input-group">
          <label>Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
      </>
    )}

    <button className="signup-btn" onClick={handleRegistro}>
      Crear cuenta
    </button>

    <p className="login-text">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
  </div>
</div>

  );
}
