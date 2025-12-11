import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/db.js';

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import itemRoutes from './routes/item.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Configurar variables de entorno
dotenv.config();

const app = express();

// ==================== MIDDLEWARES ====================

// CORS: Permite solicitudes desde el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// Parser para JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ==================== CONEXIÓN A BASE DE DATOS ====================
connectDB();

// ==================== RUTAS DE LA API ====================

// Rutas de autenticación (registro, login, actualizar usuario)
app.use("/api/auth", authRoutes);

// Rutas de productos/items (CRUD)
app.use("/api/items", itemRoutes);

// ==================== RUTAS DE ADMIN ====================
app.use("/api/admin", adminRoutes); // <-- montar rutas de admin

// Endpoint de prueba para verificar que el backend está funcionando
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Conexión exitosa entre frontend y backend" });
});

// ==================== INICIAR SERVIDOR ====================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
});