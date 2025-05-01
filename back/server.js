const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv")
const jwt = require('jsonwebtoken');

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

// Middleware para verificar el JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Obtén el token del encabezado Authorization

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, no se proporcionó el token' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token
    req.user = verified; // Guarda la información decodificada del token
    next(); // Llama al siguiente middleware o ruta
  } catch (error) {
    res.status(400).json({ message: 'Token inválido' });
  }
};


// Registro de alumno
app.post('/registro/alumno', (req, res) => {
    const { correo, contraseña, nombre, matricula, id_carrera, semestre, id_campus, doble_titulacion, candidato_graduar, telefono } = req.body;

    if (!correo || !contraseña || !nombre || !matricula || !id_carrera || !semestre || telefono === undefined || doble_titulacion === undefined || candidato_graduar === undefined) {
        return res.status(400).json({ message: 'Faltan datos' });
    }
    
    // Validar que el teléfono sea numérico y tenga al menos 10 caracteres
    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(telefono)) {
        return res.status(400).json({ message: 'El teléfono debe ser numérico y tener al menos 10 dígitos' });
    }

    // Validar que el correo no exista
    db.query('SELECT * FROM Estudiante WHERE correo = ?', [correo], (err, result) => {
        if (err) {
        return res.status(500).json({ message: 'Error en la base de datos' });
        }

        if (result.length > 0) {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // Si el correo no existe, validar la contraseña
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(contraseña)) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.' });
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
        
            });
        });
    });
});

// Registro de administrador
app.post('/registro/administrador', (req, res) => {
    const { correo, contraseña, nombre } = req.body;

    // Validar que el correo no exista
    db.query('SELECT * FROM Administrador WHERE correo = ?', [correo], (err, result) => {
        if (err) {
        return res.status(500).json({ message: 'Error en la base de datos' });
        }

        if (result.length > 0) {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // Si el correo no existe, validar la contraseña
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(contraseña)) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.' });
        }

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
            });
        });
    });
});

// Registro de socio formador
app.post('/registro/socio', (req, res) => {
    const { correo, contraseña, nombre, tipo_socio, telefono_socio, redes_sociales, notificaciones_socio } = req.body;

    // Validar que el correo no exista
    db.query('SELECT * FROM Socio WHERE correo = ?', [correo], (err, result) => {
        if (err) {
        return res.status(500).json({ message: 'Error en la base de datos' });
        }

        if (result.length > 0) {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // Si el correo no existe, validar la contraseña
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(contraseña)) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.' });
        }

        bcrypt.hash(contraseña, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: 'Error al encriptar contraseña' });

            db.query(
                'INSERT INTO Socio (correo, contraseña, nombre, status, tipo_socio, telefono_socio, redes_sociales, notificaciones_socio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [correo, hash, nombre, 'pendiente', tipo_socio, telefono_socio, redes_sociales, notificaciones_socio],
                (err, result) => {
                    if (err) {
                        console.error('Error al registrar socio:', err);
                        return res.status(500).json({ message: 'Error al registrar socio' });
                    }
                    res.json({ message: 'Socio registrado exitosamente' });
            });
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

  // Ruta de login
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
              // Generar JWT
              const token = jwt.sign(
                { id: usuario.id_socio, tipo: tabla.toLowerCase() }, // Datos del usuario a incluir
                process.env.JWT_SECRET, // Llave secreta para firmar el token
                { expiresIn: '1h' } // El token expirará en 1 hora
              );
  
              return res.json({
                message: 'Login exitoso',
                token, // Enviar el token al frontend
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



  app.put('/proyecto/:id/editar', (req, res) => {
    const { id } = req.params;  // Obtener el ID del proyecto
    const { columna, nuevoValor } = req.body;  // Obtener la columna y el nuevo valor

    // Verificar que la columna y el nuevo valor están presentes
    if (!columna || nuevoValor === undefined) {
        return res.status(400).json({ message: 'Faltan datos para actualizar' });
    }

    // Consulta SQL para actualizar el proyecto en la base de datos
    const sql = `UPDATE Proyecto SET \`${columna}\` = ? WHERE id_proyecto = ?`;
    db.query(sql, [nuevoValor, id], (err, result) => {
        if (err) {
            console.error('❌ Error al actualizar proyecto:', err);
            return res.status(500).json({ message: 'Error al actualizar el proyecto' });
        }

        // Verificar si no se afectaron filas, lo que significa que no se encontró el proyecto
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        // Si se actualizó correctamente, devolver un mensaje de éxito
        res.json({ message: 'Proyecto actualizado exitosamente' });
    });
});


//Endpoint paginas socio
  
  app.post("/proyecto", (req, res) => {
    const {
        nombre_proyecto,
        modalidad,
        direccion_escrita,
        cupos_disponibles,
        campus,  // Este es el ID del campus
        ods,  // Este es el ID del ODS
        problema_social,
        vulnerabilidad_atendida,
        edad_poblacion,
        zona_poblacion,
        numero_beneficiarios_proyecto,
        objetivo_proyecto,
        acciones_estudiantado,
        valor_proyecto,
        dias_actividades,
        carreras_proyecto,
        habilidades_alumno,
    } = req.body;
  
    // Verificar si los datos requeridos están presentes
    if (!nombre_proyecto || !modalidad || !direccion_escrita || !cupos_disponibles || !campus || !ods) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }
  
    // Consulta SQL para insertar los datos del proyecto en la base de datos
    const query =
      "INSERT INTO Proyecto (status_proyecto, nombre_proyecto, modalidad, direccion_escrita, cupos_disponibles, id_campus, id_ods, problema_social, vulnerabilidad_atendida, edad_poblacion, zona_poblacion, numero_beneficiarios_proyecto, objetivo_proyecto, acciones_estudiantado, valor_proyecto, dias_actividades, carreras_proyecto, habilidades_alumno) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    const values = [
      'pendiente',
      nombre_proyecto,
      modalidad,
      direccion_escrita,
      cupos_disponibles,
      campus,  // Aquí se inserta el ID del campus
      ods,  // Aquí se inserta el ID del ODS
      problema_social,
      vulnerabilidad_atendida,
      edad_poblacion,
      zona_poblacion,
      numero_beneficiarios_proyecto,
      objetivo_proyecto,
      acciones_estudiantado,
      valor_proyecto,
      dias_actividades,
      carreras_proyecto,
      habilidades_alumno,
    ];
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("❌ Error al registrar el proyecto:", err);
        return res.status(500).json({ message: "Error al registrar el proyecto" });
      }
  
      res.status(200).json({ message: "Proyecto creado exitosamente" });
      });
  });
    

  // Obtener campus
  app.get("/campus", (req, res) => {
    db.query("SELECT * FROM Campus", (err, results) => {
      if (err) {
        console.error("❌ Error al obtener campus:", err);
        return res.status(500).json({ message: "Error al obtener campus" });
      }
      res.json(results);
    });
  });
  
  // Obtener ODS
  app.get("/ods", (req, res) => {
    db.query("SELECT * FROM ODS", (err, results) => {
      if (err) {
        console.error("❌ Error al obtener ODS:", err);
        return res.status(500).json({ message: "Error al obtener ODS" });
      }
      res.json(results);
    });
  });

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});