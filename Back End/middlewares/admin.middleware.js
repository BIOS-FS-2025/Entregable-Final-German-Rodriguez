// admin.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Middleware para verificar que el usuario esté autenticado y sea administrador
const authAdminMiddleware = async (req, res, next) => {
  try {
    // Revisar que haya token en los headers
    const authHeader = req.headers.authorization || req.headers.Authorization || req.headers['Authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Invalid token format' });

    // Decodificar token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
    }

    // Buscar usuario en la base de datos
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'Usuario no encontrado' });

    // Verificar rol
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Acceso denegado: solo administradores' });
    }

    // Agregar usuario a req y continuar
    req.user = user;
    next();

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en autenticación de administrador' });
  }
};

export default authAdminMiddleware;