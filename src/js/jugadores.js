//formularios
const agregar= document.getElementById('form-agregar');
const newjugada= document.getElementById('form-jugador');

//lugar donde se van a agregar los jugadores de manera dinamica
const jugadoresContenedor = document.getElementById('jugadores-contenedor');
const jugadasLista = document.getElementById('jugadas-lista');


//funcion para agregar un nuevo jugador a la base datos
agregar.addEventListener('submit', async (e) =>{
    e.preventDefault();

    const nombre = document.getElementById('nombre').value; 

     try{
        const responde= await window.api.agregarJugador({nombre});
        alert(responde.message);
        cargarJugadores();
     }
     catch (error){
        console.log(error);
        alert("Error al agregar un nuevo jugador");
     };
});

newjugada.addEventListener('submit', async (e) =>{
    e.preventDefault();

    const jugador_id= document.getElementById('jugador-id').value;
    const ganancias = document.getElementById('ganancias').value;
    const perdidas = document.getElementById('perdidas').value;
    const lugar = document.getElementById('lugar').value;

    try{
        const responde= await window.api.agregarJugada({jugador_id, ganancias, perdidas, lugar});
        alert(responde.message);
        cargarJugadas(jugador_id);
     }
     catch (error){
        console.log(error);
        alert("Error al actualizar la jugada");
     };

});

//Mostart los jugadores de la base de datos
async function cargarJugadores() {
    try {
        const jugadores= await window.api.obtenerJugadores();
        jugadoresContenedor.innerHTML= '';//dejo vacio para que al cargar un nuevo jugador se muestre en la lista de jugadores xd
        jugadores.forEach(jugador => {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('jugador-card');

            //MUESNTRO RESULATADO DE LOS JUGADORES
            tarjeta.innerHTML =`
            <h3>${jugador.nombre}</h3>
            <p>Fecha de Ingreso: ${jugador.fecha}</p>
            <button class="ver-jugadas" data-id="${jugador.id}">Ver Jugadas</button>
            <button class="ver-form" data-id="${jugador.id}">Agregar nuevo historial</button>
        `;

        jugadoresContenedor.appendChild(tarjeta);

            // Agregar eventos a los botones dentro de cada tarjeta
            const verJugadasBtn = tarjeta.querySelector('.ver-jugadas');
            verJugadasBtn.addEventListener('click', async () => {
                cargarJugadas(jugador.id);
            });

            const verFormBtn = tarjeta.querySelector('.ver-form');
            verFormBtn.addEventListener('click', () => {
                document.getElementById('jugador-id').value = jugador.id;
                document.getElementById('form-jugador').style.display = 'block';
            });
        });

    } catch (error) {
        console.error(error);
        alert('Error al cargar los jugadores de jugadodes.js');
    }
}
//agrege el boton para cerrar la ventana
const cerrarHistorialBtn = document.getElementById('cerrar-historial');
cerrarHistorialBtn.addEventListener('click', () => {
    const respuesta = document.querySelector('.contenedor-rta');
    respuesta.style.display = 'none';
});

//cargar jugadas en "Ver jugadas"
async function cargarJugadas(jugador_id) {
    const respuesta = document.querySelector('.contenedor-rta');
    const jugadorNombre = document.getElementById('jugador-nombre');
    try {
        const jugadas = await window.api.obtenerJugadas(jugador_id);
        const jugadores = await window.api.obtenerJugadores();
        const jugador = jugadores.find(j => j.id === jugador_id);

        if (jugador) {
            jugadorNombre.textContent = `Historial de jugadas de ${jugador.nombre}`;
        }

        jugadasLista.innerHTML = '';

        let totalGanancias = 0;
        let totalPerdidas = 0;

        jugadas.forEach(jugada => {
            totalGanancias += jugada.ganancias;
            totalPerdidas += jugada.perdidas;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="${jugada.ganancias > 0 ? 'gano' : ''}">${jugada.ganancias}</td>
                <td class="${jugada.perdidas < 0 ? 'perdio' : ''}">${jugada.perdidas}</td>
                <td>${jugada.lugar}</td>
                <td>${jugada.fecha}</td>
            `;
            jugadasLista.appendChild(row);
        });

        // Agregar fila de totales
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td class="gano">${totalGanancias}</td>
            <td class="perdio">${totalPerdidas}</td>
            <td colspan="2">Totales</td>
        `;
        jugadasLista.appendChild(totalRow);

        respuesta.style.animation = 'aparecer 1s forwards';
        respuesta.style.display = 'block';
    } catch (error) {
        console.error(error);
        alert('Error al cargar las jugadas');
    }
}

//validar formularios




window.addEventListener('DOMContentLoaded', cargarJugadores);
