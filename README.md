# 🛒 ECommerce Frontend

Una **plataforma de comercio electrónico moderna y escalable** construida con tecnologías de punta, enfocada en ofrecer una experiencia de usuario excepcional tanto para clientes como para administradores.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06b6d4?style=flat-square&logo=tailwindcss)

---

## 📋 Descripción General

Este proyecto es el **frontend integral de una plataforma de ecommerce**, diseñado e implementado siguiendo mejores prácticas de desarrollo moderno. Incluye funcionalidades completas tanto para usuarios finales como para administradores, con integración en tiempo real con APIs RESTful y sistemas de pago como MercadoPago.

### 🎯 Casos de Uso Principales

- **Clientes**: Explorar productos, aplicar filtros, buscar, gestionar carrito, realizar compras y seguimiento de pedidos
- **Administradores**: Gestión completa de productos, categorías, usuarios, ordenes y análisis de datos

---

## 🚀 Stack Tecnológico

### Frontend
- **Next.js 16**: Framework React con soporte SSR, SSG y optimizaciones automáticas
- **React 19**: Librería UI moderna con hooks y componentes funcionales
- **TypeScript 5**: Tipado estricto para mayor seguridad y mantenibilidad del código
- **Tailwind CSS 4**: Diseño responsivo y personalizable con utilidades CSS

### Gestión de Estado & Comunicación
- **React Query (@tanstack/react-query)**: Sincronización de data del servidor con caché inteligente
- **Axios**: Cliente HTTP para consumo de APIs con interceptores configurados
- **Context API**: Manejo de estado global (autenticación, notificaciones)

### Librerías Complementarias
- **@mercadopago/sdk-react**: Integración de pagos con MercadoPago
- **jwt-decode**: Parseo de JSON Web Tokens para autenticación
- **Lucide React**: Iconografía moderna y personalizable

---

## 📁 Estructura del Proyecto

```
├── app/
│   ├── admin/                    # Panel administrativo
│   │   ├── products/            # Gestión de productos
│   │   ├── categories/          # Gestión de categorías
│   │   ├── users/              # Gestión de usuarios
│   │   ├── orders/             # Gestión de órdenes
│   │   └── AdminShell.tsx       # Layout principal del admin
│   │
│   ├── products/                # Catálogo de productos
│   ├── cart/                    # Carrito de compras
│   ├── checkout/                # Flujo de pago
│   ├── profile/                 # Perfil de usuario
│   ├── login/ & register/       # Autenticación
│   │
│   ├── components/              # Componentes reutilizables
│   │   ├── Header.tsx           # Encabezado principal
│   │   ├── AuthProvider.tsx     # Proveedor de autenticación
│   │   ├── NotificationProvider # Sistema de notificaciones
│   │   ├── SearchBar.tsx        # Búsqueda global
│   │   ├── FiltersSidebar.tsx   # Filtros de productos
│   │   └── ...
│   │
│   ├── layout.tsx               # Layout raíz con providers
│   ├── page.tsx                 # Página de inicio
│   └── globals.css              # Estilos globales
│
├── lib/
│   ├── api/                     # Servicios HTTP
│   │   ├── axios.ts             # Configuración de cliente HTTP
│   │   ├── products.ts          # CRUD de productos
│   │   ├── categories.ts        # CRUD de categorías
│   │   ├── orders.ts            # Gestión de órdenes
│   │   ├── auth.ts              # Autenticación
│   │   ├── payment.ts           # Procesamiento de pagos
│   │   ├── adminUsers.ts        # Gestión de usuarios (admin)
│   │   ├── adminOrders.ts       # Gestión de órdenes (admin)
│   │   └── cart.ts              # Carrito de compras
│   │
│   ├── types/                   # Definiciones TypeScript
│   │   ├── product.ts           # Tipos de productos
│   │   ├── order.ts             # Tipos de órdenes
│   │   ├── category.ts          # Tipos de categorías
│   │   ├── user.ts              # Tipos de usuarios
│   │   ├── filters.ts           # Tipos de filtros
│   │   └── ...
│   │
│   └── utils/                   # Funciones utilitarias
│       ├── generalUtils.ts      # Utilidades generales
│       ├── orderStatus.ts       # Mapeo de estados de órdenes
│       └── globalNotifier.ts    # Sistema global de notificaciones
│
├── public/                      # Activos estáticos
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.js
└── eslint.config.mjs
```

---

## ✨ Características Principales

### 👥 Para Usuarios

#### 🏠 Página de Inicio
- Catálogo de productos ordenado por popularidad
- Carruseles de productos por categoría
- Promociones destacadas
- Búsqueda inteligente

#### 🔍 Exploración de Productos
- Búsqueda avanzada con filtros múltiples
- Filtrado por categoría, precio, ratings
- Paginación eficiente
- Modal de detalle de producto

#### 🛍️ Carrito de Compras
- Gestión dinámica de items
- Persistencia de datos
- Cálculo automático de totales
- Validación de inventario

#### 💳 Checkout & Pagos
- Integración con MercadoPago
- Flujo multipasos seguro
- Confirmación en tiempo real
- Gestión de estados de pago (success, pending, failure)

#### 👤 Perfil de Usuario
- Información personal
- Historial de órdenes
- Seguimiento de pedidos
- Historial de direcciones

#### 📦 Gestión de Órdenes
- Vista detallada de cada compra
- Estados de orden en tiempo real
- Descarga de facturas
- Soporte para múltiples estados (Pending, Paid, Shipped, Delivered, Cancelled)

