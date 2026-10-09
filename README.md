# 🎵 Sonido Vivo

### Plataforma web de comercio electrónico para instrumentos musicales

**Sonido Vivo** es una aplicación web orientada a la venta de instrumentos musicales, equipos de sonido y accesorios, que también ofrece información y solicitudes de servicios técnicos especializados.

La plataforma está desarrollada con **React, JavaScript y Vite**, utilizando componentes reutilizables, navegación mediante React Router y gestión de estados para proporcionar una experiencia dinámica, intuitiva y adaptable a distintos dispositivos.

El proyecto contempla funcionalidades para clientes y administradores, incluyendo catálogo de productos, carrito de compras, proceso de compra, gestión de usuarios, inventario, pedidos y reportes.

---

## 🚀 Tecnologías utilizadas

| Tecnología | Aplicación |
|---|---|
| React | Desarrollo de interfaces y componentes reutilizables |
| JavaScript | Lógica de negocio, validaciones y gestión de datos |
| Vite | Entorno de desarrollo y compilación |
| React Router | Navegación entre páginas |
| HTML5 | Estructura semántica |
| CSS3 | Estilos personalizados |
| Bootstrap | Diseño responsive previsto |
| localStorage | Persistencia de información en el navegador |
| Jasmine | Pruebas unitarias previstas |
| Karma | Ejecución de pruebas prevista |
| Git y GitHub | Control de versiones y colaboración |
| AWS EC2 | Infraestructura prevista para despliegue |
| Nginx | Servidor web previsto para producción |

---

## 🛍️ Funcionalidades de la plataforma

### 1. Página de inicio

- Presentación de Sonido Vivo.
- Carrusel de contenido destacado.
- Visualización de productos destacados.
- Acceso al catálogo y servicios técnicos.
- Navegación mediante React Router.

### 2. Catálogo de productos

- Visualización de instrumentos musicales, equipos y accesorios.
- Clasificación por categorías.
- Búsqueda y filtrado de productos.
- Visualización de ofertas.
- Consulta de precios, características y disponibilidad.
- Acceso a detalles individuales.

### 3. Detalle de productos

- Nombre, descripción e imagen.
- Precio y disponibilidad.
- Características técnicas.
- Información de compatibilidad.
- Incorporación de productos al carrito.

### 4. Carrito de compras

- Agregar productos.
- Aumentar y disminuir cantidades.
- Eliminar productos individuales.
- Vaciar el carrito.
- Calcular subtotal y total.
- Persistir el contenido mediante localStorage.

### 5. Proceso de compra

- Formulario de información del comprador.
- Selección de entrega a domicilio o retiro.
- Registro de dirección e instrucciones de entrega.
- Resumen de productos y cantidades.
- Confirmación del pedido.
- Pantallas de compra exitosa y compra fallida.

El proceso de compra será simulado, sin integración con una pasarela de pago real.

### 6. Gestión de usuarios

- Registro de usuarios.
- Inicio de sesión.
- Gestión de información del perfil.
- Consulta del historial de pedidos.
- Validación de formularios.

### 7. Servicios técnicos

- Información sobre reparación y mantenimiento de instrumentos.
- Formulario de solicitud de revisión.
- Validación de datos ingresados.
- Contenido multimedia informativo.

### 8. Contenido institucional

- Página Nosotros.
- Información sobre la plataforma.
- Blog con contenido relacionado con instrumentos musicales y su mantenimiento.

### 9. Panel de administración

- Gestión de productos.
- Administración de categorías.
- Control de inventario.
- Gestión de usuarios.
- Administración de pedidos.
- Consulta de reportes.

---

## ⚙️ Gestión de datos con JavaScript

La plataforma contempla el uso de archivos JavaScript para representar datos simulados y gestionar operaciones sin depender inicialmente de un backend real.

### Datos simulados

- Productos: identificadores, nombres, precios, descripciones, imágenes, categorías y stock.
- Categorías: clasificación de productos.
- Usuarios: información ficticia utilizada en los módulos correspondientes.

### Operaciones CRUD

Se contempla la implementación de las siguientes operaciones:

| Operación | Descripción |
|---|---|
| Create | Crear nuevos registros |
| Read | Consultar y visualizar registros |
| Update | Modificar registros existentes |
| Delete | Eliminar registros |

Estas operaciones se aplicarán a los módulos de administración correspondientes.

### Funciones auxiliares

El proyecto podrá incorporar funciones reutilizables para validación de formularios, formato de precios y gestión de información simulada.

---

## 📁 Estructura del proyecto

La siguiente estructura representa la **organización propuesta para la versión completa de Sonido Vivo**.

Los componentes principales ya se encuentran incorporados. Las páginas, archivos JavaScript y módulos adicionales se integrarán progresivamente según el desarrollo del equipo.

