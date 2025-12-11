# 🛍️ Proyecto Final Full Stack

## 📌 Nombre del Proyecto y Descripción

Mi proyecto final es una app de una tienda online (**eCommerce**) desarrollada con React (Frontend) y Node.js/Express (Backend), con MongoDB como base de datos. Incluye sistema de autenticación con JWT, CRUD completo de productos, carrito interactivo y rutas protegidas.

## 📦 Instalación

### Backend

```bash
cd "Back End"
npm install
```

Crea un archivo `.env` con las variables (ver sección de abajo)

### Frontend

```bash
cd "Front End"
npm install
```

---

## ▶️ Ejecución

### Terminal 1 - Backend

```bash
cd "Back End"
npm run dev
```

✅ Backend: `http://localhost:4000`

### Terminal 2 - Frontend

```bash
cd "Front End"
npm run dev
```

✅ Frontend: `http://localhost:5173`

---

## 🔐 Variables de Entorno

### Backend - `.env`

```env
PORT=4000
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/dbname
JWT_SECRET=tu_clave_secreta_aqui
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_app
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend - `.env`

```env
VITE_API_BASE_URL=http://localhost:4000
```

## Tecnologías usadas

Listado detallado de las tecnologías y librerías empleadas en el proyecto:

- Backend:
	- Node.js (runtime)
	- Express (framework HTTP)
	- MongoDB (base de datos)
	- Mongoose (ODM)
	- JSON Web Tokens (`jsonwebtoken`) para autenticación
	- `bcryptjs` para hash de contraseñas
	- `nodemailer` para envío de emails
	- `cors` para política CORS
	- `dotenv` para variables de entorno
	- `nodemon` (dev) para recarga automática en desarrollo

- Frontend:
	- React 19
	- Vite (bundler / dev server)
	- React Router DOM (ruteo)
	- Context API (manejo de estado global - `AuthContext`, `CarritoContext`)
	- FontAwesome (íconos)

- Herramientas y prácticas adicionales:
	- CSS personalizado (archivos en `src/styles/`)
	- ESLint (configuración en `Front End/eslint.config.js`)
	- Uso de `localStorage` para persistencia de token de sesión
	- OBS / herramientas de grabación recomendadas para la demo