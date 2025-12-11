import React from 'react';
import '../styles/TarjetasView.css';

export default function TarjetasView() {
    // Lista de categorías con imagen y link
    const categorias = [
    { name: 'JEANS', img: '/sources/polos-web.jpg', link: '/catalogo#jeans' },
    { name: 'CAMISETAS', img: '/sources/foto14.webp', link: '/catalogo#remeras' },
    { name: 'BERMUDAS', img: '/sources/bermudafueguito.webp', link: '/catalogo#camperas' },
    { name: 'HOODIES', img: '/sources/hoodie-dolphin-celeste-u.jpg', link: '/catalogo#zapatillas' },
    ];

    const handleClick = (link) => {
        window.location.href = link;
    };

    const handleKeyDown = (e, link) => {
        if (e.key === 'Enter' || e.key === ' ') {
        handleClick(link);
        }
    };

    return (
        <section className="tarjetas-section">
        <h2>Categorías Destacadas</h2>
        <div className="tarjetas-wrapper">
            {categorias.map((cat, index) => (
            <div
                key={index}
                className="tarjeta"
                tabIndex={0}
                onClick={() => handleClick(cat.link)}
                onKeyDown={(e) => handleKeyDown(e, cat.link)}
                aria-label={`Ir a ${cat.name}`}
            >
                <img src={cat.img} alt={cat.name} className="tarjeta-img" />
                <span className="tarjeta-title">{cat.name}</span>
            </div>
            ))}
        </div>
        </section>
    );
}