import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Verificar que MONGO_URI esté definido
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI no está definida en las variables de entorno");
    }

    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};