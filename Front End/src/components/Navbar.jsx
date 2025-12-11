
// Importación de íconos y utilidades para la barra de navegación
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
// Importación del componente para cambiar el tema
import TemaToggle from './TemaToggle.jsx';
import { useContext, useState } from 'react';
import { CarritoContext } from "./context/CarritoContext.jsx";
import AuthModal from './AuthModal.jsx';
import { AuthContext } from './context/AuthContext.jsx';

function Navbar() {
  const { carrito, actualizarCantidad, removerDelCarrito } = useContext(CarritoContext);
  const { user } = useContext(AuthContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  // Renderiza la barra de navegación y sus elementos
  return (
    <>
      {/* Franja superior con mensajes de promociones */}
      <div className="franja">
        <div className="texto">
          <span>ENVÍOS GRATIS A PARTIR DE $3000</span>
          <span>10% OFF EN TU PRIMERA COMPRA</span>
          <span>NO HACEMOS RESTOCK</span>
          <span>ACEPTAMOS TODAS LAS TARJETAS</span>
        </div>
      </div>

      {/* Barra de navegación principal */}
      <nav className="navbar">
        <div className="logo-categorias">
          {/* Logo de la tienda, redirige al inicio */}
          <Link to="/" className="logo-redirect">
            <div className="logo">
              <img src="./sources/attachment_131590758-removebg-preview (1).png" alt="Logo" />
            </div>
          </Link>

          {/* Menú de categorías y submenús */}
          <ul className="nav-categorias">
            <li>
              <a href="#">Hombre</a>
              <ul className="submenu">
                <li><Link to="/acerca">Hoodies</Link></li>
                <li><Link to="/acerca">Buzos</Link></li>
                <li><Link to="/acerca">Remeras</Link></li>
                <li><Link to="/acerca">Pantalones</Link></li>
                <li><Link to="/acerca">Bermudas</Link></li>
                <li><Link to="/acerca">Accesorios</Link></li>
              </ul>
            </li>
            <li>
              <a href="#">Mujer</a>
              <ul className="submenu">
                <li><Link to="/acerca">Hoodies</Link></li>
                <li><Link to="/acerca">Buzos</Link></li>
                <li><Link to="/acerca">Remeras</Link></li>
                <li><Link to="/acerca">Pantalones</Link></li>
                <li><Link to="/acerca">Bermudas</Link></li>
                <li><Link to="/acerca">Accesorios</Link></li>
              </ul>
            </li>
            <li>
              <a href="#">Ofertas</a>
              <ul className="submenu">
                <li><Link to="/acerca">Exclusivo por Web</Link></li>
                <li><Link to="/acerca">Winter Sale</Link></li>
                <li><Link to="/acerca">Hasta 50% OFF</Link></li>
                <li><Link to="/acerca">New Arrivals</Link></li>
              </ul>
            </li>
            <li>
              <a href="#">Trabaja con nosotros</a>
              <ul className="submenu">
                <li><Link to="/acerca">Centro</Link></li>
                <li><Link to="/acerca">Pocitos</Link></li>
                <li><Link to="/acerca">Malvín</Link></li>
                <li><Link to="/acerca">Tres Cruces</Link></li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Iconos de carrito, perfil y cambio de tema */}
        <div className="iconos">
          {/* Icono del carrito con total y menú desplegable */}
          <div className="carrito">
            <a href="#" className="carrito-icon tema-toggle-icon">
              <FontAwesomeIcon icon={faCartShopping} />
              <span className="carrito-count">
                ${carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0).toFixed(2)}
              </span>
            </a>
            <ul className="submenu carrito-submenu">
              {carrito.length === 0 ? (
                <li style={{ padding: "10px 20px", fontStyle: "italic" }}>Tu carrito está vacío.</li>
              ) : (
                carrito.map((p) => (
                  <li key={p.id} className="carrito-item">
                    <img src={p.imgDefault} alt={p.nombre} />
                    <div className="carrito-item-info">
                      <div className="nombre">{p.nombre}</div>
                      <div className="precio">${p.precio.toFixed(2)}</div>
                    </div>
                    <div className="carrito-item-cantidad">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (p.cantidad === 1) {
                            removerDelCarrito(p.id);
                          } else {
                            actualizarCantidad(p.id, p.cantidad - 1);
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <span>{p.cantidad}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          actualizarCantidad(p.id, p.cantidad + 1);
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Icono de perfil de usuario */}
          <div className="perfil">
            <a
              href="#"
              className="perfil-icon tema-toggle-icon"
              onClick={(e) => {
                e.preventDefault();
                if (user) {
                  // si está logueado, ir a la página de cuenta
                  navigate('/mi-cuenta');
                } else {
                  // si no, abrir modal de login/registro
                  setShowAuthModal(true);
                }
              }}
            >
              <FontAwesomeIcon icon={faUser} />
            </a>
          </div>
          {/* Modal de autenticación */}
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
          {/* Botón para cambiar el tema claro/oscuro */}
          <TemaToggle />
        </div>
      </nav>
    </>
  );
}

export default Navbar;