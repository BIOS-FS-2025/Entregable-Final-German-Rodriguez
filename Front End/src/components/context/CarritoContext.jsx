import React, { createContext, useState } from 'react';

export const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id);
      if (existe) {
        return prev.map(p =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + cantidad }
            : p
        );
      }
      return [...prev, { ...producto, cantidad }];
    });
  };

  const removerDelCarrito = (productoId) => {
    setCarrito(prev => prev.filter(p => p.id !== productoId));
  };

  const actualizarCantidad = (productoId, cantidad) => {
    if (cantidad < 1) {
      removerDelCarrito(productoId);
      return;
    }
    
    setCarrito(prev => 
      prev.map(p => 
        p.id === productoId
          ? { ...p, cantidad }
          : p
      )
    );
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CarritoContext.Provider value={{ 
      carrito, 
      agregarAlCarrito, 
      removerDelCarrito, 
      actualizarCantidad, 
      limpiarCarrito 
    }}>
      {children}
    </CarritoContext.Provider>
  );
}