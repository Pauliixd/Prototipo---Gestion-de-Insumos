// prestamos.js
import { obtenerPrestamosPorEstado, actualizarEstadoPrestamo, marcarComoDevuelto } from "./bd.js";
import { crearTablaGeneral } from "./funciones.js";

// ELEMENTOS HTML (asegurate que los IDs existan en tu prestamos.html)
const contenedorActivos = document.getElementById("prestamosActivos");
const contenedorMorosos = document.getElementById("prestamosMorosos");
const contenedorHistorial = document.getElementById("prestamosHistorial");

const columnas = [
  { clave: "codigo", texto: "Código" },
  { clave: "insumo", texto: "Insumo" },
  { clave: "destinatario", texto: "Destinatario" },
  { clave: "fecha", texto: "Fecha" },
  { clave: "estado", texto: "Estado" },
];

function renderizarTablas() {
  const { activos, morosos, devueltos } = obtenerPrestamosPorEstado();

  contenedorActivos.innerHTML = "";
  contenedorMorosos.innerHTML = "";
  contenedorHistorial.innerHTML = "";

  // ACTIVOS
  if (activos.length > 0) {
    contenedorActivos.appendChild(
      crearTablaGeneral(activos, columnas, {
        acciones: (prestamo) => {
          const div = document.createElement("div");

          const btnDevolver = document.createElement("button");
          btnDevolver.className = "btn btn-success btn-sm";
          btnDevolver.textContent = "Marcar devuelto";
          btnDevolver.addEventListener("click", () => {
            if (!confirm("Marcar este préstamo como devuelto?")) return;
            marcarComoDevuelto(prestamo.codigo);
            renderizarTablas();
          });

          const btnMoroso = document.createElement("button");
          btnMoroso.className = "btn btn-warning btn-sm ms-2";
          btnMoroso.textContent = "Marcar moroso";
          btnMoroso.addEventListener("click", () => {
            if (!confirm("Marcar este préstamo como moroso?")) return;
            actualizarEstadoPrestamo(prestamo.codigo, "moroso");
            renderizarTablas();
          });

          div.append(btnDevolver, btnMoroso);
          return div;
        }
      })
    );
  } else {
    contenedorActivos.innerHTML = "<p class='text-muted text-center'>No hay préstamos activos.</p>";
  }

  // MOROSOS
  if (morosos.length > 0) {
    contenedorMorosos.appendChild(
      crearTablaGeneral(morosos, columnas, {
        acciones: (prestamo) => {
          const btnDevolver = document.createElement("button");
          btnDevolver.className = "btn btn-success btn-sm";
          btnDevolver.textContent = "Marcar devuelto";
          btnDevolver.addEventListener("click", () => {
            if (!confirm("Marcar este préstamo como devuelto?")) return;
            marcarComoDevuelto(prestamo.codigo);
            renderizarTablas();
          });
          return btnDevolver;
        }
      })
    );
  } else {
    contenedorMorosos.innerHTML = "<p class='text-muted text-center'>No hay préstamos morosos.</p>";
  }

  // HISTORIAL (devueltos)
  if (devueltos.length > 0) {
    contenedorHistorial.appendChild(crearTablaGeneral(devueltos, columnas));
  } else {
    contenedorHistorial.innerHTML = "<p class='text-muted text-center'>No hay préstamos devueltos.</p>";
  }
}

// Inicializar
document.addEventListener("DOMContentLoaded", renderizarTablas);
