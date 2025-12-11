import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        trim: true,
        minlength: [2, 'El nombre de usuario debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre de usuario no puede exceder los 50 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [5, 'La contraseña debe tener al menos 5 caracteres']
    },
    location: {
        type: String,
        default: 'Sin especificar'
    },
    gender: {
        type: String,
        enum: ['masculino', 'femenino', 'prefiero no decirlo', 'Sin especificar'],
        default: 'Sin especificar'
    },
    profilePic: {
        type: String,
        default: null
    },
    verificationCode: {
        type: String,
        default: null
    },
    verificationCodeExpires: {
        type: Date,
        default: null
    },
    verificationPendingData: {
        type: Object,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function(next) {
    // Solo encriptar si la contraseña fue modificada
    if (!this.isModified('password')) return next();
    
    try {
        // Generar un salt
        const salt = await bcrypt.genSalt(10);
        // Hash de la contraseña
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

// Método para no devolver la contraseña en las respuestas
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;