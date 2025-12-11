
import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { CarritoContext } from "./context/CarritoContext.jsx";

const ProductoDestacado = ({ producto, onAddToCart, isSelected }) => {
  return (
    <div className="producto">
      <button
        className={`add-cart-btn${isSelected ? ' clicked' : ''}`}
        onClick={() => onAddToCart(producto)}
        title="Agregar al carrito"
      >
        <FontAwesomeIcon icon={faCartShopping} />
      </button>

      <div className="img-container">
        <img src={producto.imgDefault} alt={producto.nombre} className="img-default" />
        <img src={producto.imgHover} alt={`${producto.nombre} Hover`} className="img-hover" />
      </div>

      <h3>{producto.nombre}</h3>
      <p className="talles">Talles: XS, S, M, L, XL, XXL</p>
      <p className="precio">
        <span className="current-price">${producto.precio}</span>
      </p>
    </div>
  );
};

export default function CarritoManager() {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Lista de productos destacados
  const featured = [
    { id: 1, nombre: "Jean Ultra Baggy Denim", precio: 1500, imgDefault: "./sources/prenda1.webp", imgHover: "./sources/prenda1.1.webp" },
    { id: 2, nombre: "Jean Ultra Baggy Hueso", precio: 1890, imgDefault: "./sources/prenda2.webp", imgHover: "./sources/prenda2.2.webp" },
    { id: 3, nombre: "Jean Ultra Baggy Black", precio: 1990, imgDefault: "./sources/prenda4.webp", imgHover: "./sources/prenda4.4.webp" },
    { id: 4, nombre: "Bermuda Baggy Denim", precio: 1990, imgDefault: "./sources/prenda3.webp", imgHover: "./sources/prenda3.3.webp" },
    { id: 5, nombre: "Pulsera Rosarios de Acero", precio: 240, imgDefault: "./sources/pulceraconcrucesd.webp", imgHover: "./sources/pulceraconcrucesg.webp" },
  ];

  const handleAddToCart = (producto) => {
    try {
      agregarAlCarrito(producto);
      setSelectedProduct(producto.id);
      // Solo mantenemos la animación del botón
      setTimeout(() => {
        setSelectedProduct(null);
      }, 200);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };

  return (
    <div className="mas-vendidos">
      <h2>Productos Destacados</h2>
      <div className="productos-grid">
        {featured.map(producto => (
          <ProductoDestacado
            key={producto.id}
            producto={producto}
            onAddToCart={handleAddToCart}
            isSelected={selectedProduct === producto.id}
          />
        ))}
      </div>
    </div>
  );
}