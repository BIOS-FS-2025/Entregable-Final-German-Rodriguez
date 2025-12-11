// admin.controller.js
import User from '../models/user.model.js';
import Product from '../models/product.model.js';

// ==================== USUARIOS ====================

// Listar todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // no devolver contraseña
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener usuarios', error: error.message });
  }
};

// Editar usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // No permitir cambiar contraseña directamente por aquí
    delete updates.password;

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    res.status(200).json({ success: true, message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar usuario', error: error.message });
  }
};

// ==================== PRODUCTOS ====================

// Crear producto
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "El nombre y precio del producto son obligatorios"
      });
    }

    const product = new Product({
      name,
      description: description || "",
      price,
      stock: stock || 0,
      image: image || ""
    });

    await product.save();

    res.status(201).json({ success: true, data: product });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error al crear producto", error: error.message });
  }
};

// Listar todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener productos', error: error.message });
  }
};

// Editar producto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar producto', error: error.message });
  }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

    res.status(200).json({ success: true, message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar producto', error: error.message });
  }
};