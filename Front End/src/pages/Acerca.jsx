// Importación del componente de navegación superior
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

// Componente de la página "Acerca de Nosotros"
// Muestra información sobre la empresa y una imagen de construcción
export default function Acerca() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Acerca de Nosotros</h2>
        <p>Ups! Esta página aún se está construyendo…</p>
        <img
          src="https://thumbs.dreamstime.com/b/castor-que-se-usa-como-obrero-de-la-construcci%C3%B3n-en-casco-naranja-protector-con-expresi%C3%B3n-seria-contiene-l%C3%A1piz-y-planos-las-347746119.jpg"
          alt="Castores trabajando"
          style={{ maxWidth: '400px', width: '100%', borderRadius: '8px', marginTop: '1rem' }}
        />
      </div>
      <Footer />
    </>
  );
}