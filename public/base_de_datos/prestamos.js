// prestamos.js
import { obtenerPrestamosPorEstado, actualizarEstadoPrestamo, marcarComoDevuelto } from "./bd.js";
import { crearTablaGeneral, buscarInsumo } from "./funciones.js";

// ELEMENTOS HTML (asegurate que los IDs existan en tu prestamos.html)
const contenedorActivos = document.getElementById("prestamosActivos");
const contenedorMorosos = document.getElementById("prestamosMorosos");
const contenedorHistorial = document.getElementById("prestamosHistorial");
const inputBuscar = document.getElementById("inputBuscar");

const columnas = [
  // AHORA MUESTRA EL CODIGO DEL INSUMO
  { clave: "codigoInsumo", texto: "Código de Insumo" }, 
  { clave: "insumo", texto: "Insumo" },
  { clave: "destinatario", texto: "Destinatario" },
  { clave: "fecha", texto: "Fecha" },
  { clave: "estado", texto: "Estado" },
];

function renderizarTablas() {
  const { activos, morosos, devueltos } = obtenerPrestamosPorEstado();

  const textoBusqueda = inputBuscar.value.trim().toLowerCase();

  // filtra solo por destinatario
  function filtrarPorDestinatario(lista) {
    if (textoBusqueda === "") return lista;
    return lista.filter(p => 
      p.destinatario && p.destinatario.toLowerCase().includes(textoBusqueda)
    );
  }

  const activosFiltrados = filtrarPorDestinatario(activos);
  const morososFiltrados = filtrarPorDestinatario(morosos);
  const devueltosFiltrados = filtrarPorDestinatario(devueltos);

  // Limpiar contenedores
  contenedorActivos.innerHTML = "";
  contenedorMorosos.innerHTML = "";
  contenedorHistorial.innerHTML = "";
  
  // ACTIVOS
  if (activosFiltrados.length > 0) {
    contenedorActivos.appendChild(
      crearTablaGeneral(activosFiltrados, columnas, {
        acciones: (prestamo) => {
          const div = document.createElement("div");
          div.className = "btn-group btn-group-sm";

          const btnDevolver = document.createElement("button");
          btnDevolver.className = "btn btn-success btn-sm";
          btnDevolver.textContent = "Marcar devuelto";
          btnDevolver.addEventListener("click", () => {
            if (!confirm("¿Marcar este préstamo como devuelto?")) return;
            // Usa el ID de TRANSACCIÓN para la gestión
            marcarComoDevuelto(prestamo.idTransaccion); 
            renderizarTablas();
          });

          const btnMoroso = document.createElement("button");
          btnMoroso.className = "btn btn-warning btn-sm";
          btnMoroso.textContent = "Marcar moroso";
          btnMoroso.addEventListener("click", () => {
             // Usa el ID de TRANSACCIÓN para la gestión
            actualizarEstadoPrestamo(prestamo.idTransaccion, "moroso"); 
            renderizarTablas();
          });

          div.append(btnDevolver, btnMoroso);
          return div;
        },
      })
    );
  } else {
    contenedorActivos.innerHTML = "<p class='text-muted text-center'>No hay préstamos activos.</p>";
  }

  // MOROSOS
  if (morososFiltrados.length > 0) {
    contenedorMorosos.appendChild(
      crearTablaGeneral(morososFiltrados, columnas, {
        acciones: (prestamo) => {
          const btnDevolver = document.createElement("button");
          btnDevolver.className = "btn btn-success btn-sm";
          btnDevolver.textContent = "Marcar devuelto";
          btnDevolver.addEventListener("click", () => {
            if (!confirm("¿Marcar este préstamo como devuelto?")) return;
            // Usa el ID de TRANSACCIÓN para la gestión
            marcarComoDevuelto(prestamo.idTransaccion); 
            renderizarTablas();
          });
          return btnDevolver;
        }
      })
    );
  } else {
    contenedorMorosos.innerHTML = "<p class='text-muted text-center'>No hay préstamos morosos.</p>";
  }

  // HISTORIAL
  if (devueltosFiltrados.length > 0) {
    contenedorHistorial.appendChild(crearTablaGeneral(devueltosFiltrados, columnas));
  } else {
    contenedorHistorial.innerHTML = "<p class='text-muted text-center'>No hay historial de préstamos devueltos.</p>";
  }
}

// Renderizar al cargar
renderizarTablas();

// Evento de búsqueda
inputBuscar.addEventListener("input", () => {
  renderizarTablas();
});