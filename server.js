const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const db = new sqlite3.Database('./gastos.db', (err) => {
    if (err) console.error("Error conectando a la BD:", err.message);
    else {
        console.log("Conectado a SQLite.");
        db.run(`CREATE TABLE IF NOT EXISTS registros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            concepto TEXT,
            descripcion TEXT,
            monto REAL,
            fecha TEXT,
            hora TEXT,
            tipo TEXT,
            metodo TEXT,
            comprobante TEXT
        )`);
    }
});

app.post('/api/gastos', upload.single('archivo'), (req, res) => {
    // 1. Extraemos los datos que envía el frontend
    const { concepto, descripcion, monto, fecha, hora, tipo, metodo } = req.body;
    
    // 2. VALIDACIÓN ESTRICTA (Seguridad del Backend)
    // Si alguno de estos campos es null, undefined o está vacío (''), bloqueamos la petición.
    if (!concepto || !descripcion || !monto || !fecha || !hora || !tipo || !metodo) {
        return res.status(400).json({ error: "Faltan datos obligatorios. Petición rechazada." });
    }

    // Validamos que el monto sea realmente un número y sea mayor a cero
    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
        return res.status(400).json({ error: "El monto es inválido o menor/igual a cero." });
    }

    // 3. Proceso normal si pasa las validaciones
    const rutaComprobante = req.file ? `/uploads/${req.file.filename}` : null;

    db.run(`INSERT INTO registros (concepto, descripcion, monto, fecha, hora, tipo, metodo, comprobante) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [concepto, descripcion, montoNum, fecha, hora, tipo, metodo, rutaComprobante], 
        function(err) {
            // El manejo de (err) aquí actúa como tu "catch", evitando que el servidor crashee si SQLite falla
            if (err) return res.status(500).json({error: "Error interno de la base de datos: " + err.message});
            
            res.json({ mensaje: "Gasto guardado exitosamente", id: this.lastID });
    });
});

app.get('/api/gastos', (req, res) => {
    db.all("SELECT * FROM registros ORDER BY fecha DESC, hora DESC", [], (err, rows) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(rows);
    });
});

app.delete('/api/gastos/:id', (req, res) => {
    db.run(`DELETE FROM registros WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({error: err.message});
        res.json({ mensaje: "Gasto eliminado" });
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor API escuchando en el puerto ${port}`);
});