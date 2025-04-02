import { useState } from "react";
import "./Login.css"; 

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container">
      <div className="form-box">
        <h1 className="title">Crea una cuenta</h1>

        <div className="input-group">
          <label>Correo</label>
          <div className="input-box">
            <img src="/src/assets/correo-electronico.png" alt="Email" className="icon" />
            <input
              type="email"
              placeholder="correo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Contraseña</label>
          <div className="input-box">
            <img src="/src/assets/candado.png" alt="Email" className="icon" />
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
              {showPassword ? <img src="/src/assets/ojo.png" alt="Email" className="icon" /> : <img src="/src/assets/ojo (1).png" alt="Email" className="icon" />}
            </button>
          </div>
        </div>

        <button className="signup-btn">Crear cuenta</button>

        <p className="login-text">
          - o -
        </p>
        

        <p className="login-text">
          ¿Ya tienes una cuenta? <a href="#">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}
