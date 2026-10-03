CREATE DATABASE IF NOT EXISTS finca_catalina;
USE finca_catalina;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  peso_bruto DECIMAL(10,2) NOT NULL,
  tara DECIMAL(10,2) NOT NULL,
  peso_neto DECIMAL(10,2) NOT NULL,
  tipo_biomasa VARCHAR(100) NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recepciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lote_id INT NOT NULL,
  peso_bruto DECIMAL(10,2) NOT NULL,
  tara DECIMAL(10,2) NOT NULL,
  peso_neto DECIMAL(10,2) NOT NULL,
  proceso VARCHAR(100) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lote_id) REFERENCES lotes(id)
);

CREATE TABLE IF NOT EXISTS trazabilidad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lote_id INT NOT NULL,
  evento VARCHAR(100) NOT NULL,
  descripcion TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lote_id) REFERENCES lotes(id)
);

INSERT IGNORE INTO lotes (codigo, peso_bruto, tara, peso_neto, tipo_biomasa, estado) VALUES
('LOT-2026-001', 2450.00, 620.00, 1830.00, 'Residuos orgánicos', 'Pendiente'),
('LOT-2026-002', 1800.00, 410.00, 1390.00, 'Biomasa de poda', 'Pendiente'),
('LOT-2026-003', 3100.00, 750.00, 2350.00, 'Estiércol compostado', 'Pendiente');
