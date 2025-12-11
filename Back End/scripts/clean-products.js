// Script para limpiar productos
import { connectDB } from '../config/db.js';
import Product from '../models/product.model.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanProducts = async () => {
  try {
    await connectDB();
    console.log('Conectado a la base de datos');

    const result = await Product.deleteMany({});
    console.log(`✅ ${result.deletedCount} productos eliminados`);

    process.exit(0);
  } catch (error) {
    console.error('Error al eliminar productos:', error.message);
    process.exit(1);
  }
};

cleanProducts();