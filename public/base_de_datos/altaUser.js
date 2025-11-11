// altaUser.js - Maneja la lógica del formulario de Alta de Usuario
//Importa funciones desde otros archivos JS
import { alertaExito, alertaError } from './alerts.js';
import { obtenerUsuarios, guardarUsuario, obtenerSiguienteCodigo } from './bd.js';
import { renderizarTablaUsuarios } from './usuarios.js'

// Trae los elementos de html para manejarlos en js
const formAltaUsuario = document.getElementById("altaUsuarioForm");
const inputNombre = document.getElementById("nombreYApellido");
const inputDni = document.getElementById("dni");
const inputEmail = document.getElementById("email");
const selectCargo = document.getElementById("cargo");
const inputPassword1 = document.getElementById("altaPassword");
const mensajeDiv = document.getElementById("mensaje");
const modalAltaUsuario = new bootstrap.Modal(document.getElementById('modalAltaUsuario'));

//FUNCIONES

// busca si ya existe un usuario con el mismo DNI ( reciclada :) )
function buscarIndicePorDni(array, dni) {
  let i = 0;
  let indice = -1;// valor por defecto -1 significa que no se encontró nada

  if (array.length === 0) {
    // si el array esta vacio retorna -1 directamente
    return indice;
  } else {
    //si hay usuarios entonces recorre el array con el do, hasta encontrarlo
    do {
      if (array[i].dni === dni) {
        indice = i;
      }
      i++;
    } while (indice === -1 && i < array.length);//busca hasta que sea diferente de -1(no encontro)
    //  o terminar el array(que I sea mayor que array.lenght) una de dos 
  }
  return indice;
}



//EVENTOS

// EVENTO DE ALTA DE USUARIO
formAltaUsuario.addEventListener("submit", (e) => {
  e.preventDefault();
  mensajeDiv.textContent = "";//esto limpia los campos anteriores para que no quede todo ya escrito
// designa y obtiene valores que escribe el usuario
  const nombreYApellido = inputNombre.value.trim();
  const dni = inputDni.value.trim();
  const email = inputEmail.value.trim();
  const cargo = selectCargo.value;
  const password = inputPassword1.value;

  // Validaciones básicas que la contraseña sea igual al dni
  if (password !== dni) {
    mensajeDiv.textContent = "La contraseña debe coincidir con el DNI ingresado.";
    return;
  }
//esto verifica que todos los campos esten completos
  if (!nombreYApellido || !dni || !email || !cargo || !password) {
    mensajeDiv.textContent = "Por favor, completá todos los campos.";
    return;
  }

  // Obtener usuarios actuales
  const usuarios = obtenerUsuarios();

  // Verificar si ya existe el usuario por DNI
  if (buscarIndicePorDni(usuarios, dni) !== -1) {
    alertaError('Alta Usuario', 'Ya existe un usuario con ese DNI.');
    return;
  }

  // Crear el nuevo usuario
  const nuevoUsuario = {
    codigo: obtenerSiguienteCodigo(),
    dni: dni,
    nombreYApellido: nombreYApellido,
    email: email,
    cargo: cargo,
    passwordSystem: dni,
    active: true,//lo crea activo
  };

  // Guardar usuario en la BD
    const usuarioGuardado = guardarUsuario(nuevoUsuario);
//si se guardo correctamente limpia el formulario y cierra el modal
if (usuarioGuardado) {
    formAltaUsuario.reset();
    modalAltaUsuario.hide();
    alertaExito('Alta Usuario', `Usuario ${nombreYApellido} registrado con éxito.`);

    renderizarTablaUsuarios();
    //sino una alerta de error al cargar
  } else {
    alertaError('Alta Usuario', 'Error al intentar guardar el usuario.');
  }
});