const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "solo-desarrollo";

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Correo y contraseña son obligatorios." });

  // Para el ejercicio académico se valida la solicitud y se genera un token.
  // En producción, la contraseña debe verificarse contra un hash almacenado en MySQL.
  const token = jwt.sign({ email, role: "usuario" }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ message: "Inicio de sesión correcto.", token });
});

function auth(req, res, next) {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) return res.status(401).json({ message: "Token requerido." });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ message: "Token inválido o expirado." }); }
}

app.get("/api/recepciones", auth, (req, res) => {
  res.json([{ lote:"LOT-2026-001", pesoBrutoKg:2450, taraKg:620, pesoNetoKg:1830, proceso:"Compostaje" }]);
});

app.get("/api/health", (req,res) => res.json({ok:true, version:"1.0.0"}));
app.get("*", (req,res) => res.sendFile(path.join(__dirname,"..","frontend","index.html")));

app.listen(PORT, () => console.log("Servidor en http://localhost:" + PORT));
