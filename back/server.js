const express = require("express");
const xlsx = require("xlsx");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/data", (req, res) => {
    try {
        const filePath = "data.xlsx"; 
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; 
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]); 

        res.json(data); 
    } catch (error) {
        console.error("Error al leer el archivo", error);
        res.status(500).json({ error: "Error al leer el archivo" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
