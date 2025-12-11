import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTruckFast } from '@fortawesome/free-solid-svg-icons'

export default function Banner() {
  return (
    <>
      <div className="banner">
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <h1>Side Track</h1>
          <p id="texto-banner">Tu tienda online de moda y estilo</p>
          <Link to="/productos">
            <button className="banner-btn" id="boton-banner">Ver productos</button>
          </Link>
        </div>
      </div>

      <div className="delivery-wrapper">
        <section className="delivery-banner">
          <h2>¡Recibí tu compra en el día!</h2>
          <h3>Comprá antes de las 15hs y recibí tu pedido en Montevideo hoy. <FontAwesomeIcon icon={faTruckFast} /></h3>
        </section>
      </div>
    </>
  )
}