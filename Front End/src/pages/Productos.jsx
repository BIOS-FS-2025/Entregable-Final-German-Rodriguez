import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/context/AuthContext.jsx";
import "../styles/productos-catalogo.css";

export default function Productos() {
  const { user, token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para filtros
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 0,
    category: "todos",
    brand: "todos"
  });

  // Estado para ordenamiento
  const [sortBy, setSortBy] = useState("relevancia");

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const API_BASE = "http://localhost:4000/api/items";

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Ajustar página cuando cambian filtros/orden/productos
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, products]);

  // Función para obtener productos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_BASE);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
      } else {
        setError("Error al cargar productos");
        setProducts([]);
      }
    } catch (err) {
      setError("Error de conexión");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Ajustar priceMin y priceMax automáticamente según productos
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => parseFloat(p.price) || 0);
      setFilters(prev => ({
        ...prev,
        priceMin: Math.min(...prices),
        priceMax: Math.max(...prices)
      }));
    }
  }, [products]);

  // Manejo de cambios en filtros
  const handleMinPriceChange = (value) => {
    const numValue = parseInt(value) || 0;
    setFilters(prev => ({ ...prev, priceMin: Math.min(numValue, prev.priceMax) }));
  };

  const handleMaxPriceChange = (value) => {
    const numValue = parseInt(value) || 0;
    setFilters(prev => ({ ...prev, priceMax: Math.max(numValue, prev.priceMin) }));
  };

  const handleCategoryChange = (e) => {
    setFilters(prev => ({ ...prev, category: e.target.value }));
  };

  const handleBrandChange = (e) => {
    setFilters(prev => ({ ...prev, brand: e.target.value }));
  };

  const resetFilters = () => {
    if (products.length > 0) {
      const prices = products.map(p => parseFloat(p.price) || 0);
      setFilters({
        priceMin: Math.min(...prices),
        priceMax: Math.max(...prices),
        category: "todos",
        brand: "todos"
      });
    } else {
      setFilters({
        priceMin: 0,
        priceMax: 0,
        category: "todos",
        brand: "todos"
      });
    }
    setSortBy("relevancia");
  };

  // Categorías y marcas únicas
  const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = products.filter(product => {
    const price = parseFloat(product.price) || 0;
    const meetsPrice = price >= filters.priceMin && price <= filters.priceMax;
    const meetsCategory = filters.category === "todos" ||
      (product.category && product.category.toLowerCase() === filters.category.toLowerCase());
    const meetsBrand = filters.brand === "todos" ||
      (product.brand && product.brand.toLowerCase() === filters.brand.toLowerCase());
    return meetsPrice && meetsCategory && meetsBrand;
  }).sort((a, b) => {
    switch (sortBy) {
      case "precioMenor":
        return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
      case "precioMayor":
        return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
      case "alfabeticoAZ":
        return (a.name || "").localeCompare(b.name || "");
      case "alfabeticoZA":
        return (b.name || "").localeCompare(a.name || "");
      default:
        return 0;
    }
  });

  // PAGINACIÓN
  const totalItems = filteredAndSortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  const buildPageNumbers = () => {
    const maxVisible = 10;
    const pages = [];
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 4);
      let end = Math.min(totalPages, start + maxVisible - 1);
      if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="productos-page">
      <Navbar />
      <div className="productos-container">
        {/* SIDEBAR DE FILTROS */}
        <aside className="filtros-sidebar">
          <h2 className="filtros-titulo">Filtros</h2>

          {/* Filtro de categoría */}
          <div className="filtro-grupo">
            <label className="filtro-subtitulo">Categoría</label>
            <select
              value={filters.category}
              onChange={handleCategoryChange}
              className="filtro-select"
            >
              <option value="todos">Todas</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Filtro de marca */}
          <div className="filtro-grupo">
            <label className="filtro-subtitulo">Marca</label>
            <select
              value={filters.brand}
              onChange={handleBrandChange}
              className="filtro-select"
            >
              <option value="todos">Todas</option>
              {uniqueBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Filtro de precio */}
          <div className="filtro-grupo">
            <label className="filtro-subtitulo">Rango de Precio</label>

            <div className="precio-inputs">
              <div className="precio-input-group">
                <label>Mín</label>
                <input
                  type="number"
                  placeholder={filters.priceMin} // valor como guía
                  value={filters.priceMinInput || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceMinInput: e.target.value }))}
                  onBlur={() => handleMinPriceChange(filters.priceMinInput)}
                />
              </div>
              <div className="precio-input-group">
                <label>Máx</label>
                <input
                  type="number"
                  placeholder={filters.priceMax} // valor como guía
                  value={filters.priceMaxInput || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceMaxInput: e.target.value }))}
                  onBlur={() => handleMaxPriceChange(filters.priceMaxInput)}
                />
              </div>
            </div>
          </div>

          <button onClick={resetFilters} className="boton-resetear-filtros">
            Limpiar Filtros
          </button>
        </aside>

        {/* ÁREA DE PRODUCTOS */}
        <section className="productos-seccion">
          <div className="productos-header">
            <div className="productos-info"></div>
            <div className="ordenar-container">
              <label className="ordenar-label">Ordenar por:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="ordenar-select"
              >
                <option value="relevancia">Relevancia</option>
                <option value="precioMenor">Precio: más bajo a más alto</option>
                <option value="precioMayor">Precio: más alto a más bajo</option>
                <option value="alfabeticoAZ">Nombre: A a Z</option>
                <option value="alfabeticoZA">Nombre: Z a A</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="productos-loading"><p>Cargando productos...</p></div>
          ) : error ? (
            <div className="productos-error"><p>{error}</p></div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="productos-vacio"><p>No se encontraron productos con los filtros seleccionados</p></div>
          ) : (
            <>
              <div className="productos-grid">
                {paginatedProducts.map((product) => {
                  const imagePath = product.image
                    ? (Array.isArray(product.image) ? product.image[0] : product.image)
                    : null;
                  const imageUrl = imagePath
                    ? (imagePath.startsWith('http') ? imagePath : `http://localhost:4000${imagePath}`)
                    : null;

                  return (
                    <div key={product._id} className="producto-card">
                      <div className="producto-imagen-wrapper">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="producto-imagen"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="producto-imagen-placeholder">Sin imagen</div>
                        )}
                      </div>

                      <div className="producto-info">
                        <h3 className="producto-nombre">{product.name}</h3>
                        <p className="producto-descripcion">{product.description}</p>
                        <div className="producto-precio-stock">
                          <span className="producto-precio">${product.price}</span>
                          <span className={`producto-stock ${parseInt(product.stock) > 0 ? "disponible" : "agotado"}`}>
                            {parseInt(product.stock) > 0 ? `Stock: ${product.stock}` : "Agotado"}
                          </span>
                        </div>
                        <button
                          className="boton-agregar-carrito"
                          disabled={parseInt(product.stock) === 0}
                        >
                          Agregar al Carrito
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pagination" role="navigation" aria-label="Paginación de productos">
                {buildPageNumbers().map(num => (
                  <button
                    key={num}
                    className={`page-number ${num === currentPage ? "active" : ""}`}
                    onClick={() => setCurrentPage(num)}
                    aria-current={num === currentPage ? "page" : undefined}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}