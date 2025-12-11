import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [150, 'El nombre no puede superar los 150 caracteres']
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria']
  },
  brand: {
    type: String,
    required: [true, 'La marca es obligatoria']
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: [0, 'El stock no puede ser negativo']
  },
  image: {
    type: [String], // Array de URLs o paths locales
    default: [] // Por defecto vacío
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;