// usuarios.js - Maneja el listado y acciones de la tabla de usuarios

import { obtenerUsuarios, eliminarUsuario } from "./bd.js";

import { crearTablaGeneral } from "./funciones.js";

// ELEMENTOS HTML
const usuariosTableBody = document.getElementById("usuariosTableBody");
// Configuración de columnas para la tabla de usuarios.
const columnasUsuarios = [
    { clave: "nombreYApellido", texto: "Nombre y Apellido" },
    { clave: "dni", texto: "DNI" },
    { clave: "email", texto: "Email" },
    { clave: "cargo", texto: "Cargo" },
];

// // Crea los botones "Editar" y "Eliminar" para cada fila de usuario.
function crearBotoneraAcciones(usuario) {
    const div = document.createElement('div');
    div.className = 'btn-group btn-group-sm';


    // Botón Editar
    const btnEditar = document.createElement('button');
    btnEditar.className = 'btn btn-outline-primary';
    btnEditar.innerHTML = '<i class="bi bi-pencil-square"></i>';
    btnEditar.title = 'Editar Usuario';
    btnEditar.addEventListener('click', () => abrirModalEditarUsuario(usuario));
    
    // Botón Eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn btn-outline-danger';
    btnEliminar.innerHTML = '<i class="bi bi-trash"></i>';
    btnEliminar.title = 'Eliminar Usuario';
    btnEliminar.addEventListener('click', () => {
        if (confirm(`¿Seguro que querés eliminar a ${usuario.nombreYApellido}?`)) {
            eliminarUsuario(usuario.codigo)
            renderizarTablaUsuarios();
        }
    });

    div.appendChild(btnEditar);
    div.appendChild(btnEliminar);
    return div;
}
//Se encarga de construir y mostrar la tabla con los datos actualizados
export function renderizarTablaUsuarios() {
    const usuarios = obtenerUsuarios();//aca saca todos los usuarios que contiene
    
    if (usuarios.length > 0) {
        //Si hay usuarios, genera la tabla completa usando la función generica (crearTablaGeneral)
        const tablaCompleta = crearTablaGeneral(usuarios, columnasUsuarios, {
            acciones: crearBotoneraAcciones// para cada fila de usuario crea un boton
        });

        // crearTablaGeneral devuelve un TABLE, obtenemos su TBODY:
        const newTbody = tablaCompleta.querySelector('tbody');

        // Reemplazamos el contenido :)
        usuariosTableBody.innerHTML = newTbody.innerHTML; 
    } else {
        usuariosTableBody.innerHTML = `<tr><td colspan="${columnasUsuarios.length + 1}" class="text-center text-muted">No hay usuarios registrados.</td></tr>`;
    }
}//j




// EVENTOS
renderizarTablaUsuarios();

// Escuchar el evento de altaUser.js para refrescar la tabla
window.addEventListener('usuarioGuardado', renderizarTablaUsuarios);