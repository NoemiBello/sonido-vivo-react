# 🎵 Sonido Vivo

## Plataforma web para tienda de instrumentos musicales

**Sonido Vivo** es una aplicación web desarrollada para una tienda de instrumentos musicales, equipos de sonido y accesorios.

El proyecto fue construido como una **Single Page Application (SPA)** utilizando React y Vite. La aplicación incorpora catálogo de productos, carrito de compras, proceso de compra, autenticación simulada, gestión de usuarios, administración de productos y categorías, pedidos, reportes y servicios técnicos.

El desarrollo corresponde a la Experiencia de Aprendizaje 2 de Fullstack II.

---

# 🚀 Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
|---|---|
| React | Construcción de componentes y vistas |
| JavaScript | Lógica de negocio y manejo de datos |
| Vite | Entorno de desarrollo y compilación |
| React Router | Navegación SPA entre vistas |
| Bootstrap | Diseño responsive y componentes visuales |
| React Bootstrap | Componentes Bootstrap integrados con React |
| React Context | Estado compartido de productos, categorías y carrito |
| localStorage | Persistencia simulada de información |
| Vitest | Ejecución de pruebas |
| React Testing Library | Pruebas de componentes React |
| user-event | Simulación de interacción del usuario |
| jsdom | Entorno DOM para testing |
| Coverage V8 | Medición de cobertura |
| Git | Control de versiones |
| GitHub | Repositorio y colaboración mediante ramas y Pull Requests |
| AWS EC2 | Infraestructura de despliegue |
| Nginx | Servidor web para publicar el build de producción |

---

# ⚛️ Arquitectura frontend

La aplicación está implementada con React.

La navegación entre las diferentes vistas se realiza mediante **React Router**, sin utilizar páginas HTML independientes.

El archivo `index.html` corresponde únicamente al punto de entrada requerido por Vite para montar la aplicación React mediante:

```html
<div id="root"></div>
```

La interfaz de la aplicación se construye mediante componentes `.jsx`.

Los estilos generales del proyecto están integrados desde React mediante:

```text
src/styles/EstilosGlobales.jsx
```

Además se utiliza Bootstrap instalado mediante npm.

No existen hojas `.css` propias independientes dentro de `src`.

---

# 🛍️ Funcionalidades

## Página de inicio

La página principal permite:

- visualizar contenido destacado;
- acceder al catálogo;
- visualizar productos destacados;
- navegar hacia categorías;
- acceder a ofertas;
- ingresar a servicios técnicos;
- acceder al módulo de usuario.

## Catálogo

El catálogo permite:

- visualizar productos;
- buscar productos;
- buscar por código;
- filtrar por categoría;
- mostrar únicamente productos disponibles;
- ordenar productos por precio;
- visualizar ofertas;
- acceder al detalle de cada producto.

Los productos se obtienen desde datos simulados en JavaScript.

## Categorías

La aplicación permite:

- visualizar categorías;
- ingresar al detalle de una categoría;
- visualizar productos asociados;
- navegar hacia el detalle de los productos.

## Detalle de producto

Cada producto puede mostrar:

- nombre;
- código;
- descripción;
- imagen;
- precio;
- descuento;
- categoría;
- stock disponible.

Desde esta vista se puede agregar el producto al carrito.

---

# 🛒 Carrito de compras

El carrito permite:

- agregar productos;
- aumentar cantidades;
- disminuir cantidades;
- escribir directamente una cantidad;
- respetar el stock disponible;
- eliminar productos;
- vaciar el carrito;
- visualizar subtotales;
- calcular el total;
- continuar hacia Checkout.

El contenido del carrito se administra mediante estado compartido utilizando React Context.

---

# 💳 Checkout

El proceso de compra permite:

- ingresar los datos del comprador;
- seleccionar el tipo de entrega;
- elegir despacho o retiro en tienda;
- ingresar dirección cuando corresponde;
- revisar productos y cantidades;
- visualizar el total;
- confirmar la compra.

Al confirmar una compra se crea un pedido simulado con información como:

- identificador;
- usuario;
- fecha;
- estado;
- tipo de entrega;
- productos;
- cantidades;
- precios;
- total.

El pedido queda disponible posteriormente para los módulos de historial, administración y reportes.

---

# 👤 Usuarios y autenticación

La aplicación contiene un sistema de autenticación simulado para esta etapa frontend.

Se incluyen los roles:

- Cliente
- Vendedor
- Administrador

Dependiendo del rol, el usuario es dirigido hacia diferentes áreas de la aplicación.

## Registro

El formulario de registro permite crear nuevos usuarios y contiene validaciones personalizadas para:

- nombre;
- apellido;
- correo electrónico;
- correo repetido;
- contraseña;
- confirmación de contraseña.

## Login

El formulario de Login utiliza validaciones personalizadas realizadas con React.

Se valida:

