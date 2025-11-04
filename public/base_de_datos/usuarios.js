// usuarios.js - Maneja el listado y acciones de la tabla de usuarios

import { obtenerUsuarios, guardarUsuario, actualizarUsuario, eliminarUsuario } from "./bd.js"; 

// ELEMENTOS HTML
const usuariosTableBody = document.getElementById("usuariosTable");

// FUNCIONES
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

function renderizarTablaUsuarios() {
    usuariosTableBody.innerHTML = "";
    const usuarios = obtenerUsuarios();

    usuarios.forEach(user => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${user.nombreYApellido}</td>
            <td>${user.dni}</td>
            <td>${user.email}</td>
            <td>${user.cargo}</td>
            <td class="text-center"></td>
        `;

        // Añadir la botonera de acciones
        const tdAcciones = tr.querySelector('td:last-child');
        tdAcciones.appendChild(crearBotoneraAcciones(user));

        usuariosTableBody.appendChild(tr);
    });
}

function abrirModalEditarUsuario(usuario) {
    // Implementación del modal de edición de usuario
    console.log("Abrir modal de edición para:", usuario.nombreYApellido);
    // Este modal no está en el HTML, se requeriría crearlo si se implementa.
    alert(`Editar usuario: ${usuario.nombreYApellido} (DNI: ${usuario.dni})`);
}


// EVENTOS
renderizarTablaUsuarios();

// Escuchar el evento de altaUser.js para refrescar la tabla
window.addEventListener('usuarioGuardado', renderizarTablaUsuarios);