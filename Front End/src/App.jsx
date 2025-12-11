import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import MiCuenta from './pages/MiCuenta'
import ProtectedRoute from './components/ProtectedRoute'
import Banner from './components/Banner'
import CarritoManager from './components/CarritoManager'
import OutfitPreview from './components/OutfitPreview'
import TarjetasView from './components/TarjetasView'
import Footer from './components/Footer'
import Acerca from './pages/Acerca'
import Productos from './pages/Productos'
import { CarritoProvider } from './components/context/CarritoContext'

// NUEVO: Import de la página de admin
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <CarritoProvider>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <header>
                <Navbar />
              </header>

              <main>
                <Banner />
                <CarritoManager />
                <OutfitPreview />
                <TarjetasView />
              </main>

              <Footer />
            </>
          }
        />
        <Route path="/acerca" element={<Acerca />} />
        <Route path="/productos" element={<Productos />} />
        {/* Ruta protegida: Solo accesible si el usuario está autenticado */}
        <Route 
          path="/mi-cuenta" 
          element={
            <ProtectedRoute>
              <MiCuenta />
            </ProtectedRoute>
          } 
        />
        {/* NUEVO: Ruta protegida para admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </CarritoProvider>
  )
}

export default App