```text
sonido-vivo-react/
│
├── public/
│   ├── img/
│   └── media/
│
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Carrusel.jsx
│   │   ├── Inicio.jsx
│   │   ├── Catalogo.jsx
│   │   ├── DetalleProducto.jsx
│   │   ├── ProductosDestacados.jsx
│   │   ├── Carrito.jsx
│   │   ├── Checkout.jsx
│   │   └── Servicios.jsx
│   │
│   ├── pages/
│   │   ├── CompraExitosa.jsx
│   │   ├── CompraFallida.jsx
│   │   ├── Login.jsx
│   │   ├── Registro.jsx
│   │   ├── Perfil.jsx
│   │   ├── Nosotros.jsx
│   │   ├── Blog.jsx
│   │   └── Administracion.jsx
│   │
│   ├── data/
│   │   ├── productos.js
│   │   ├── categorias.js
│   │   └── usuarios.js
│   │
│   ├── services/
│   │   ├── productosService.js
│   │   ├── usuariosService.js
│   │   └── pedidosService.js
│   │
│   ├── utils/
│   │   ├── validaciones.js
│   │   └── formatoPrecios.js
│   │
│   ├── styles/
│   │   └── estilos.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── tests/
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

Los nombres y la distribución de los módulos pendientes podrán ajustarse según la implementación definitiva, evitando incorporar archivos innecesarios.

---

## 💻 Instalación y ejecución

### Requisitos previos

- Node.js compatible con la versión de Vite utilizada.
- npm.
- Git.

### 1. Clonar el repositorio

```bash
git clone https://github.com/NoemiBello/sonido-vivo-react.git
```

### 2. Ingresar al directorio

```bash
cd sonido-vivo-react
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Ejecutar el proyecto

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local donde se encuentra disponible la aplicación.

### 5. Generar una compilación de producción

```bash
npm run build
```

Este comando genera la carpeta `dist/` con los archivos preparados para producción.

### 6. Previsualizar la compilación

```bash
npm run preview
```

---

## 🧪 Pruebas y calidad del software

El proyecto contempla la implementación de pruebas unitarias utilizando **Jasmine y Karma**.

Se planifica desarrollar un conjunto de diez pruebas distribuidas entre los integrantes del equipo.

Las pruebas verificarán funcionalidades como:

- Renderizado de componentes React.
- Visualización de información de productos.
- Incorporación de productos al carrito.
- Modificación de cantidades.
- Validación de formularios.
- Operaciones de gestión de datos.
- Comportamiento de funcionalidades administrativas.

Se documentarán los resultados de ejecución, los casos evaluados y la cobertura obtenida.

La configuración y ejecución de estas pruebas se incorporarán durante el desarrollo.

---

## 📱 Diseño responsive

La aplicación está orientada a ofrecer una experiencia adaptable a distintos tamaños de pantalla.

Se contempla compatibilidad con dispositivos móviles, tabletas y computadores, utilizando CSS, Flexbox, Grid, media queries y la integración prevista de Bootstrap.

El diseño busca mantener una navegación clara, formularios accesibles y una presentación consistente de los productos.

---

## ☁️ Despliegue en AWS

Se contempla el despliegue de Sonido Vivo mediante servicios de **Amazon Web Services (AWS)**.

La infraestructura prevista considera:

1. Generación de la compilación de producción mediante Vite.
2. Configuración de una instancia EC2 con Ubuntu.
3. Instalación y configuración de Nginx.
4. Publicación de los archivos de producción.
5. Configuración de acceso HTTP.
6. Administración segura mediante SSH.

El enlace público se incorporará una vez completado el despliegue.

---

## 🌿 Control de versiones y colaboración

El proyecto utiliza Git y GitHub para administrar el código fuente y facilitar el trabajo colaborativo.

### Ramas de desarrollo

| Rama | Responsabilidad |
|---|---|
| `main` | Rama principal de integración |
| `noe-bello` | Desarrollo de funcionalidades asignadas a Noemí |
| `jequito` | Desarrollo de funcionalidades asignadas a Jeanpiere |
| `ramazzotti` | Desarrollo de funcionalidades asignadas a Manuel |

### Flujo de trabajo

1. Actualizar la rama individual con los cambios de `main`.
2. Implementar las funcionalidades asignadas.
3. Verificar el funcionamiento local.
4. Registrar cambios mediante commits descriptivos.
5. Subir los cambios a la rama correspondiente.
6. Crear un Pull Request hacia `main`.
7. Revisar e integrar los cambios.

### Convención de commits

Se utiliza una convención de mensajes profesionales en español:

| Prefijo | Uso |
|---|---|
| `feat:` | Nuevas funcionalidades |
| `fix:` | Corrección de errores |
| `refactor:` | Reorganización o mejora del código |
| `style:` | Cambios visuales o de formato |
| `docs:` | Actualización de documentación |
| `test:` | Incorporación o modificación de pruebas |

---

## 👥 Equipo de desarrollo

| Integrante | Responsabilidades principales |
|---|---|
| Noemí Bello | Inicio, navegación, componentes compartidos, detalle de productos, carrito y proceso de compra |
| Jeanpiere | Catálogo, categorías, búsqueda, filtros, diseño responsive, inventario y gestión de productos |
| Manuel | Servicios técnicos, autenticación, usuarios, perfil, administración, pedidos y reportes |

El equipo desarrolla las funcionalidades de manera colaborativa mediante ramas individuales e integración controlada de cambios.

---

## 📌 Estado del proyecto

**En desarrollo activo.**

Actualmente se encuentran implementados los componentes principales de React, la navegación entre páginas, la visualización inicial de productos y las funcionalidades del carrito de compras con persistencia en localStorage.

Las funcionalidades adicionales, los módulos administrativos, las pruebas unitarias y el despliegue se incorporarán progresivamente.

---

## 🔗 Repositorio

[Sonido Vivo en GitHub](https://github.com/NoemiBello/sonido-vivo-react)

---

**Sonido Vivo — Tecnología y música en una sola plataforma.**
