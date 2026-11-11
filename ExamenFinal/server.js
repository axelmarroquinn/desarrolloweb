// API REST - Gestión de categorías con Node.js + Express + MySQL

const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. Conexión a MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'tienda_web'
});

// 2. GET /api/categorias -> todas las categorías
app.get('/api/categorias', async (req, res) => {
  try {
    const [filas] = await pool.query('SELECT * FROM categorias');
    res.status(200).json(filas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar las categorías' });
  }
});

// 3. GET /api/categorias/:id -> una categoría por ID
app.get('/api/categorias/:id', async (req, res) => {
  const id = Number(req.params.id);

  // Validar que el ID sea un número entero positivo
  if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
  }

  try {
    // Consulta parametrizada: el "?" se reemplaza de forma segura por el id
        const [filas] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id]);

    // Si no hay resultados, el recurso no existe
    if (filas.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.status(200).json(filas[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar la categoría' });
  }
});

// 4. POST /api/categorias -> registrar una nueva categoría
app.post('/api/categorias', async (req, res) => {
  const { nombre, descripcion } = req.body;

  // 5. Validar que el nombre sea un texto no vacío
  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio y debe ser texto no vacío' });
  }

  // La descripción es opcional; pero debe ser texto
  if (descripcion !== undefined && descripcion !== null && typeof descripcion !== 'string') {
    return res.status(400).json({ error: 'La descripción debe ser texto' });
  }

  try {
    // 6. Consulta parametrizada para evitar inyección SQL
    const [resultado] = await pool.query(
      'INSERT INTO categorias (Nombre, descripcion) VALUES (?, ?)',
      [nombre.trim(), descripcion || null]
    );

    // 201 = recurso creado
    res.status(201).json({
        id: resultado.insertId,
        nombre: nombre.trim(),
        descripcion: descripcion || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar la categoría' });
  }
});

// 7. Manejo de errores

// 404 not found
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// 400 error del json
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido' });
  }
// 500 error interno
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});