### 🔐 Autenticación
- Login y registro seguros
- JWT para mantener sesiones
- Verificación automática de autenticación
- Context API para estado global del usuario

### 🔔 Notificaciones
- Sistema de notificaciones global
- Alertas de éxito, error, warning
- Integración con eventos de la aplicación
- Feedback visual instantáneo

---

### 👨‍💼 Para Administradores

#### 📦 Gestión de Productos
- CRUD completo de productos
- Carga de imágenes
- Gestión de inventario
- Categorización automática
- Búsqueda y filtros avanzados

#### 🏷️ Gestión de Categorías
- Crear, editar y eliminar categorías
- Asociación de productos
- Validación de datos

#### 👥 Gestión de Usuarios
- Visualización de todos los usuarios
- Filtrado por estado, rol
- Edición de datos de usuario
- Tabla paginada y responsiva

#### 📋 Gestión de Órdenes
- Vista de todas las órdenes
- Filtrado por estado, cliente, fecha
- Actualización de estados
- Detalles completos de orden
- Modal para edición rápida

#### 🎛️ Panel Administrativo
- Interfaz limpia y eficiente
- Sidebar de navegación
- Acceso basado en roles
- Protección de rutas

---

## 🛠️ Instalación

### Requisitos Previos
- Node.js 18+ 
- npm o yarn
- Variables de entorno configuradas (ver `.env.example`)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/ecommerce-frontend.git
   cd ecommerce-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o con yarn
   yarn install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   # Completar con tus valores
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   # o con yarn
   yarn dev
   ```

   La aplicación estará disponible en `http://localhost:3000`

5. **Construir para producción**
   ```bash
   npm run build
   npm start
   ```

---

## 🏗️ Arquitectura

### Patrones Implementados

#### 📡 API Layer
- **Servicios HTTP**: Cada módulo (productos, órdenes, usuarios) tiene su propio servicio
- **Interceptores de Axios**: Manejo automático de tokens, errores y timeouts
- **Manejo de Errores**: Tipado y propagación consistente de errores

```typescript
// Ejemplo: productService
const productService = {
  getAll: (filters) => api.get('/products', { params: filters }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};
```

#### 🎣 Hooks Personalizados
- Reutilización de lógica en componentes
- Separación de concerns
- Hooks para fetching, mutations, state management

#### 📦 Context API
- Autenticación global (`AuthProvider`)
- Notificaciones globales (`NotificationProvider`)
- Acceso a través de hooks personalizados

```typescript
const { user, loadingAuth, refresh } = useAuth();
const { setNotification } = useNotification();
```

#### 🎨 Componentes Funcionales
- Componentes sin clase, usando hooks
- Props bien tipadas con TypeScript
- Componentes cliente cuando es necesario (`"use client"`)

#### 🔐 Control de Acceso
- Rutas protegidas que requieren autenticación
- Validación de roles (admin vs usuario)
- Redirección automática en caso de falta de permisos

---

## 🔌 Integración con Backend

Este frontend se conecta con un **backend .NET** que proporciona:

- **API REST** con endpoints para productos, órdenes, usuarios
- **Autenticación** JWT
- **Base de datos** relacional (SQL Server/PostgreSQL)
- **Procesamiento de pagos** vía MercadoPago
- **Gestión de órdenes** con estados

### Variables de Entorno Necesarias

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# MercadoPago
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=tu_public_key

# Cloudinary (para imágenes)
NEXT_PUBLIC_CLOUDINARY_BANNER_URL_MAIN_PAGE=tu_url
```

---

## 🧪 Calidad de Código

### TypeScript Estricto
- Configuración `strict: true` en `tsconfig.json`
- Tipado exhaustivo de funciones y variables
- Detección de errores en tiempo de compilación

### Linting
```bash
npm run lint
```
- ESLint configurado con reglas de Next.js
- Formateo consistente de código

### Buenas Prácticas
- ✅ Componentes pequeños y reutilizables
- ✅ Separación clara de responsabilidades
- ✅ Manejo de errores en todas las operaciones
- ✅ Caché inteligente con React Query
- ✅ Código DRY (Don't Repeat Yourself)
- ✅ Nombres significativos y claros

---

## 📱 Responsividad

- Diseño **mobile-first** con Tailwind CSS
- Componentes adaptables a diferentes tamaños de pantalla
- Menús específicos para mobile
- Tablas responsivas en admin

---

## 🚀 Optimizaciones

- **Next.js Image Optimization**: Carga optimizada de imágenes
- **Code Splitting**: Carga dinámica de componentes
- **Caching**: React Query para caché inteligente del servidor
- **Lazy Loading**: Carga perezosa de componentes cuando es necesario

---

## 📚 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo en puerto 3000 |
| `npm run build` | Compila la aplicación para producción |
| `npm start` | Inicia servidor de producción |
| `npm run lint` | Ejecuta linter para validar código |

---

## 🔄 Flujo de Compra (User Experience)

```
Inicio
  ↓
Explorar Productos → Buscar/Filtrar
  ↓
Ver Detalle Producto
  ↓
Agregar al Carrito
  ↓
Ir a Carrito → Editar Items
  ↓
Ir a Checkout
  ↓
Datos de Envío
  ↓
Confirmación de Compra
  ↓
Pago con MercadoPago
  ↓
Confirmación → Perfil/Órdenes
```

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 📞 Contacto & Soporte

Para dudas o problemas técnicos:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo

---