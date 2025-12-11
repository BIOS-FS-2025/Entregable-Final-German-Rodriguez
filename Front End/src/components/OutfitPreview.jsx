// Importación de React y hooks para manejar estado y referencias
import React, { useState, useRef } from 'react';

// Componente para mostrar el outfit destacado en la página principal
export default function OutfitPreview() {
  // Estado para controlar la visibilidad y el índice del preview
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);
  // Referencia para manejar el timeout de la animación
  const previewTimeout = useRef(null);

  // Lista de círculos interactivos que muestran detalles de cada prenda
  const circles = [
    { top: '30%', left: '43%', img: './sources/pantalon (1).png', link: '#', name: 'Pantalón', description: 'Pantalón cómodo y moderno.' },
    { top: '63%', left: '56%', img: './sources/championes (1).png', link: '#', name: 'Championes', description: 'Championes deportivos.' },
    { top: '8%', left: '65%', img: './sources/canguro (1).png', link: '#', name: 'Canguro', description: 'Canguro abrigado.' },
  ];

  // Muestra el preview al pasar el mouse o enfocar el círculo
  const handleMouseEnter = (index) => {
    clearTimeout(previewTimeout.current);
    previewTimeout.current = setTimeout(() => {
      setPreviewVisible(true);
      setPreviewIndex(index);
    }, 200);
  };

  // Oculta el preview al quitar el mouse o perder el foco
  const handleMouseLeave = () => {
    clearTimeout(previewTimeout.current);
    previewTimeout.current = setTimeout(() => {
      setPreviewVisible(false);
      setPreviewIndex(null);
    }, 200);
  };

  // Redirige al enlace del producto al hacer click
  const handleClick = (index) => {
    window.location.href = circles[index].link;
  };

  // Permite activar el preview con teclado (accesibilidad)
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick(index);
    }
  };

  // Renderiza la sección de outfit destacado y los previews interactivos
  return (
    <section className="outfit-destacado">
      {/* Título de la sección */}
      <h2>Outfit Destacado</h2>
      <div className="outfit-wrapper">
        <div className="outfit-container">
          {/* Imagen principal del outfit */}
          <img src="./sources/outfit (1).png" alt="Outfit completo" className="outfit-img" />
          {/* Círculos interactivos para cada prenda */}
          {circles.map((c, i) => (
            <div
              key={i}
              className="info-circle"
              style={{ top: c.top, left: c.left, outline: 'none', cursor: 'pointer' }}
              tabIndex={0}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
              onFocus={() => handleMouseEnter(i)}
              onBlur={handleMouseLeave}
              onClick={() => handleClick(i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              aria-label={`Vista previa de ${c.name}`}
            ></div>
          ))}
        </div>

        {/* Preview de la prenda seleccionada */}
        <div className={`product-preview${previewVisible && previewIndex !== null ? ' active' : ''}`}>
          {previewVisible && previewIndex !== null && (
            <a href={circles[previewIndex].link} target="_blank" rel="noreferrer">
              <img src={circles[previewIndex].img} alt="Producto" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}