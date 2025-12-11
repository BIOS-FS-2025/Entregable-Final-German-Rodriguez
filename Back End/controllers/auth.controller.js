import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from "../utils/sendEmail.js";
import multer from 'multer';
import path from 'path';

// ==================== UTILIDAD: Generar código de verificación ====================
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==================== REGISTER ====================
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Verificar si el email ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        // Crear nuevo usuario
        const user = new User({ username, email, password });

        // Guardar usuario en la base de datos
        await user.save();

        // ✅ Enviar correo de bienvenida
        try {
            await sendEmail(user.email, 'register', user.username);
        } catch (err) {
            console.error("Error enviando correo de registro:", err.message);
        }

        // ✅ Generar token (para autologin)
        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // ✅ Devolvemos usuario + token
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                user,
                token
            }
        });

    } catch (error) {
        // Manejo de errores con validaciones específicas
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
    try {
        const { email, password, skipEmail } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email o contraseña incorrectos'
            });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email o contraseña incorrectos'
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // ✅ Solo enviamos correo si skipEmail NO está activo
        if (!skipEmail) {
            try {
                await sendEmail(user.email, 'login', user.username);
            } catch (err) {
                console.error("Error enviando correo de login:", err.message);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: user.toJSON(),
                token
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// ==================== VERIFY PASSWORD ====================
export const verifyPassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Contraseña requerida'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Contraseña incorrecta'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contraseña válida'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al verificar contraseña',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// ==================== REQUEST VERIFICATION CODE ====================
export const requestVerificationCode = async (req, res) => {
    try {
        const userId = req.user.id;
        const { field } = req.body; // 'email' o 'password'

        if (!['email', 'password'].includes(field)) {
            return res.status(400).json({
                success: false,
                message: 'Campo inválido'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Generar código de verificación
        const verificationCode = generateVerificationCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

        user.verificationCode = verificationCode;
        user.verificationCodeExpires = expiresAt;
        await user.save();

        // Enviar código por email
        try {
            await sendEmail(
                user.email,
                'verification',
                user.username,
                field,
                verificationCode
            );
        } catch (err) {
            console.error("Error enviando código de verificación:", err.message);
            return res.status(500).json({
                success: false,
                message: 'Error al enviar el código de verificación'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Código de verificación enviado a tu email'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al solicitar código de verificación',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// ==================== UPDATE USER WITH VERIFICATION ====================
export const updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, password, newPassword, location, gender, verificationCode } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Si se intenta cambiar email o contraseña, requerir verificación
        const requiresVerification = (email && email !== user.email) || password;

        if (requiresVerification && !verificationCode) {
            // Almacenar datos pendientes
            user.verificationPendingData = { email, password, newPassword, username, location, gender };
            await user.save();

            return res.status(401).json({
                success: false,
                message: 'verification_required',
                requiresVerification: true
            });
        }

        // Validar código de verificación si es necesario
        if (requiresVerification && verificationCode) {
            if (!user.verificationCode || user.verificationCode !== verificationCode) {
                return res.status(400).json({
                    success: false,
                    message: 'Código de verificación inválido'
                });
            }

            if (new Date() > user.verificationCodeExpires) {
                return res.status(400).json({
                    success: false,
                    message: 'Código de verificación expirado'
                });
            }

            // Validar contraseña actual si se cambia la contraseña
            if (password) {
                const isPasswordValid = await user.comparePassword(password);
                if (!isPasswordValid) {
                    return res.status(400).json({
                        success: false,
                        message: 'Contraseña actual incorrecta'
                    });
                }

                if (!newPassword || newPassword.length < 5) {
                    return res.status(400).json({
                        success: false,
                        message: 'Nueva contraseña debe tener al menos 5 caracteres'
                    });
                }

                user.password = newPassword;
            }

            // Verificar que el nuevo email no esté en uso
            if (email && email !== user.email) {
                const emailExists = await User.findOne({ email });
                if (emailExists) {
                    return res.status(400).json({
                        success: false,
                        message: 'El email ya está en uso'
                    });
                }
                user.email = email;
            }

            // Limpiar código de verificación
            user.verificationCode = null;
            user.verificationCodeExpires = null;
            user.verificationPendingData = null;
        }

        // Actualizar campos que no requieren verificación
        if (username) user.username = username;
        if (location !== undefined) user.location = location || 'Sin especificar';
        if (gender !== undefined) user.gender = gender || 'Sin especificar';

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: user.toJSON()
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// ==================== DELETE ACCOUNT ====================
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { verificationCode } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Si no hay código, solicitarlo
        if (!verificationCode) {
            const code = generateVerificationCode();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

            user.verificationCode = code;
            user.verificationCodeExpires = expiresAt;
            await user.save();

            try {
                await sendEmail(
                    user.email,
                    'delete_account',
                    user.username,
                    'delete',
                    code
                );
            } catch (err) {
                console.error("Error enviando código de eliminación:", err.message);
                return res.status(500).json({
                    success: false,
                    message: 'Error al enviar el código'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Código de seguridad enviado a tu email',
                requiresCode: true
            });
        }

        // Validar código
        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({
                success: false,
                message: 'Código de seguridad inválido'
            });
        }

        if (new Date() > user.verificationCodeExpires) {
            return res.status(400).json({
                success: false,
                message: 'Código de seguridad expirado'
            });
        }

        // Eliminar usuario
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: 'Cuenta eliminada exitosamente'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la cuenta',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// ==================== UPLOAD AVATAR ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, req.user.id + '-' + Date.now() + ext);
  }
});
export const upload = multer({ storage });

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: 'No se subió ningún archivo' });

    const user = await User.findById(req.user.id);
    user.profilePic = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ success: true, data: user.toJSON() });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al subir la imagen',
      error: err.message
    });
  }
};