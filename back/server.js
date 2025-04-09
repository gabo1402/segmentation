const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
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

