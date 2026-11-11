CREATE DATABASE tienda_web;
USE tienda_web;

CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);