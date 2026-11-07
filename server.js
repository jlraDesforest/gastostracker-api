const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middlewares obligatorios
app.use(cors());
app.use(express.json()); // Permite recibir datos en formato JSON
app.use(express.static('public'));


// 1. Conexión a SQLite y creación de tabla
const db = new sqlite3.Database('./gastos.db', (err) => {
    if (err) console.error("Error conectando a la BD:", err.message);
    else {
        console.log("Conectado a SQLite.");
        db.run(`CREATE TABLE IF NOT EXISTS registros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            concepto TEXT,
            monto REAL,
            fecha TEXT,
            tipo TEXT
        )`);
    }
});

// 2. CREATE: Ruta para guardar un nuevo gasto (POST)
app.post('/api/gastos', (req, res) => {
    const { concepto, monto, fecha, tipo } = req.body;
    db.run(`INSERT INTO registros (concepto, monto, fecha, tipo) VALUES (?, ?, ?, ?)`, 
        [concepto, monto, fecha, tipo], 
        function(err) {
            if (err) return res.status(500).json({error: err.message});
            res.json({ mensaje: "Gasto guardado exitosamente", id: this.lastID });
    });
});

// 3. READ: Ruta para ver toda la tabla (GET)
app.get('/api/gastos', (req, res) => {
    db.all("SELECT * FROM registros", [], (err, rows) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(rows);
    });
});

// 4. UPDATE: Ruta para editar un gasto (PUT)
app.put('/api/gastos/:id', (req, res) => {
    const { concepto, monto, fecha, tipo } = req.body;
    db.run(`UPDATE registros SET concepto = ?, monto = ?, fecha = ?, tipo = ? WHERE id = ?`,
        [concepto, monto, fecha, tipo, req.params.id],
        function(err) {
            if (err) return res.status(500).json({error: err.message});
            res.json({ mensaje: "Gasto actualizado", cambios: this.changes });
    });
});

// 5. DELETE: Ruta para borrar un gasto (DELETE)
app.delete('/api/gastos/:id', (req, res) => {
    db.run(`DELETE FROM registros WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(500).json({error: err.message});
        res.json({ mensaje: "Gasto eliminado", cambios: this.changes });
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor API escuchando en el puerto ${port}`);
});