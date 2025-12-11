import express from 'express';
import authAdminMiddleware from '../middlewares/admin.middleware.js';
import {
  getAllUsers,
  getAllProducts,
  deleteUser,
  deleteProduct,
  updateUser,
  updateProduct,
  createProduct
} from '../controllers/admin.controller.js';

const router = express.Router();

// Todas las rutas usan authAdminMiddleware
router.use(authAdminMiddleware);

// USUARIOS
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// PRODUCTOS
router.post('/products', createProduct);
router.get('/products', getAllProducts);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;