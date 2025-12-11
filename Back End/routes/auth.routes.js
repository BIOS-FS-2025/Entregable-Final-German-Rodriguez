import express from "express";
import { register, login, updateUser, uploadAvatar, upload, requestVerificationCode, deleteAccount, verifyPassword } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Rutas de autenticación
router.post("/register", register);
router.post("/login", login);

// Rutas protegidas (requieren token)
router.post("/verify-password", authMiddleware, verifyPassword);
router.post("/request-verification", authMiddleware, requestVerificationCode);
router.put("/update", authMiddleware, updateUser);
router.delete("/delete", authMiddleware, deleteAccount);
router.post("/upload-avatar", authMiddleware, upload.single("avatar"), uploadAvatar);

export default router;