// 1. Array de objetos: datos del catálogo
const productos = [
  { id: 1, nombre: "Laptop HP 15", categoria: "Computadoras", precio: 3500, disponible: true },
  { id: 2, nombre: "Mouse Logitech", categoria: "Perifericos", precio: 120, disponible: true },
  { id: 3, nombre: "Teclado Mecánico", categoria: "Perifericos", precio: 250, disponible: false },
  { id: 4, nombre: "Monitor Samsung 24\"", categoria: "Computadoras", precio: 1200, disponible: true },
  { id: 5, nombre: "Audífonos Bluetooth", categoria: "Accesorios", precio: 300, disponible: false },
  { id: 6, nombre: "Mochila para Laptop", categoria: "Accesorios", precio: 180, disponible: true },
  { id: 7, nombre: "Webcam HD", categoria: "Perifericos", precio: 220, disponible: true },
  { id: 8, nombre: "PC de Escritorio", categoria: "Computadoras", precio: 4200, disponible: false }
];

// Referencias al DOM
const contenedorProductos = document.getElementById("contenedorProductos");
const mensajeVacio = document.getElementById("mensajeVacio");
const inputBusqueda = document.getElementById("inputBusqueda");
const selectCategoria = document.getElementById("selectCategoria");
const btnBuscar = document.getElementById("btnBuscar");
const btnDisponibles = document.getElementById("btnDisponibles");
const btnTodos = document.getElementById("btnTodos");

// Función para renderizar productos en el DOM
// Recibe un array de productos y genera las tarjetas
const renderizarProductos = (listaProductos) => {

  // Limpiamos el contenedor antes de volver a dibujar las tarjetas
  contenedorProductos.innerHTML = "";

  // Si no hay productos que coincidan, mostramos el mensaje y salimos
  if (listaProductos.length === 0) {
    mensajeVacio.style.display = "block";
    return;
  } else {
    mensajeVacio.style.display = "none";
  }

  // forEach() para recorrer el array y crear una tarjeta por cada producto
  listaProductos.forEach((producto) => {

    // Destructuring: extraemos las propiedades del objeto producto
    const { nombre, categoria, precio, disponible } = producto;

    // Base para armar el HTML de la tarjeta
    const tarjetaHTML = `
      <div class="tarjeta">
        <h3>${nombre}</h3>
        <p>Categoría: ${categoria}</p>
        <p>Precio: Q${precio}</p>
        <p class="${disponible ? "disponible" : "agotado"}">
          ${disponible ? "DISPONIBLE" : "AGOTADO"}
        </p>
      </div>
    `;

    contenedorProductos.innerHTML += tarjetaHTML;
  });
};

// Función principal de filtrado
// Combina búsqueda por texto y filtro de categoría
const aplicarFiltros = (soloDisponibles = false) => {

  const textoBusqueda = inputBusqueda.value.toLowerCase();
  const categoriaSeleccionada = selectCategoria.value;

  // filter() para ir reduciendo el array según cada condición
  let resultado = productos.filter((producto) => {
    const coincideNombre = producto.nombre.toLowerCase().includes(textoBusqueda);
    const coincideCategoria =
      categoriaSeleccionada === "Todas" || producto.categoria === categoriaSeleccionada;
    return coincideNombre && coincideCategoria;
  });

  // Si el filtro de "solo disponibles" está activo, filtramos de nuevo
  if (soloDisponibles) {
    resultado = resultado.filter((producto) => producto.disponible === true);
  }

  renderizarProductos(resultado);
};

// Eventos del usuario

// Buscar al hacer clic en el botón
btnBuscar.addEventListener("click", () => aplicarFiltros(false));

// Buscar también al presionar Enter en el input
inputBusqueda.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    aplicarFiltros(false);
  }
});

// Cambiar categoría desde el select
selectCategoria.addEventListener("change", () => aplicarFiltros(false));

// Botón: mostrar solo productos disponibles
btnDisponibles.addEventListener("click", () => aplicarFiltros(true));

// Botón: mostrar todos los productos (resetea filtros)
btnTodos.addEventListener("click", () => {
  inputBusqueda.value = "";
  selectCategoria.value = "Todas";
  aplicarFiltros(false);
});

// find(): busca un solo producto por id (uso interno, ejemplo de referencia)
const buscarProductoPorId = (id) => productos.find((producto) => producto.id === id);

// map(): obtiene solo los nombres de todos los productos (uso interno, ejemplo de referencia)
const nombresProductos = productos.map((producto) => producto.nombre);

// Renderizado inicial al cargar la página
renderizarProductos(productos);