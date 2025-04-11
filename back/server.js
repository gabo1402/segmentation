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

    password: "", 
    database: "prueba_social" 
});

// Conectar a la base de datos
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
            'INSERT INTO estudiante (correo, contrasena, nombre, matricula, carrera, semestre, doble_titulacion, id_campus, candidato_graduar, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
            'INSERT INTO Socio (correo, contrasena, nombre, tipo_socio, telefono_socio) VALUES (?, ?, ?, ?, ?)',
            [correo, hash, nombre, tipo_socio, telefono_socio],
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

// Login
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
    db.query('SELECT * FROM Estudiante', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error al obtener estudiantes' });
        res.json(results);
    }
    console.log("✅ Conectado a MySQL");
});

// Endpoint para obtener datos de la base de datos
app.get("/data", (req, res) => {
    const sql = "SELECT * FROM status_tabla"; // Cambia 'usuarios' por tu tabla
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error al obtener datos:", err);
            res.status(500).json({ error: "Error al obtener datos" });
            return;
        }
        res.json(results); // Enviar los datos en formato JSON

    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

