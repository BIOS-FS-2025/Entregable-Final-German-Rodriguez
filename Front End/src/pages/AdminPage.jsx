import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/adminPage.css';
import { AuthContext } from '../components/context/AuthContext.jsx';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function AdminPage() {
  const { user } = useContext(AuthContext); // Traemos usuario logueado
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const usersRes = await fetch('http://localhost:4000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const usersData = await usersRes.json();
        if (!usersRes.ok) throw new Error(usersData.message || 'Error al obtener usuarios');

        const productsRes = await fetch('http://localhost:4000/api/admin/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const productsData = await productsRes.json();
        if (!productsRes.ok) throw new Error(productsData.message || 'Error al obtener productos');

        setUsers(usersData.data);
        setProducts(productsData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="loading-text">Cargando datos...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
      <header><Navbar /></header>
      <main className="admin-page">
        <div className="admin-card">
          {/* Saludo */}
          <div className="admin-welcome">
            <h1>Bienvenido al Panel, {user?.username || 'Admin'}</h1>
          </div>

          {/* Tablas lado a lado */}
          <div className="tables-wrapper">
            {/* Tabla Usuarios */}
            <section className="admin-section">
              <h2>Usuarios</h2>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Ubicación</th>
                      <th>Género</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>{u.location || 'Sin especificar'}</td>
                        <td>{u.gender || 'Sin especificar'}</td>
                        <td>
                            <div className="actions-container">
                                <button className="btn-edit"><i className="fas fa-pen"></i></button>
                                <button className="btn-delete"><i className="fas fa-trash"></i></button>
                            </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Tabla Productos */}
            <section className="admin-section">
              <h2>Productos</h2>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Pedidos</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td>{p.name}</td>
                        <td>${p.price}</td>
                        <td>{p.stock}</td>
                        <td>0</td>
                        <td style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-edit">
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <button className="btn-delete">
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}