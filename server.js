const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'gastostracker_secreto_2026_!@#'; // Llave maestra del servidor

// Configuraciones básicas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de Multer para subir archivos (comprobantes)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// ==========================================
// 1. CONEXIÓN Y CREACIÓN DE BASE DE DATOS
// ==========================================
const db = new sqlite3.Database('./gastos.db', (err) => {
    if (err) console.error('Error al conectar con SQLite:', err.message);
    else console.log('Conectado a la base de datos SQLite.');
});

// Crear tablas con la nueva arquitectura multiusuario
db.serialize(() => {
    // Tabla de Usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rol TEXT DEFAULT 'usuario'
    )`);

    // Tabla de Registros (Gastos) - Ahora vinculada a un usuario_id
    db.run(`CREATE TABLE IF NOT EXISTS registros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        concepto TEXT NOT NULL,
        descripcion TEXT,
        monto REAL NOT NULL,
        fecha TEXT NOT NULL,
        hora TEXT NOT NULL,
        archivo TEXT,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`);
});

// ==========================================
// 2. MIDDLEWARE DE SEGURIDAD (El Guardián)
// ==========================================
function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Acceso denegado. No hay token.' });

    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Token inválido o expirado.' });
        req.usuario = decoded; // Guardamos los datos del usuario en la petición
        next(); // Le permitimos pasar a la ruta solicitada
    });
}

// ==========================================
// 3. RUTAS PÚBLICAS (No requieren Token)
// ==========================================

// Registrar nuevo usuario
app.post('/api/register', async (req, res) => {
    const { nombre, email, password } = req.body;
    
    try {
        // Encriptar la contraseña (Regla de negocio: nunca guardar texto plano)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = `INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)`;
        db.run(sql, [nombre, email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ error: 'El correo ya está registrado.' });
                }
                return res.status(500).json({ error: 'Error al registrar usuario.' });
            }
            res.json({ mensaje: 'Usuario creado con éxito', id: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});

// Iniciar sesión
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    db.get(sql, [email], async (err, usuario) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor.' });
        if (!usuario) return res.status(400).json({ error: 'Correo o contraseña incorrectos.' });

        // Comparar contraseña ingresada con la encriptada en la BD
        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) return res.status(400).json({ error: 'Correo o contraseña incorrectos.' });

        // Generar Token JWT (Carnet de acceso válido por 24 horas)
        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ mensaje: 'Bienvenido', token });
    });
});

// ==========================================
// 4. RUTAS PRIVADAS (Protegidas por verificarToken)
// ==========================================

// Obtener LOS GASTOS DEL USUARIO LOGUEADO
app.get('/api/gastos', verificarToken, (req, res) => {
    // Regla de negocio: Solo devolver donde usuario_id coincida con el token
    const sql = `SELECT * FROM registros WHERE usuario_id = ? ORDER BY id DESC`;
    db.all(sql, [req.usuario.id], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error al obtener registros.' });
        res.json(rows);
    });
});

// Guardar un nuevo gasto
app.post('/api/gastos', verificarToken, upload.single('archivo'), (req, res) => {
    const { concepto, descripcion, monto, fecha, hora } = req.body;
    const archivoPath = req.file ? `/uploads/${req.file.filename}` : null;
    const usuarioId = req.usuario.id; // Extraído del token de forma segura

    const sql = `INSERT INTO registros (usuario_id, concepto, descripcion, monto, fecha, hora, archivo) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [usuarioId, concepto, descripcion, monto, fecha, hora, archivoPath], function(err) {
        if (err) return res.status(500).json({ error: 'Error al guardar el gasto.' });
        res.json({ mensaje: 'Gasto registrado', id: this.lastID });
    });
});

// Borrar un gasto
app.delete('/api/gastos/:id', verificarToken, (req, res) => {
    const idGasto = req.params.id;
    const usuarioId = req.usuario.id;

    // Regla de negocio: Solo puede borrar el gasto si le pertenece a él
    const sql = `DELETE FROM registros WHERE id = ? AND usuario_id = ?`;
    db.run(sql, [idGasto, usuarioId], function(err) {
        if (err) return res.status(500).json({ error: 'Error al eliminar.' });
        if (this.changes === 0) return res.status(403).json({ error: 'No autorizado para borrar este registro.' });
        res.json({ mensaje: 'Registro eliminado', cambios: this.changes });
    });
});

// Iniciar Servidor
app.listen(PORT, () => {
    console.log(`Servidor GastosTracker corriendo en el puerto ${PORT}`);
});