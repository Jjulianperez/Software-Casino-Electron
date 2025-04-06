const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./src/database/db');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
        }
    });

    win.loadFile('src/index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Manejar el evento de agregar jugador
ipcMain.handle('agregar-jugador', async (event, jugador) => {
    return new Promise((resolve, reject) => {
        const { nombre } = jugador;
        db.run(`INSERT INTO jugadores (nombre) VALUES (?)`,
            [nombre],
            function (err) {
                if (err) {
                    reject({ message: 'Error al agregar el jugador' });
                } else {
                    resolve({ message: 'Jugador agregado exitosamente' });
                }
            });
    });
});

// Manejar el evento de agregar jugada
ipcMain.handle('agregar-jugada', async (event, jugada) => {
    return new Promise((resolve, reject) => {
        const { jugador_id, ganancias, perdidas, lugar } = jugada;
        db.run(`INSERT INTO jugadas (jugador_id, ganancias, perdidas, lugar) VALUES (?, ?, ?, ?)`,
            [jugador_id, ganancias, perdidas, lugar],
            function (err) {
                if (err) {
                    reject({ message: 'Error al agregar la jugada' });
                } else {
                    resolve({ message: 'Jugada agregada exitosamente' });
                }
            });
    });
});

// Manejar el evento de obtener jugadores
ipcMain.handle('obtener-jugadores', async () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM jugadores`, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
});

// Manejar el evento de obtener jugadas de un jugador
ipcMain.handle('obtener-jugadas', async (event, jugador_id) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM jugadas WHERE jugador_id = ? ORDER BY fecha DESC`, [jugador_id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
});