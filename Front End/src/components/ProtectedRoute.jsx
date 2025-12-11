import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

/**
 * Componente para proteger rutas que requieren autenticación
 * Si el usuario no está autenticado, redirige a la página de inicio
 * Si está autenticado, muestra el componente solicitado
 */
export default function ProtectedRoute({ children }) {
  const { user, token } = useContext(AuthContext);

  // Verificar si el usuario está autenticado
  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