- correo obligatorio;
- formato correcto del correo;
- contraseña obligatoria;
- contraseña con mínimo 6 caracteres.

Si los datos cumplen las reglas de formato, posteriormente se comprueban las credenciales contra los usuarios simulados.

Cuando las credenciales son incorrectas se muestra:

```text
Correo o contraseña incorrectos.
```

Las validaciones son manejadas desde React y no dependen de los mensajes automáticos del navegador.

---

# 👤 Perfil e historial

Los clientes pueden acceder a:

- información de perfil;
- historial de compras.

El historial obtiene los pedidos asociados al usuario autenticado.

---

# 🛠️ Servicios técnicos

La sección de servicios permite solicitar una revisión simulada de instrumentos de cuerda.

Incluye:

- información sobre el servicio;
- contenido multimedia;
- formulario de solicitud;
- validaciones personalizadas.

Se validan datos como:

- nombre;
- correo;
- teléfono;
- tipo de instrumento;
- descripción del problema;
- aceptación de condiciones.

---

# 📰 Blog

La aplicación incluye:

- listado de publicaciones;
- detalle individual de publicaciones.

Este módulo utiliza información simulada almacenada en JavaScript.

---

# 🧑‍💼 Panel del vendedor

El vendedor puede administrar:

- productos;
- stock;
- productos con stock crítico;
- categorías.

Las funcionalidades incluyen operaciones CRUD:

| Operación | Descripción |
|---|---|
| Create | Crear registros |
| Read | Consultar registros |
| Update | Modificar registros |
| Delete | Eliminar registros |

El sistema también incluye validaciones de productos antes de guardar información.

---

# 🛡️ Panel administrativo

El administrador tiene acceso a diferentes módulos.

## Dashboard

Permite visualizar información general del sistema.

## Administración de usuarios

Permite:

- visualizar usuarios;
- crear usuarios;
- modificar usuarios;
- administrar roles;
- gestionar el estado de los usuarios.

## Administración de pedidos

Permite visualizar pedidos registrados y cambiar su estado.

Estados disponibles:

```text
En preparación
Despachado
Entregado
Cancelado
```

## Reportes

El módulo de reportes presenta indicadores como:

- pedidos registrados;
- pedidos entregados;
- clientes activos;
- ventas correspondientes a pedidos entregados.

---

# 💾 Gestión de datos

Durante esta etapa del proyecto no se utiliza todavía un backend real.

Los datos son simulados mediante archivos JavaScript y persistencia local.

La estructura principal incluye:

```text
src/data/
├── datos.js
├── pedidos.js
├── publicaciones.js
└── usuarios.js
```

También se utilizan funciones auxiliares ubicadas en:

```text
src/utils/
├── productos.js
├── storage.js
└── validaciones.js
```

`storage.js` centraliza operaciones relacionadas con la persistencia simulada.

---

# 🧪 Testing

Las pruebas están desarrolladas utilizando:

- Vitest;
- React Testing Library;
- user-event;
- jsdom;
- mocks de Vitest.

Los archivos utilizan el formato:

```text
nombre.spec.jsx
```

Los tests se encuentran junto a los módulos que evalúan.

Actualmente el proyecto cuenta con **30 casos de prueba** distribuidos en 10 archivos.

## Archivos de prueba

```text
src/components/Carrito.spec.jsx
src/components/Catalogo.spec.jsx
src/components/SelectorCantidad.spec.jsx
src/components/Servicios.spec.jsx
src/pages/Login.spec.jsx
src/pages/Registro.spec.jsx
src/pages/Vendedor.spec.jsx
src/pages/admin/AdminUsuarios.spec.jsx
src/utils/productos.spec.jsx
src/utils/validaciones.spec.jsx
```

## Funcionalidades evaluadas

Las pruebas verifican comportamientos como:

- renderizado de componentes;
- carrito vacío;
- productos agregados al carrito;
- eliminación de productos;
- modificación de cantidades;
- límites de stock;
- búsqueda de productos;
- filtrado;
- ordenamiento;
- validaciones de formularios;
- Login;
- Registro;
- mocks de funciones;
- administración de usuarios;
- CRUD de productos;
- CRUD de categorías;
- validaciones de productos.

---

# 🎭 Mocks

Las pruebas utilizan funciones simuladas mediante Vitest.

Ejemplo:

```javascript
vi.mock("../utils/storage", () => ({
  leerUsuarios: vi.fn(),
  guardarSesion: vi.fn(),
}));
```

Esto permite probar componentes sin depender directamente de la persistencia real utilizada por la aplicación.

De esta manera las pruebas se mantienen aisladas.

---

# 📊 Cobertura de pruebas

La cobertura se obtiene mediante:

```bash
npm run coverage
```

Resultados actuales:

| Métrica | Cobertura |
|---|---:|
| Statements | 86.37% |
| Branches | 83.01% |
| Functions | 92.70% |
| Lines | 86.25% |

