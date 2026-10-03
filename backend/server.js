const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "solo-desarrollo";

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

const lotes = [
  {
    id: 1,
    codigo: "LOT-2026-001",
    pesoBrutoKg: 2450,
    taraKg: 620,
    pesoNetoKg: 1830,
    tipoBiomasa: "Residuos orgánicos",
    estado: "Pendiente",
    proceso: "Compostaje"
  },
  {
    id: 2,
    codigo: "LOT-2026-002",
    pesoBrutoKg: 1800,
    taraKg: 410,
    pesoNetoKg: 1390,
    tipoBiomasa: "Biomasa de poda",
    estado: "Pendiente",
    proceso: "Secado"
  }
];

const recepciones = [];
const trazabilidad = [];

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Correo y contraseña son obligatorios." });

  const token = jwt.sign({ email, role: "usuario" }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ message: "Inicio de sesión correcto.", token });
});

function auth(req, res, next) {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) return res.status(401).json({ message: "Token requerido." });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ message: "Token inválido o expirado." }); }
}

function parseNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

app.get("/api/health", (req, res) => res.json({ ok: true, version: "1.1.0" }));

app.get("/api/lotes", auth, (req, res) => {
  res.json(lotes);
});

app.get("/api/lotes/:id", auth, (req, res) => {
  const loteId = Number(req.params.id);
  const lote = lotes.find(item => item.id === loteId || item.codigo === req.params.id);

  if (!lote) {
    return res.status(404).json({ message: "Lote no encontrado." });
  }

  res.json(lote);
});

app.get("/api/recepciones", auth, (req, res) => {
  res.json(recepciones);
});

app.post("/api/recepciones", auth, (req, res) => {
  const { loteId, pesoBrutoKg, taraKg, proceso } = req.body;

  if (!loteId || pesoBrutoKg === undefined || taraKg === undefined || !proceso) {
    return res.status(400).json({
      message: "Faltan datos obligatorios: loteId, pesoBrutoKg, taraKg y proceso."
    });
  }

  const lote = lotes.find(item => item.id === Number(loteId) || item.codigo === String(loteId));

  if (!lote) {
    return res.status(404).json({ message: "El lote indicado no existe." });
  }

  const pesoBruto = parseNumber(pesoBrutoKg);
  const tara = parseNumber(taraKg);

  if (pesoBruto === null || tara === null) {
    return res.status(400).json({ message: "Los pesos deben ser numéricos." });
  }

  if (pesoBruto <= 0 || tara < 0 || pesoBruto <= tara) {
    return res.status(400).json({ message: "Validación de pesos fallida: el peso bruto debe ser mayor que la tara y ambos deben ser positivos." });
  }

  const pesoNeto = Number((pesoBruto - tara).toFixed(2));

  const recepcion = {
    id: recepciones.length + 1,
    loteId: lote.id,
    loteCodigo: lote.codigo,
    pesoBrutoKg: pesoBruto,
    taraKg: tara,
    pesoNetoKg: pesoNeto,
    proceso,
    fecha: new Date().toISOString()
  };

  recepciones.push(recepcion);

  lote.pesoBrutoKg = pesoBruto;
  lote.taraKg = tara;
  lote.pesoNetoKg = pesoNeto;
  lote.estado = "Recibido";
  lote.proceso = proceso;

  const eventoTrazabilidad = {
    id: trazabilidad.length + 1,
    loteId: lote.id,
    evento: "Recibido",
    descripcion: `Recepción registrada para ${lote.codigo} con peso neto ${pesoNeto} kg.`,
    fecha: new Date().toISOString()
  };

  trazabilidad.push(eventoTrazabilidad);

  res.status(201).json({
    message: "Recepción registrada correctamente.",
    recepcion,
    lote,
    trazabilidad: eventoTrazabilidad
  });
});

app.get("/api/recepciones/lote/:loteId", auth, (req, res) => {
  const loteId = Number(req.params.loteId);
  const lote = lotes.find(item => item.id === loteId || item.codigo === req.params.loteId);

  if (!lote) {
    return res.status(404).json({ message: "El lote no existe." });
  }

  const registros = recepciones.filter(recepcion => recepcion.loteId === lote.id);
  const historial = trazabilidad.filter(evento => evento.loteId === lote.id);

  res.json({
    lote,
    recepciones: registros,
    trazabilidad: historial
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

app.listen(PORT, () => console.log("Servidor en http://localhost:" + PORT));
