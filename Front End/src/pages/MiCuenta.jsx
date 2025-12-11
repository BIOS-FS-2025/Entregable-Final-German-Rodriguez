import React, { useContext, useState, useMemo, useRef } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/miCuenta.css';
import { AuthContext } from '../components/context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const locations = [
  "Artigas, Uruguay",
  "Canelones, Uruguay",
  "Cerro Largo, Uruguay",
  "Colonia, Uruguay",
  "Durazno, Uruguay",
  "Flores, Uruguay",
  "Florida, Uruguay",
  "La Paz, Uruguay",
  "Las Piedras, Uruguay",
  "Lavalleja, Uruguay",
  "Maldonado, Uruguay",
  "Mercedes, Uruguay",
  "Montevideo, Uruguay",
  "Pando, Uruguay",
  "Paysandú, Uruguay",
  "Río Negro, Uruguay",
  "Rivera, Uruguay",
  "Rocha, Uruguay",
  "Salto, Uruguay",
  "San José, Uruguay",
  "Soriano, Uruguay",
  "Tacuarembó, Uruguay",
  "Treinta y Tres, Uruguay"
].sort();

export default function MiCuenta() {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    location: user?.location || 'Sin especificar',
    gender: user?.gender || 'Sin especificar',
    password: '',
    newPassword: ''
  });
  const [isEditing, setIsEditing] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verificationModal, setVerificationModal] = useState({ open: false, field: null, code: '', error: '' });
  const [deleteModal, setDeleteModal] = useState({ open: false, code: '', stage: 'request', error: '' });
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // ==================== UTILIDADES ====================

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  // ==================== CAMBIOS SIMPLES (sin verificación) ====================

  const handleSimpleUpdate = async (field, value) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');

      const response = await fetch('http://localhost:4000/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [field]: value })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al actualizar');

      setUser(data.data);
      setFormData(prev => ({ ...prev, [field]: value }));
    } catch (err) {
      showError(err.message);
      setFormData(prev => ({ ...prev, [field]: user[field] }));
    } finally {
      setLoading(false);
      setIsEditing(prev => ({ ...prev, [field]: false }));
    }
  };

  // ==================== CAMBIOS CON VERIFICACIÓN ====================

  const requestVerificationCode = async (field) => {
    try {
      setLoading(true);

      // Validar contraseña actual si es cambio de contraseña
      if (field === 'password') {
        // Verificar que la contraseña actual sea correcta mediante el backend
        const token = localStorage.getItem('token');
        const verifyResponse = await fetch('http://localhost:4000/api/auth/verify-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ password: formData.password })
        });

        if (!verifyResponse.ok) {
          showError('Contraseña actual incorrecta');
          setLoading(false);
          return;
        }

        if (formData.password === formData.newPassword) {
          showError('La nueva contraseña no puede ser igual a la actual');
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/auth/request-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ field })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Mostrar modal inmediatamente sin demora
      setVerificationModal({ open: true, field, code: '', error: '' });
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyAndUpdate = async () => {
    try {
      setLoading(true);
      setError(null);

      const { field, code } = verificationModal;
      const token = localStorage.getItem('token');

      let updateData = { verificationCode: code };

      if (field === 'email') {
        if (!formData.email) throw new Error('Email requerido');
        updateData.email = formData.email;
      } else if (field === 'password') {
        if (!formData.password) throw new Error('Contraseña actual requerida');
        if (!formData.newPassword) throw new Error('Nueva contraseña requerida');
        if (formData.newPassword.length < 5) throw new Error('Nueva contraseña mínimo 5 caracteres');
        updateData.password = formData.password;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch('http://localhost:4000/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setUser(data.data);
      setVerificationModal({ open: false, field: null, code: '', error: '' });
      setIsEditing(prev => ({ ...prev, [field]: false }));
      
      if (field === 'email') {
        setFormData(prev => ({ ...prev, email: data.data.email }));
      } else {
        setFormData(prev => ({ ...prev, password: '', newPassword: '' }));
      }
    } catch (err) {
      setVerificationModal(prev => ({ ...prev, error: err.message }));
    } finally {
      setLoading(false);
    }
  };

  // ==================== ELIMINACIÓN DE CUENTA ====================

  const handleDeleteAccountClick = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/auth/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      if (data.requiresCode) {
        setDeleteModal({ open: true, code: '', stage: 'verify', error: '' });
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteAccount = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/auth/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ verificationCode: deleteModal.code })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      showError('');
      logout();
      navigate('/');
    } catch (err) {
      setDeleteModal(prev => ({ ...prev, error: err.message }));
    } finally {
      setLoading(false);
    }
  };

  // ==================== EVENTOS GENERALES ====================

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleEdit = (field) => {
    setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = (field) => {
    if (field === 'password') {
      // Validar contraseña actual ANTES de solicitar código
      if (!formData.password) {
        showError('Ingresa tu contraseña actual');
        return;
      }
      if (!formData.newPassword) {
        showError('Ingresa la nueva contraseña');
        return;
      }
      if (formData.newPassword.length < 5) {
        showError('La nueva contraseña debe tener al menos 5 caracteres');
        return;
      }
      // Solo después de validar, solicitar código
      requestVerificationCode(field);
    } else if (field === 'email') {
      if (!formData.email) {
        showError('Ingresa un email');
        return;
      }
      requestVerificationCode(field);
    } else {
      handleSimpleUpdate(field, formData[field]);
    }
  };

  const handleGenderChange = async (value) => {
    handleSimpleUpdate('gender', value);
  };

  const toggleEditLocation = (bool) => {
    setIsEditing(prev => ({ ...prev, location: bool }));
    if (!bool) {
      setFormData(prev => ({ ...prev, location: user.location }));
    } else {
      // Cuando abre para editar, dejar vacío
      setFormData(prev => ({ ...prev, location: '' }));
    }
  };

  const filteredLocations = useMemo(() => {
    if (!formData.location) return locations;
    return locations.filter(loc => loc.toLowerCase().includes(formData.location.toLowerCase()));
  }, [formData.location]);

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formDataFile = new FormData();
    formDataFile.append('avatar', file);

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/auth/upload-avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataFile
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al actualizar la foto de perfil');
      setUser(data.data);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER ====================

  return (
    <>
      <header><Navbar /></header>
      <main className="mi-cuenta-page">
        <div className="mi-cuenta-card">
          {user ? (
            <>
              <div className="profile-header">
                <div className="welcome-text">
                  <h2>Hola, {user.username}</h2>
                </div>
                <div className="avatar-container" onClick={handleAvatarClick}>
                  <div className="avatar">
                    {user.profilePic ? (
                      <img src={`http://localhost:4000${user.profilePic}`} alt="Avatar" />
                    ) : (
                      <span>{(user.username || 'U').charAt(0).toUpperCase()}</span>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept="image/png, image/jpeg"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>
              </div>

              <div className="profile-info">
                {error && <div className="error-message">{error}</div>}

                {/* NOMBRE */}
                <div className="info-row">
                  <div className="info-label">Nombre:</div>
                  {isEditing.username ? (
                    <div className="edit-field">
                      <input type="text" className="info-input" value={formData.username} onChange={handleChange('username')} />
                      <button onClick={() => handleSave('username')} disabled={loading}>{loading ? '...' : '✓'}</button>
                      <button onClick={() => toggleEdit('username')}>✕</button>
                    </div>
                  ) : (
                    <div className="info-value" onClick={() => toggleEdit('username')}>
                      {user.username}<span className="edit-icon">✎</span>
                    </div>
                  )}
                </div>

                {/* EMAIL */}
                <div className="info-row">
                  <div className="info-label">Email:</div>
                  {isEditing.email ? (
                    <div className="edit-field">
                      <input type="email" className="info-input" value={formData.email} onChange={handleChange('email')} />
                      <button onClick={() => handleSave('email')} disabled={loading}>{loading ? '...' : '✓'}</button>
                      <button onClick={() => toggleEdit('email')}>✕</button>
                    </div>
                  ) : (
                    <div className="info-value" onClick={() => toggleEdit('email')}>
                      {user.email}<span className="edit-icon">✎</span>
                    </div>
                  )}
                </div>

                {/* CONTRASEÑA */}
                <div className="info-row">
                  <div className="info-label">Contraseña:</div>
                  {isEditing.password ? (
                    <div className="edit-field column">
                      <input type="password" className="info-input" placeholder="Contraseña actual" value={formData.password} onChange={handleChange('password')} />
                      <input type="password" className="info-input" placeholder="Nueva contraseña" value={formData.newPassword} onChange={handleChange('newPassword')} />
                      <div className="button-group">
                        <button onClick={() => handleSave('password')} disabled={loading}>{loading ? '...' : 'Guardar'}</button>
                        <button onClick={() => toggleEdit('password')}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <div className="info-value" onClick={() => toggleEdit('password')}>
                      ********<span className="edit-icon">✎</span>
                    </div>
                  )}
                </div>

                {/* UBICACIÓN */}
                <div className="info-row">
                  <div className="info-label">Ubicación:</div>
                  {isEditing.location ? (
                    <div className="edit-field column">
                      <input
                        type="text"
                        className="info-input"
                        value={formData.location}
                        onChange={handleChange('location')}
                        list="locations-list"
                        placeholder="Ingresa tu ubicación"
                      />
                      <datalist id="locations-list">
                        {filteredLocations.map(loc => <option key={loc} value={loc} />)}
                      </datalist>
                      <div className="button-group">
                        <button onClick={() => handleSave('location')} disabled={loading}>{loading ? '...' : '✓'}</button>
                        <button onClick={() => toggleEditLocation(false)}>✕</button>
                      </div>
                    </div>
                  ) : (
                    <div className="info-value" onClick={() => toggleEditLocation(true)}>
                      {user.location}<span className="edit-icon">✎</span>
                    </div>
                  )}
                </div>

                {/* GÉNERO */}
                <div className="info-row">
                  <div className="info-label">Género:</div>
                  <select className="info-value info-select" value={formData.gender} onChange={(e) => handleGenderChange(e.target.value)}>
                    <option value="Sin especificar">Selecciona una opción</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="prefiero no decirlo">Prefiero no decirlo</option>
                  </select>
                </div>

                {/* MÉTODO DE PAGO */}
                <div className="info-row">
                  <div className="info-label">Método de pago:</div>
                  <div className={`info-value ${user.metodoPago ? 'payment-status-ok' : 'payment-status-error'}`}>
                    {user.metodoPago ? 'Tarjeta registrada' : 'No hay método de pago registrado'}
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button className="btn-logout" onClick={handleLogout}>Cerrar Sesión</button>
                <button className="btn-delete" onClick={handleDeleteAccountClick}>Eliminar cuenta</button>

                {user.role === "admin" && (
                  <button
                    className="btn-admin-panel"
                    onClick={() => navigate("/admin")}
                  >
                    Panel de Admin
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="not-logged">
              <p>No estás logueado. Por favor, ingresa para ver tu cuenta.</p>
            </div>
          )}
        </div>
      </main>

      {/* MODAL DE VERIFICACIÓN PARA EMAIL/CONTRASEÑA */}
      {verificationModal.open && (
        <div className="modal-overlay" onClick={() => setVerificationModal({ open: false, field: null, code: '', error: '' })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Verificar {verificationModal.field === 'email' ? 'Email' : 'Contraseña'}</h3>
            <p>Ingresa el código de verificación que fue enviado a tu email</p>
            {verificationModal.error && <div className="modal-error">{verificationModal.error}</div>}
            <input
              type="text"
              className="modal-input"
              placeholder="Código (6 dígitos)"
              maxLength="6"
              value={verificationModal.code}
              onChange={(e) => setVerificationModal(prev => ({ ...prev, code: e.target.value, error: '' }))}
            />
            <div className="modal-buttons">
              <button onClick={verifyAndUpdate} disabled={loading || verificationModal.code.length !== 6} className="btn-confirm">
                {loading ? 'Verificando...' : 'Verificar'}
              </button>
              <button onClick={() => setVerificationModal({ open: false, field: null, code: '', error: '' })} className="btn-cancel">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ELIMINACIÓN DE CUENTA */}
      {deleteModal.open && (
        <div className="modal-overlay" onClick={() => setDeleteModal({ open: false, code: '', stage: 'request', error: '' })}>
          <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
            <h3>⚠️ Eliminar Cuenta</h3>
            {deleteModal.stage === 'verify' ? (
              <>
                <p>Ingresa el código de seguridad que fue enviado a tu email</p>
                <p style={{ fontSize: '12px', color: '#999' }}>Esta acción es irreversible</p>
                {deleteModal.error && <div className="modal-error">{deleteModal.error}</div>}
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Código (6 dígitos)"
                  maxLength="6"
                  value={deleteModal.code}
                  onChange={(e) => setDeleteModal(prev => ({ ...prev, code: e.target.value, error: '' }))}
                />
                <div className="modal-buttons">
                  <button onClick={confirmDeleteAccount} disabled={loading || deleteModal.code.length !== 6} className="btn-delete-confirm">
                    {loading ? 'Eliminando...' : 'Eliminar cuenta'}
                  </button>
                  <button onClick={() => setDeleteModal({ open: false, code: '', stage: 'request', error: '' })} className="btn-cancel">
                    Cancelar
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}