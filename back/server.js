const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv")

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
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
    const { correo, contraseña, nombre, matricula, id_carrera, semestre, id_campus, doble_titulacion, candidato_graduar, telefono } = req.body;

    if (!correo || !contraseña || !nombre || !matricula || !id_carrera || !semestre || telefono === undefined || doble_titulacion === undefined || candidato_graduar === undefined) {
        return res.status(400).json({ message: 'Faltan datos' });
    }

    bcrypt.hash(contraseña, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Error al encriptar contraseña' });

        db.query(
            'INSERT INTO estudiante (correo, contraseña, nombre, matricula, id_carrera, semestre, doble_titulacion, id_campus, candidato_graduar, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)',
            [correo, hash, nombre, matricula, id_carrera, semestre, doble_titulacion, id_campus, candidato_graduar, telefono],
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
    const { correo, contraseña, nombre } = req.body;

    bcrypt.hash(contraseña, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Error al encriptar contraseña' });

        db.query(
            'INSERT INTO Administrador (correo, contraseña, nombre) VALUES (?, ?, ?)',
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

app.post('/registro/socio', (req, res) => {
    const {
        correo,
        contraseña,
        nombre,
        tipo_socio, // "Estudiante" o "Entidad"
        telefono_socio,
        redes_sociales,
        notificaciones_socio,
        // Datos para Socio_Estudiante
        id_carrera,
        matricula,
        semestre_acreditado,
        correo_institucional,
        correo_alternativo,
        ine,
        logo,
        // Datos para Socio_Entidad
        nombre_entidad,
        mision,
        vision,
        objetivos,
        objetivo_ods_socio,
        poblacion,
        numero_beneficiarios_socio,
        nombre_responsable,
        puesto_responsable,
        correo_responsable,
        direccion_entidad,
        horario_entidad,
        correo_entidad,
        correo_responsable_general,
        telefono_entidad
    } = req.body;

    if (!correo || !contraseña || !nombre || !tipo_socio) {
        return res.status(400).json({ message: 'Faltan datos obligatorios de Socio' });
    }

    bcrypt.hash(contraseña, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Error al encriptar contraseña' });

        const socioQuery = `
            INSERT INTO Socio (correo, contraseña, nombre, status, tipo_socio, telefono_socio, redes_sociales, notificaciones_socio)
            VALUES (?, ?, ?, 'pendiente', ?, ?, ?, ?)
        `;

        const socioValues = [
            correo,
            hash,
            nombre,
            tipo_socio,
            telefono_socio || null,
            redes_sociales || null,
            notificaciones_socio || null
        ];

        db.query(socioQuery, socioValues, (err, result) => {
            if (err) {
                console.error('Error al registrar socio:', err);
                return res.status(500).json({ message: 'Error al registrar socio' });
            }

            const id_socio = result.insertId;

            if (tipo_socio === 'Estudiante') {
                const estudianteQuery = `
                    INSERT INTO Socio_Estudiante (id_socio, id_carrera, matricula, semestre_acreditado, correo_institucional, correo_alternativo, ine, logo)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const estudianteValues = [
                    id_socio,
                    id_carrera,
                    matricula,
                    semestre_acreditado,
                    correo_institucional,
                    correo_alternativo,
                    ine,
                    logo
                ];
                db.query(estudianteQuery, estudianteValues, (err) => {
                    if (err) {
                        console.error('Error al registrar socio estudiante:', err);
                        return res.status(500).json({ message: 'Error al registrar socio estudiante' });
                    }
                    return res.json({ message: 'Socio estudiante registrado exitosamente' });
                });

            } else if (tipo_socio === 'Entidad') {
                const entidadQuery = `
                    INSERT INTO Socio_Entidad (
                        id_socio, nombre_entidad, mision, vision, objetivos, objetivo_ods_socio,
                        poblacion, numero_beneficiarios_socio, nombre_responsable, puesto_responsable,
                        correo_responsable, direccion_entidad, horario_entidad, correo_entidad,
                        correo_responsable_general, telefono_entidad
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const entidadValues = [
                    id_socio,
                    nombre_entidad,
                    mision,
                    vision,
                    objetivos,
                    objetivo_ods_socio,
                    poblacion,
                    numero_beneficiarios_socio,
                    nombre_responsable,
                    puesto_responsable,
                    correo_responsable,
                    direccion_entidad,
                    horario_entidad,
                    correo_entidad,
                    correo_responsable_general,
                    telefono_entidad
                ];
                db.query(entidadQuery, entidadValues, (err) => {
                    if (err) {
                        console.error('Error al registrar socio entidad:', err);
                        return res.status(500).json({ message: 'Error al registrar socio entidad' });
                    }
                    return res.json({ message: 'Socio entidad registrado exitosamente' });
                });

            } else {
                return res.status(400).json({ message: 'Tipo de socio no válido' });
            }
        });
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
    const { correo, contraseña } = req.body;

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

                bcrypt.compare(contraseña, usuario.contraseña, (err, esValido) => {
                    if (err) return res.status(500).json({ message: 'Error al verificar contraseña' });

                    if (esValido) {
                        return res.json({
                            message: 'Login exitoso',
                            tipo: tabla.toLowerCase(), 
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

//obtener socios aprobados
app.get('/socio/aprobados', (req, res) => {
    db.query('SELECT id_socio, nombre, correo, tipo_socio FROM Socio WHERE status = "Aceptado"', (err, results) => {
      if (err) {
        console.error('Error al obtener socios Aceptados:', err);
        return res.status(500).json({ message: 'Error al obtener socios' });
      }
      res.json(results);
    });
  });

  // Obtener info individual del socio
app.get('/socio/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Socio WHERE id_socio = ?', [id], (err, results) => {
      if (err) {
        console.error('Error al obtener socio:', err);
        return res.status(500).json({ message: 'Error del servidor' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Socio no encontrado' });
      }
      res.json(results[0]);
    });
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
    })
    console.log("✅ Conectado a MySQL");
});


app.get("/data", (req, res) => {
    const sql = "SELECT * FROM status_tabla"; 
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error al obtener datos:", err);
            res.status(500).json({ error: "Error al obtener datos" });
            return;
        }
        res.json(results); 

    });
});

// Obtener proyectos pendientes
app.get('/proyectos', (req, res) => {
    db.query('SELECT * FROM Proyecto JOIN socio ON proyecto.id_socio = socio.id_socio JOIN campus ON proyecto.id_campus = campus.id_campus JOIN ods ON proyecto.id_ods = ods.id_ods WHERE status_proyecto = "pendiente"', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error al obtener proyectos' });
        res.json(results);
    });
});

// Obtener postulaciones alumnos pendientes
app.get('/postulaciones_alumnos', (req, res) => {
    db.query('SELECT * FROM Postulacion JOIN Proyecto ON Postulacion.id_proyecto = Proyecto.id_proyecto JOIN estudiante ON postulacion.id_estudiante = estudiante.id_estudiante WHERE postulacion.status = "pendiente"', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error al obtener postulaciones' });
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

  // Actualizar el status de una postulacion de alumnos
  app.put('/postulaciones_alumnos/:id_proyecto/:id_estudiante/status', (req, res) => {
    const { id_proyecto, id_estudiante } = req.params;
    const { status } = req.body;

    db.query('UPDATE Postulacion SET status = ? WHERE id_proyecto = ? AND id_estudiante = ?', [status, id_proyecto, id_estudiante], (err, result) => {
        if (err) {
            console.error('Error al actualizar el status:', err);
            return res.status(500).json({ message: 'Error al actualizar status' });
        }
        res.json({ message: 'Status actualizado correctamente' });
    });
});


// Editar valores del proyecto
  app.put('/proyecto/:id/editar', (req, res) => {
    const { id } = req.params;  
    const { columna, nuevoValor } = req.body;  
    if (!columna || nuevoValor === undefined) {
        return res.status(400).json({ message: 'Faltan datos para actualizar' });
    }
    const sql = `UPDATE Proyecto SET \`${columna}\` = ? WHERE id_proyecto = ?`;
    db.query(sql, [nuevoValor, id], (err, result) => {
        if (err) {
            console.error('❌ Error al actualizar proyecto:', err);
            return res.status(500).json({ message: 'Error al actualizar el proyecto' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        res.json({ message: 'Proyecto actualizado exitosamente' });
    });
});

// Editar valores de las postulaciones
app.put('/postulaciones_alumnos/:id_proyecto/:id_estudiante/editar', (req, res) => {
    const { id_proyecto, id_estudiante } = req.params;  
    const { columna, nuevoValor } = req.body;  
    
    if (!columna || nuevoValor === undefined) {
        return res.status(400).json({ message: 'Faltan datos para actualizar' });
    }

    const sql = `UPDATE Postulacion SET \`${columna}\` = ? WHERE id_proyecto = ? AND id_estudiante = ?`;

    db.query(sql, [nuevoValor, id_proyecto, id_estudiante], (err, result) => {
        if (err) {
            console.error('❌ Error al actualizar postulacion:', err);
            return res.status(500).json({ message: 'Error al actualizar la postulacion' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Postulacion no encontrada' });
        }
        res.json({ message: 'Postulacion actualizada exitosamente' });
    });
});





const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