Todas las métricas globales se encuentran sobre el **80% de cobertura**.

El reporte HTML se genera automáticamente mediante Coverage V8.

---

# ▶️ Ejecución de pruebas

Ejecutar las pruebas:

```bash
npm run test:run
```

Ejecutar las pruebas en modo interactivo:

```bash
npm run test
```

Ejecutar pruebas con cobertura:

```bash
npm run coverage
```

---

# 📱 Diseño responsive

Sonido Vivo está diseñado para funcionar en diferentes tamaños de pantalla.

Se utilizan:

- Bootstrap;
- React Bootstrap;
- Flexbox;
- Grid;
- breakpoints responsive;
- componentes adaptables.

La aplicación considera visualización en:

```text
Mobile
Tablet
Desktop
```

---

# ☁️ Despliegue en AWS

La aplicación cuenta con infraestructura configurada en **Amazon Web Services**.

El despliegue utiliza:

```text
AWS EC2
Ubuntu Server
Nginx
Vite build
```

El proceso utilizado es:

```text
Código React
      ↓
npm run build
      ↓
dist/
      ↓
AWS EC2
      ↓
Nginx
      ↓
Aplicación pública
```

La configuración de Nginx utiliza fallback hacia `index.html` para permitir que React Router funcione correctamente al acceder directamente a rutas internas.

Ejemplo conceptual:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

La versión pública será actualizada con el último contenido de `main` antes de la presentación final.

---

# 📁 Estructura actual del proyecto

```text
sonido-vivo-react/
│
├── public/
│   ├── img/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── pages/
│   ├── styles/
│   │   └── EstilosGlobales.jsx
│   ├── test/
│   │   └── setup.js
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

# ⚙️ Instalación

## Requisitos

- Node.js
- npm
- Git

## Clonar repositorio

```bash
git clone https://github.com/NoemiBello/sonido-vivo-react.git
```

Ingresar al proyecto:

```bash
cd sonido-vivo-react
```

Instalar dependencias:

```bash
npm install
```

---

# ▶️ Ejecutar aplicación

```bash
npm run dev
```

Vite mostrará la dirección local donde se encuentra disponible la aplicación.

---

# 🏗️ Compilación de producción

```bash
npm run build
```

Este comando genera:

```text
dist/
```

con los archivos optimizados para producción.

---

# 🔍 Previsualizar build

```bash
npm run preview
```

---

# 🌿 Git y GitHub

El proyecto utiliza ramas individuales para desarrollar funcionalidades antes de integrarlas en `main`.

## Ramas principales de trabajo

| Rama | Responsable |
|---|---|
| `main` | Integración final |
| `noe-bello` | Noemí |
| `jequito` | Jeanpiere |
| `manurod` | Manuel |

## Flujo de integración

```text
Actualizar main
      ↓
Actualizar rama individual
      ↓
Desarrollar funcionalidad
      ↓
Ejecutar pruebas
      ↓
Commit
      ↓
Push
      ↓
Pull Request
      ↓
Merge hacia main
```

---

# 📝 Convención de commits

Se utilizan prefijos descriptivos:

| Prefijo | Uso |
|---|---|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección |
| `refactor:` | Mejora de estructura |
| `style:` | Cambios visuales o de formato |
| `test:` | Pruebas |
| `docs:` | Documentación |

Ejemplos:

```text
feat: agregar validaciones personalizadas al login
test: alinear pruebas con mocks y formato spec jsx
refactor: integrar estilos propios en React
```

---

# 👥 Equipo

| Integrante | Responsabilidades principales |
|---|---|
| Noemí Bello | Inicio, navegación, detalle de productos, carrito y proceso de compra |
| Jeanpiere | Catálogo, categorías, filtros, productos, stock y panel vendedor |
| Manuel | Servicios, Login, Registro, perfil, usuarios, pedidos, administración y reportes |

---

# ✅ Estado actual

Actualmente la aplicación cuenta con:

- React y Vite configurados;
- navegación SPA;
- componentes reutilizables;
- Context para datos compartidos;
- catálogo;
- categorías;
- ofertas;
- carrito;
- Checkout;
- usuarios;
- autenticación simulada;
- roles;
- validaciones personalizadas;
- perfil;
- historial de compras;
- panel vendedor;
- panel administrador;
- pedidos;
- reportes;
- servicios técnicos;
- blog;
- Bootstrap;
- React Bootstrap;
- pruebas automatizadas;
- mocks;
- cobertura superior al 80%;
- build de producción;
- infraestructura de despliegue AWS EC2 + Nginx.

---

# 🔗 Repositorio

Repositorio oficial:

```text
https://github.com/NoemiBello/sonido-vivo-react
```

---

**Sonido Vivo — Tecnología y música en una sola plataforma.**
