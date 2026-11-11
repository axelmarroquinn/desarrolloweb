// CORRECCIÓN: Carga de variables de entorno desde el archivo .env
require("dotenv").config(); 

const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

app.use(express.json());

// CORRECCIÓN: Conexión configurada exclusivamente con variables de entorno del archivo .env
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// CORRECCIÓN: Oculta el stack trace e información sensible al cliente ante un error
function responderError(res, error) {
    console.error("Error interno del servidor:", error); // Log interno para auditoría
    res.status(500).json({
        mensaje: "Ocurrió un error interno en el servidor"
    });
}

// CORRECCIÓN: Validación del formato del ID recibido
function validarId(id) {
    const parsedId = Number(id);
    return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

// CORRECCIÓN: Validación y sanitización del cuerpo de la solicitud
function validarProductoPayload(body) {
    const errores = [];
    const { nombre, precio } = body || {};

    if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
        errores.push("El nombre es obligatorio y debe ser un texto válido.");
    } else if (nombre.length > 255) {
        errores.push("El nombre no puede exceder los 255 caracteres.");
    }

    const parsedPrecio = Number(precio);
    if (precio === undefined || precio === null || isNaN(parsedPrecio) || parsedPrecio < 0) {
        errores.push("El precio debe ser un número válido mayor o igual a 0.");
    }

    return {
        esValido: errores.length === 0,
        errores,
        datosSanitizados: {
            nombre: nombre ? nombre.trim() : "",
            precio: parsedPrecio
        }
    };
}

// LISTAR PRODUCTOS
app.get("/api/productos", async (req, res) => {
    try {
        const [productos] = await db.query(
            "SELECT id, nombre, precio FROM productos ORDER BY id"
        );

        res.json(productos);
    } catch (error) {
        responderError(res, error);
    }
});

// BUSCAR PRODUCTO
app.get("/api/productos/:id", async (req, res) => {
    try {
        // CORRECCIÓN: Validación del parámetro ID
        const idValido = validarId(req.params.id);
        if (!idValido) {
            return res.status(400).json({ mensaje: "El ID proporcionado debe ser un entero positivo" });
        }

        // CORRECCIÓN: Consulta parametrizada (?) para prevenir inyección SQL
        const [productos] = await db.query(
            "SELECT id, nombre, precio FROM productos WHERE id = ?",
            [idValido]
        );

        if (productos.length === 0) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.json(productos[0]);
    } catch (error) {
        responderError(res, error);
    }
});

// CREAR PRODUCTO
app.post("/api/productos", async (req, res) => {
    try {
        // CORRECCIÓN: Validación del cuerpo de la petición antes de insertar
        const validacion = validarProductoPayload(req.body);
        if (!validacion.esValido) {
            return res.status(400).json({ errores: validacion.errores });
        }

        const { nombre, precio } = validacion.datosSanitizados;

        const [resultado] = await db.query(
            "INSERT INTO productos (nombre, precio) VALUES (?, ?)",
            [nombre, precio]
        );

        res.status(201).json({
            id: resultado.insertId,
            nombre,
            precio
        });
    } catch (error) {
        responderError(res, error);
    }
});

// ACTUALIZAR PRODUCTO
app.put("/api/productos/:id", async (req, res) => {
    try {
        // CORRECCIÓN: Validación del parámetro ID
        const idValido = validarId(req.params.id);
        if (!idValido) {
            return res.status(400).json({ mensaje: "El ID proporcionado debe ser un entero positivo" });
        }

        // CORRECCIÓN: Validación de los campos a actualizar
        const validacion = validarProductoPayload(req.body);
        if (!validacion.esValido) {
            return res.status(400).json({ errores: validacion.errores });
        }

        const { nombre, precio } = validacion.datosSanitizados;

        const [resultado] = await db.query(
            "UPDATE productos SET nombre = ?, precio = ? WHERE id = ?",
            [nombre, precio, idValido]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        const [productos] = await db.query(
            "SELECT id, nombre, precio FROM productos WHERE id = ?",
            [idValido]
        );

        res.json(productos[0]);
    } catch (error) {
        responderError(res, error);
    }
});

// ELIMINAR PRODUCTO
app.delete("/api/productos/:id", async (req, res) => {
    try {
        // CORRECCIÓN: Validación del parámetro ID
        const idValido = validarId(req.params.id);
        if (!idValido) {
            return res.status(400).json({ mensaje: "El ID proporcionado debe ser un entero positivo" });
        }

        // CORRECCIÓN: Consulta parametrizada (?) para evitar SQL Injection
        const [resultado] = await db.query(
            "DELETE FROM productos WHERE id = ?",
            [idValido]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.status(204).send();
    } catch (error) {
        responderError(res, error);
    }
});

app.listen(3000, "127.0.0.1", () => {
    console.log("API SEGURA: http://127.0.0.1:3000");
});