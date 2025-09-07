import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 🔗 Conexión a MongoDB Atlas
async function conectarDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://233241181_db_user:Itzamara123.@citasdb.t1hwtap.mongodb.net/citasdb?retryWrites=true&w=majority&appName=citasdb"
    );
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (err) {
    console.error("❌ Error de conexión:", err);
    process.exit(1); // Salir si no se puede conectar
  }
}

conectarDB();

// 📌 Modelo de Usuario
const Usuario = mongoose.model("Usuario", new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true }
}));

// 📌 Endpoint de prueba
app.get("/", (req, res) => {
  res.send("Servidor activo ✅");
});

// 📌 Endpoint para registrar usuarios
app.post("/registrar", async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.json({ mensaje: "✅ Usuario registrado con éxito" });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      // Error de duplicado en correo
      res.status(400).json({ error: "❌ El correo ya está registrado" });
    } else {
      res.status(500).json({ error: "❌ Error al registrar el usuario" });
    }
  }
});

// 🚀 Servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
})
.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ El puerto ${PORT} ya está en uso`);
  } else {
    console.error(err);
  }
});
