import Product from '../models/product.model.js';

// CREATE - protected
export const createItem = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'name y price son obligatorios' });
    }

    const product = new Product({ name, description, price, stock });
    await product.save();

    res.status(201).json({ success: true, message: 'Producto creado', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear producto' });
  }
};

// READ - list all (public)
export const getItems = async (req, res) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener productos' });
  }
};

// READ - get by id (public)
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Product.findById(id);
    if (!item) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener producto' });
  }
};

// UPDATE - protected
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    res.json({ success: true, message: 'Producto actualizado', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar producto' });
  }
};

// DELETE - protected
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    res.json({ success: true, message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar producto' });
  }
};
