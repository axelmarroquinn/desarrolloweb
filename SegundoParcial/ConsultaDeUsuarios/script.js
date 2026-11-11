const inputId = document.getElementById("userIdInput");
const btnBuscar = document.getElementById("btnBuscar");
const contenedorResultado = document.getElementById("resultado");

btnBuscar.addEventListener("click", buscarUsuario);

async function buscarUsuario() {
    const id = inputId.value.trim();

    if (!id) {
        contenedorResultado.innerHTML = "<p>Por favor, ingrese un número de usuario válido.</p>";
        return;
    }

    contenedorResultado.innerHTML = "<p>Buscando usuario...</p>";

    try {
        const respuesta = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                contenedorResultado.innerHTML = "<p>El usuario no existe.</p>";
                return;
            }
            throw new Error(`Error en la petición: ${respuesta.status}`);
        }

    const usuario = await respuesta.json();
    mostrarUsuario(usuario);

    } catch (error) { console.error("Error detectado:", error);
        contenedorResultado.innerHTML = "<p>Ocurrió un error al conectar con el servidor.</p>";
    }
}

function mostrarUsuario(usuario) {
    contenedorResultado.innerHTML = `
        <div>
            <h3>Detalles del Usuario</h3>
            <p><strong>Nombre:</strong> ${usuario.name}</p>
            <p><strong>Correo:</strong> ${usuario.email}</p>
            <p><strong>Teléfono:</strong> ${usuario.phone}</p>
            <p><strong>Sitio web:</strong> ${usuario.website}</p>
        </div>
    `;
}