import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem
} from "../controllers/item.controller.js";

const router = express.Router();

// Rutas públicas
router.get('/', getItems);
router.get('/:id', getItemById);

// Rutas protegidas (CREATE / UPDATE / DELETE)
router.post('/', authMiddleware, createItem);
router.put('/:id', authMiddleware, updateItem);
router.delete('/:id', authMiddleware, deleteItem);

export default router;