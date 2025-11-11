//ESTO ES LA PANTALLA PARA INICIAR SESION
//Esto se usa para traer funciones o pueden ser variables que están definidas en otro archivo,
//en este caso estamos trayendo la funcion obtener usuario de la carpeta base de datos archivo bd.js
import { obtenerUsuarios } from "./base_de_datos/bd.js";
//Llama a la función importada.
obtenerUsuarios();
//obtiene el formulario y parrafo del html, lo trae a JS
const formulario = document.getElementById("forms");
const parrafo = document.getElementById("parrafo");
//Agrega un evento de escucha al formulario que se activa cuando el usuario hace submit
formulario.addEventListener("submit", function (e) {
    e.preventDefault();
// designa y obtiene valores que escribe el usuario
    let dni = document.getElementById("dni").value;
    let password = document.getElementById("password").value;
    // entiendo que recupera los usuarios guardados en la base de datos y se le pone json porque la bd solo
    //recibe strings, entonces json parse para convertirlo en array
    const usuariosBBDD = JSON.parse(localStorage.getItem("usuarios"));

    let encontrado = false;
//recorre todos los usuarios almacenados y lo guarda en una variable
    for (let i = 0; i < usuariosBBDD.length; i++) {
        let usuario = usuariosBBDD[i];
//chequea si el usuario que ingreso coincide con uno en la BD
        if (
            usuario.dni == dni &&
            (usuario.password == password || usuario.passwordSystem == password) &&
            usuario.active == true
        ) {
            encontrado = true;
        }
    }
//si se encontro va al inicio
    if (encontrado) {
        window.location.href = "home/home.html";
        //sino usuario o pass incorrecta y se queda ahi
    } else {
        parrafo.textContent = "Usuario o contraseña incorrecta";
    }
});

