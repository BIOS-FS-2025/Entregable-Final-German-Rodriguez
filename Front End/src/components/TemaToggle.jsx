
// Importación de hooks para manejar estado y efectos
import { useState, useEffect } from 'react';
// Importación de íconos para el botón de tema
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';


// Componente para cambiar entre tema claro y oscuro
export default function TemaToggle() {
  // Estado para saber si el tema es oscuro o claro
  const [oscuro, setOscuro] = useState(false);
  // Frases que se muestran en el banner según el tema
  const fraseClaro = 'Vive tu día sin dejar de ser vos';
  const fraseOscuro = 'Porque la noche merece tu mejor versión';

  // Al montar el componente, lee el tema guardado en localStorage
  useEffect(() => {
    const savedTema = localStorage.getItem('tema');
    if (savedTema === 'oscuro') {
      setOscuro(true);
      document.body.classList.add('tema-oscuro');
    }
  }, []);

  // Cada vez que cambia el tema, actualiza el body y el texto del banner
  useEffect(() => {
    const textoBanner = document.getElementById('texto-banner');
    if (oscuro) {
      document.body.classList.add('tema-oscuro');
      if (textoBanner) textoBanner.textContent = fraseOscuro;
      localStorage.setItem('tema', 'oscuro');
    } else {
      document.body.classList.remove('tema-oscuro');
      if (textoBanner) textoBanner.textContent = fraseClaro;
      localStorage.setItem('tema', 'claro');
    }
  }, [oscuro]);

  // Renderiza el botón para cambiar el tema
  return (
    <a
      href="#"
      className="tema-toggle-icon"
      id="temaBtn"
      aria-label="Cambiar tema"
      onClick={e => { e.preventDefault(); setOscuro(!oscuro); }}
    >
      {/* Ícono que cambia según el tema */}
      <FontAwesomeIcon icon={oscuro ? faSun : faMoon} />
    </a>
  );
}