const sqlite3 = require('sqlite3').verbose();

// Ruta de la base de datos
const dbPath = __dirname + '/casino.db';

// Conexión a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos SQLite');
    }
});

// Crear tablas si no existen
db.serialize(() => {
    // Crear tabla de jugadores
    db.run(`
        CREATE TABLE IF NOT EXISTS jugadores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            fecha_ingreso DATE DEFAULT CURRENT_DATE
        )
    `);

    // Crear tabla de jugadas
    db.run(`
        CREATE TABLE IF NOT EXISTS jugadas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            jugador_id INTEGER,
            ganancias REAL,
            perdidas REAL,
            lugar TEXT,
            fecha DATE DEFAULT CURRENT_DATE,
            FOREIGN KEY (jugador_id) REFERENCES jugadores(id)
        )
    `);
});

// Exportar la conexión
module.exports = db;