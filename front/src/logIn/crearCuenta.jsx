import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

export default function CrearCuenta() {
  const [tipoUsuario, setTipoUsuario] = useState("estudiante");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");

  // Estudiante
  const [matricula, setMatricula] = useState("");
  const [carrera, setCarrera] = useState("");
  const [campus, setCampus] = useState("");
  const [dobleTitulacion, setDobleTitulacion] = useState(false); 
  const [candidatoGrado, setCandidatoGrado] = useState(false);     
  const [telefono, setTelefono] = useState("");      
  const [semestre, setSemestre] = useState("");
              

  // Socio
  const [tipoSocio, setTipoSocio] = useState("");
  const [telefonoSocio, setTelefonoSocio] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleRegistro = async () => {
    let url = "";
    let body = {};

    if (tipoUsuario === "estudiante") {
      url = "http://localhost:5000/registro/alumno";
      body = {
        correo: email,
        contrasena: password,
        nombre,
        matricula,
        carrera,
        semestre,
        id_campus: campus, 
        doble_titulacion: dobleTitulacion,  
        candidato_graduar: candidatoGrado,   
        telefono: telefono                    
      };
    } else if (tipoUsuario === "socio") {
      url = "http://localhost:5000/registro/socio";
      body = {
        correo: email,
        contrasena: password,
        nombre,
        tipo_socio: tipoSocio,
        telefono_socio: telefonoSocio,
      };
    } else if (tipoUsuario === "admin") {
      url = "http://localhost:5000/registro/administrador";
      body = {
        correo: email,
        contrasena: password,
        nombre,
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
    <div className="container">
  <div className="form-box">
    <h1 className="title">Crear cuenta</h1>

    <label>Tipo de usuario</label>
    <select
      value={tipoUsuario}
      onChange={(e) => setTipoUsuario(e.target.value)}
    >
      <option value="admin">Administrador</option>
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
        <button
          className="toggle-btn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Ocultar" : "Mostrar"}
        </button>
      </div>
    </div>

    <div className="input-group">
      <label>Nombre completo</label>
      <input
        type="text"
        placeholder="Tu nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
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
        </div>

        <div className="input-group">
          <label>Teléfono Socio</label>
          <input
            type="text"
            value={telefonoSocio}
            onChange={(e) => setTelefonoSocio(e.target.value)}
          />
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
        </div>

        <div className="input-group">
          <label>Carrera</label>
          <input
            type="text"
            value={carrera}
            onChange={(e) => setCarrera(e.target.value)}
          />
        </div>

        <div className="input-group">
      <label>Semestre</label>
      <input
        type="number"
        value={semestre}
        onChange={(e) => setSemestre(e.target.value)}
        min="1" // Puedes limitar el número mínimo
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
