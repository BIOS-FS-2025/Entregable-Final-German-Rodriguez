import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp, faInstagram, faReact } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons'
import { faCcVisa, faCcMastercard, faCcPaypal, faCcApplePay } from '@fortawesome/free-brands-svg-icons'

export default function Footer() {
  return (
    <div className="footer-wrapper">
      <footer>
        <div className="footer-container">
          <div className="footer-section">
            <h4>Contacto</h4>
            <ul>
              <li className="wpp"><FontAwesomeIcon icon={faWhatsapp} /> <a href="https://wa.me/123456789" target="_blank" rel="noopener noreferrer">+598 123 456 789</a></li>
              <li className="ig"><FontAwesomeIcon icon={faInstagram} /> <a href="https://instagram.com/tuempresa" target="_blank" rel="noopener noreferrer">@tuempresa</a></li>
              <li className="gm"><FontAwesomeIcon icon={faEnvelope} /> <a href="mailto:info@tuempresa.com">info@tuempresa.com</a></li>
              <li><FontAwesomeIcon icon={faClock} /> Lun - Vie: 9:00 - 18:00</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Sobre Nosotros</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae justo in urna facilisis sollicitudin.</p>
          </div>

          <div className="footer-section">
            <h4>Métodos de Pago</h4>
            <div className="payment-icons">
              <FontAwesomeIcon icon={faCcVisa} />
              <FontAwesomeIcon icon={faCcMastercard} />
              <FontAwesomeIcon icon={faCcPaypal} />
              <FontAwesomeIcon icon={faCcApplePay} />
            </div>
          </div>

          <div className="footer-section map-container">
            <h4>Ubicación</h4>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1945.543673790286!2d-56.14076744740925!3d-34.90641432607595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2suy!4v1756233958413!5m2!1ses-419!2suy"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; 2025 Todos los derechos reservados</span>
          <a href="#" className="gerdev-link"><FontAwesomeIcon icon={faReact} /><span> By GerDev</span></a>
        </div>
      </footer>
    </div>
  )
}