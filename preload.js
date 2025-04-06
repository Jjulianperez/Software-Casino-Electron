const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    agregarJugador: (jugador) => ipcRenderer.invoke('agregar-jugador', jugador),
    agregarJugada: (jugada) => ipcRenderer.invoke('agregar-jugada', jugada),
    obtenerJugadores: () => ipcRenderer.invoke('obtener-jugadores'),
    obtenerJugadas: (jugador_id) => ipcRenderer.invoke('obtener-jugadas', jugador_id)
});