// altaUser.js - Maneja la lógica del formulario de Alta de Usuario

import { obtenerUsuarios, guardarUsuario,guardarArray, obtenerSiguienteCodigo } from './bd.js';

// ELEMENTOS HTML
const formAltaUsuario = document.getElementById("altaUsuarioForm");
const inputNombre = document.getElementById("nombreYApellido");
const inputDni = document.getElementById("dni");
const inputEmail = document.getElementById("email");
const selectCargo = document.getElementById("cargo");
const inputPassword1 = document.getElementById("altaPassword");
const inputPassword2 = document.getElementById("altaPassword2");
const mensajeDiv = document.getElementById("mensaje");
const modalAltaUsuario = new bootstrap.Modal(document.getElementById('modalAltaUsuario')); 

// EVENTO DE SUBMIT DEL FORMULARIO
formAltaUsuario.addEventListener("submit", (e) => {
    e.preventDefault();
    mensajeDiv.textContent = "";

    const nombreYApellido = inputNombre.value.trim();
    const dni = inputDni.value.trim();
    const email = inputEmail.value.trim();
    const cargo = selectCargo.value;
    const password = inputPassword1.value;
    const password2 = inputPassword2.value;

    if (password !== password2) {
        mensajeDiv.textContent = "Las contraseñas no coinciden.";
        return;
    }
    
    // Validar campos (Bootstrap ya hace gran parte con 'required')
    if (!nombreYApellido || !dni || !email || !cargo || !password) {
         mensajeDiv.textContent = "Por favor, completá todos los campos.";
        return;
    }

    // Lógica para guardar el usuario
    const nuevoUsuario = {
        codigo: obtenerSiguienteCodigo(),
        dni: dni,
        nombreYApellido: nombreYApellido,
        email: email,
        cargo: cargo,
        passwordSystem: password, // En un sistema real, esto debería estar hasheado
        active: true,
    };

guardarUsuario(nuevoUsuario); 

// ⚠️ IMPORTANTE: Llamá a la función que dibuja la tabla de usuarios
if (typeof renderizarTablaUsuarios === 'function') {
    renderizarTablaUsuarios(); 
}

modalAlta.hide(); // O el objeto Modal que uses
form.reset();

    const usuarios = obtenerUsuarios(); // Obtener la lista actual de usuarios
    usuarios.push(nuevoUsuario); // Agregar el nuevo usuario
    
    if (guardarArray(usuarios, "usuarios")) { // Usar la clave "usuarios" directamente
        formAltaUsuario.reset();
        modalAltaUsuario.hide();
        alert(`Usuario ${nombreYApellido} registrado con éxito.`);
        
        // Disparar evento para que usuarios.js sepa que debe refrescar la tabla
        window.dispatchEvent(new Event('usuarioGuardado')); 
    } else {
        mensajeDiv.textContent = "Error al intentar guardar el usuario.";
    }
});