const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "servicio_social"
});

db.connect((err) => {
    if (err) {
        console.error("❌ Error al conectar a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a MySQL");
});

// Registro de alumno
app.post('/registro/alumno', (req, res) => {
    const { correo, contrasena, nombre, matricula, carrera, semestre, id_campus, doble_titulacion, candidato_graduar, telefono } = req.body;

    if (!correo || !contrasena || !nombre || !matricula || !carrera || !semestre || telefono === undefined || doble_titulacion === undefined || candidato_graduar === undefined) {
        return res.status(400).json({ message: 'Faltan datos' });
    }

    bcrypt.hash(contrasena, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Error al encriptar contraseña' });

        db.query(
            'INSERT INTO estudiante (correo, contrasena, nombre, matricula, carrera, semestre, doble_titulacion, id_campus, candidato_graduar, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)',
            [correo, hash, nombre, matricula, carrera, semestre, doble_titulacion, id_campus, candidato_graduar, telefono],
            (err, result) => {
                if (err) {
                    console.error('Error al registrar alumno:', err);
                    return res.status(500).json({ message: 'Error al registrar al alumno' });
                }
                res.json({ message: 'Alumno registrado exitosamente' });
            }
        );
    });
});

// Registro de administrador
app.post('/registro/administrador', (req, res) => {
    const { correo, contrasena, nombre } = req.body;

    bcrypt.hash(contrasena, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Error al encriptar contraseña' });

        db.query(
            'INSERT INTO Administrador (correo, contrasena, nombre) VALUES (?, ?, ?)',
            [correo, hash, nombre],
            (err, result) => {
                if (err) {
                    console.error('Error al registrar administrador:', err);
                    return res.status(500).json({ message: 'Error al registrar administrador' });
                }
                res.json({ message: 'Administrador registrado exitosamente' });
            }
        );
    });
});

// Registro de socio formador
app.post('/registro/socio', (req, res) => {
    const { correo, contrasena, nombre, tipo_socio, telefono_socio } = req.body;

    bcrypt.hash(contrasena, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Error al encriptar contraseña' });

        db.query(
            'INSERT INTO Socio (correo, contrasena, nombre, status, tipo_socio, telefono_socio) VALUES (?, ?, ?, ?, ?, ?)',
            [correo, hash, nombre, 'pendiente', tipo_socio, telefono_socio],
            (err, result) => {
                if (err) {
                    console.error('Error al registrar socio:', err);
                    return res.status(500).json({ message: 'Error al registrar socio' });
                }
                res.json({ message: 'Socio registrado exitosamente' });
            }
        );
    });
});

// Obtener socios pendientes
app.get('/socio/pendiente', (req, res) => {
    db.query('SELECT id_socio, nombre, correo, status FROM Socio WHERE status = "pendiente"', (err, results) => {
      if (err) {
        console.error('Error al obtener socios pendientes:', err);
        return res.status(500).json({ message: 'Error al obtener socios' });
      }
      res.json(results);
    });
  });
  
  // Actualizar el status de un socio
  app.put('/socio/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    db.query('UPDATE Socio SET status = ? WHERE id_socio = ?', [status, id], (err, result) => {
      if (err) {
        console.error('Error al actualizar el status:', err);
        return res.status(500).json({ message: 'Error al actualizar status' });
      }
      res.json({ message: 'Status actualizado correctamente' });
    });
  });

  app.post('/login', (req, res) => {
    const { correo, contrasena } = req.body;

    const usuarios = [
        { tabla: 'Estudiante' },
        { tabla: 'Administrador' },
        { tabla: 'Socio' }
    ];

    let index = 0;

    const buscarUsuario = () => {
        if (index >= usuarios.length) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const { tabla } = usuarios[index];

        db.query(`SELECT * FROM ${tabla} WHERE correo = ?`, [correo], (err, results) => {
            if (err) {
                console.error(`❌ Error buscando en ${tabla}:`, err);
                return res.status(500).json({ message: 'Error del servidor' });
            }

            if (results.length === 0) {
                index++;
                buscarUsuario();
            } else {
                const usuario = results[0];

                // Si es socio y su status no es "aceptado", rechazar login
                if (tabla === 'Socio' && usuario.status !== 'aceptado') {
                    return res.status(403).json({ message: 'Tu cuenta aún no ha sido aceptada' });
                }

                bcrypt.compare(contrasena, usuario.contrasena, (err, esValido) => {
                    if (err) return res.status(500).json({ message: 'Error al verificar contraseña' });

                    if (esValido) {
                        return res.json({
                            message: 'Login exitoso',
                            tipo: tabla.toLowerCase(), // estudiante, administrador, socio
                            datos: usuario
                        });
                    } else {
                        return res.status(401).json({ message: 'Contraseña incorrecta' });
                    }
                });
            }
        });
    };

    buscarUsuario();
});


// Obtener todos los usuarios
app.get('/administradores', (req, res) => {
    db.query('SELECT * FROM Administrador', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error al obtener administradores' });
        res.json(results);
    });
});

app.get('/socios', (req, res) => {
    db.query('SELECT * FROM Socio', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error al obtener socios' });
        res.json(results);
    });
});

app.get('/estudiantes', (req, res) => {
    db.query('SELECT * FROM Estudiante ', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error al obtener estudiantes' });
        res.json(results);
    });
});

app.get('/proyectos', (req, res) => {
    db.query('SELECT * FROM Proyecto WHERE status_proyecto = "pendiente"', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error al obtener proyectos' });
        res.json(results);
    });
});

// Actualizar el status de un proyecto
app.put('/proyecto/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    db.query('UPDATE Proyecto SET status_proyecto = ? WHERE id_proyecto = ?', [status, id], (err, result) => {
      if (err) {
        console.error('Error al actualizar el status:', err);
        return res.status(500).json({ message: 'Error al actualizar status' });
      }
      res.json({ message: 'Status actualizado correctamente' });
    });
  });

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
