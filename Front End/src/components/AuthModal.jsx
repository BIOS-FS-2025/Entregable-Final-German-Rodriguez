import React, { useState, useContext, useEffect } from 'react';
import '../styles/authModal.css';
import { AuthContext } from './context/AuthContext.jsx';

export default function AuthModal({ isOpen, onClose }) {
  const { login } = useContext(AuthContext);
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [show, setShow] = useState(false);
  const [formShow, setFormShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setTimeout(() => setFormShow(true), 200);
    } else {
      setFormShow(false);
      setTimeout(() => setShow(false), 200);
    }
  }, [isOpen]);

  const handleModeChange = (newMode) => {
    setFormShow(false);
    setTimeout(() => {
      setMode(newMode);
      setError(null);
      setFieldErrors({});
      setEmail('');
      setPassword('');
      setUsername('');
      setFormShow(true);
    }, 200);
  };

  const backend = 'http://localhost:4000';

  const validate = () => {
    const errs = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Email inválido';
    if (!password || password.length < 6)
      errs.password = 'La contraseña debe tener al menos 6 caracteres';
    if (mode === 'register' && (!username || username.trim().length < 2))
      errs.username = 'El nombre debe tener al menos 2 caracteres';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // --- LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${backend}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error en login');
        return;
      }

      const user = data.data?.user;
      const token = data.data?.token;
      if (user && token) {
        login(user, token);
        onClose();
      } else {
        setError('Respuesta inesperada del servidor');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // --- REGISTRO ---
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${backend}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error en registro');
        return;
      }

      // 🔹 El backend ya envía el correo de registro.
      // 🔹 No llamamos a /login aquí para evitar que se envíe el correo de login.
      // 🔹 En cambio, el backend devolverá el token tras el registro (si lo configuraste así).
      const user = data.data?.user;
      const token = data.data?.token;

      if (user && token) {
        login(user, token);
        onClose();
      } else {
        setError('Registro completado, pero no se recibió token');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !show) return null;

  return (
    <div className={`auth-backdrop ${show ? 'show' : ''}`} onClick={onClose}>
      <div className={`auth-card ${show ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
        <h3>{mode === 'login' ? 'Iniciar sesión' : 'Registro'}</h3>

        {error && (
          <div className={`auth-error ${error ? 'show' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              />
            </svg>
            {error}
          </div>
        )}

        <form
          onSubmit={mode === 'login' ? handleLogin : handleRegister}
          className={`auth-form ${formShow ? 'show' : ''}`}
        >
          {mode === 'register' && (
            <label>
              Nombre
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu nombre"
                className={fieldErrors.username ? 'error' : ''}
              />
              {fieldErrors.username && (
                <div className={`field-error ${fieldErrors.username ? 'show' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                  {fieldErrors.username}
                </div>
              )}
            </label>
          )}

          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="tu@correo.com"
              className={fieldErrors.email ? 'error' : ''}
            />
            {fieldErrors.email && (
              <div className={`field-error ${fieldErrors.email ? 'show' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
                {fieldErrors.email}
              </div>
            )}
          </label>

          <label>
            Contraseña
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="********"
              className={fieldErrors.password ? 'error' : ''}
            />
            {fieldErrors.password && (
              <div className={`field-error ${fieldErrors.password ? 'show' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
                {fieldErrors.password}
              </div>
            )}
          </label>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Procesando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <div className={`auth-switch ${formShow ? 'show' : ''}`}>
          {mode === 'login' ? (
            <p>
              ¿No tenés cuenta?{' '}
              <button className="link-button" onClick={() => handleModeChange('register')}>
                Crear una
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tenés cuenta?{' '}
              <button className="link-button" onClick={() => handleModeChange('login')}>
                Iniciar sesión
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}