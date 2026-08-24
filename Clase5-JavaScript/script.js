console.log("Conectados");


/*Variables

let nombre = "Aarón";
let edad = 36;
let precio = 9.99;
let activo = true;
const quiere_llorar = null;
let direccion; //undefined

console.log(typeof nombre);
console.log(typeof edad);
console.log(typeof precio);
console.log(typeof activo);

console.log(quiere_llorar);

console.log(direccion);

*/

/* Operadores 

const precio = 100;
const cantidad = 5; 

const total = precio * cantidad; 

console.log("El total de la compra es de: " + total);

const numero1 = 25; 
const numero2 = 5;

const operacion = numero1 - numero2;

console.log(operacion);



console.log(5 + 3 * 2);  

console.log(10 > 5);
console.log(10 < 5);


console.log(5 == "5"); //true
console.log(5 === "5"); //false

*/

/* If 
const edad = 16;

if(edad >= 18){
    console.log("Mayor de edad");    
} else {
    console.log("Menor de edad");
}

const nota = 52;

if (nota >= 90){
    console.log("Excelente nota");    
} else if (nota >= 80){
    console.log("Buena nota");    
} else if (nota >= 70){
    console.log("Regular");    
} else if (nota >= 61){
    console.log("Raspado");    
} else {
    console.log("Nos vemos el otro año");    
}
*/

/* Funciones 


function saludo(nombre) {
    console.log("Hola " + nombre);    
}

let nombre = "Ana";
saludo(nombre);

//Arrow functions
const saludar = () => {
    console.log("Hola jovenes de desarrollo web");    
};

saludar();
*/

/* Array y objetos 

const estudiantes = [
    "Ana",
    "Carlos",
    "Renato"
];

console.log(estudiantes[0]);

estudiantes.push("Maria");
console.log(estudiantes[3]);

console.log(estudiantes.length);


const estudiantes = {
    nombre: "David",
    edad: 25,
    carrera: "Ingenieria en Sistemas",
    activo: true
};

console.log(estudiantes.nombre);

*/

/*Eventos y Listener

//const mensaje = document.getElementById("resultado");
const mensaje = document.querySelector("#resultado");

mensaje.textContent = "No aprobado";



if(mensaje.textContent === "Aprobado"){
    mensaje.style.color = "green";
} else if (mensaje.textContent === "No aprobado"){
    mensaje.style.color = "red";
} else {
    mensaje.style.color = "black";
}

//Listener

const boton = document.querySelector("#btnSaludar");

boton.addEventListener("click", function () {
    mensaje.textContent = "Hola desde aqui! Asi podemos cambiar el texto con un EventListener";
});  */

/* Validación de forms */

const formulario = document.querySelector("#formRegistro");
const nombre = document.querySelector("#nombre");
const resultado = document.querySelector("#resultado");


formulario.addEventListener("submit", function () {
    event.preventDefault();

    if(nombre.value == ""){
        resultado.textContent = "Debe ingresar un nombre";
    } else {
        resultado.textContent = "Registro corecto: " + nombre.value;
    }
});





