require('dotenv').config();
const express = require('express');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware que convierte el cuerpo JSON de las peticiones en req.body
app.use(express.json());

/* =========================================================
   VALIDACIONES (requisito 5)
   ========================================================= */

// Devuelve una lista de errores; si la lista está vacía, los datos son válidos.
function validarServicio(body) {
  const errores = [];
  const { nombre, precio } = body || {};

  // Nombre: debe ser texto y no estar vacío (ni solo espacios)
  if (typeof nombre !== 'string' || nombre.trim() === '') {
    errores.push('El nombre es obligatorio y no puede estar vacío.');
  } else if (nombre.trim().length > 100) {
    errores.push('El nombre no puede superar los 100 caracteres.');
  }

  // Precio: debe ser un número real, mayor que 0 y caber en DECIMAL(10,2)
  if (typeof precio !== 'number' || !Number.isFinite(precio) || precio <= 0) {
    errores.push('El precio debe ser un número positivo.');
  } else if (precio > 99999999.99) {
    errores.push('El precio excede el máximo permitido (99999999.99).');
  }

  return errores;
}

/* =========================================================
   ENDPOINTS
   ========================================================= */

// GET /api/servicios → todos los servicios (requisito 2)
app.get('/api/servicios', async (req, res, next) => {
  try {
    const [filas] = await pool.execute('SELECT id, nombre, precio FROM servicios ORDER BY id');
    res.status(200).json(filas);
  } catch (error) {
    next(error); // lo atiende el manejador de errores del final
  }
});

// GET /api/servicios/:id → un servicio (requisitos 3, 6 y 7)
app.get('/api/servicios/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    // El id debe ser un entero positivo (evita /api/servicios/abc)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'El id debe ser un entero positivo.' });
    }

    // Consulta parametrizada: el "?" se reemplaza de forma segura por [id]
    const [filas] = await pool.execute(
      'SELECT id, nombre, precio FROM servicios WHERE id = ?',
      [id]
    );

    // Si no hay filas, el servicio no existe → 404
    if (filas.length === 0) {
      return res.status(404).json({ error: `No existe un servicio con id ${id}.` });
    }

    res.status(200).json(filas[0]);
  } catch (error) {
    next(error);
  }
});

// POST /api/servicios → registrar un servicio (requisitos 4, 5 y 6)
app.post('/api/servicios', async (req, res, next) => {
  try {
    // Validar antes de tocar la base de datos
    const errores = validarServicio(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    const nombre = req.body.nombre.trim();
    const precio = req.body.precio;

    // Consulta parametrizada: los datos NUNCA se concatenan al SQL
    const [resultado] = await pool.execute(
      'INSERT INTO servicios (nombre, precio) VALUES (?, ?)',
      [nombre, precio]
    );

    // 201 = Created; devolvemos el recurso creado con su id generado
    res.status(201).json({ id: resultado.insertId, nombre, precio });
  } catch (error) {
    next(error);
  }
});

/* =========================================================
   MANEJO DE ERRORES (requisito 7)
   ========================================================= */

// Ruta inexistente (ej. /api/otracosa) → 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// Manejador global de errores (se detecta por tener 4 parámetros)
app.use((error, req, res, next) => {
  // JSON mal formado en el body de la petición
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El JSON enviado no es válido.' });
  }

  // Cualquier otro error: se registra en consola, pero al cliente no se le
  // expone el detalle interno
  console.error('Error:', error.message);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

/* =========================================================
   ARRANQUE DEL SERVIDOR
   ========================================================= */

async function iniciar() {
  try {
    // Prueba la conexión a MySQL antes de aceptar peticiones
    const conexion = await pool.getConnection();
    console.log('Conectado a MySQL correctamente');
    conexion.release(); // devuelve la conexión al pool

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a MySQL:', error.message);
    process.exit(1);
  }
}

iniciar();