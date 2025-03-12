# Proyecto Semestral - Tienda de Camisetas de Fútbol

Este proyecto es un sitio web de e-commerce para la venta de camisetas de fútbol. Está desarrollado con **Node.js** y **Express** en el backend, y **React** en el frontend. La base de datos utilizada es **MySQL**.

Puedes ver el video de la primera entrega aquí: [Link Video Primera Entrega](https://www.youtube.com/watch?v=5kOdmAvwMZs&ab_channel=LuisGuerra)

Puedes ver el video de la entrega final aquí: [Link Video Entrega Final](https://www.youtube.com/watch?v=DFOU04Sa63g&ab_channel=LuisGuerra)

---

## Tabla de contenidos

- [Proyecto Semestral - Tienda de Camisetas de Fútbol](#proyecto-semestral---tienda-de-camisetas-de-fútbol)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Descripción del Proyecto](#descripción-del-proyecto)
  - [Características Principales](#características-principales)
  - [Requisitos](#requisitos)
  - [Configuración del Proyecto](#configuración-del-proyecto)
    - [Paso 1: Clonar el repositorio](#paso-1-clonar-el-repositorio)
    - [Paso 2: Instalar dependencias del backend](#paso-2-instalar-dependencias-del-backend)
    - [Paso 3: Instalar dependencias del frontend](#paso-3-instalar-dependencias-del-frontend)
    - [Paso 4: Configurar la base de datos local](#paso-4-configurar-la-base-de-datos-local)
    - [Paso 5: Configurar el archivo `.env`](#paso-5-configurar-el-archivo-env)
    - [Paso 6: Iniciar el servidor backend](#paso-6-iniciar-el-servidor-backend)
    - [Paso 7: Iniciar el frontend](#paso-7-iniciar-el-frontend)
    - [Paso 8: Acceder a la aplicación](#paso-8-acceder-a-la-aplicación)
  - [Tecnologías utilizadas](#tecnologías-utilizadas)

---

## Descripción del Proyecto

Este proyecto es una tienda de camisetas de fútbol en línea que cumple con los requisitos de diseño y funcionalidad requeridos. El objetivo principal es proporcionar una experiencia de usuario fluida y atractiva, permitiendo a los usuarios navegar por una amplia selección de camisetas, gestionar su carrito de compras y completar transacciones de manera segura.

## Características Principales
- **Autenticación de Usuarios**: Los usuarios pueden registrarse y acceder a su cuenta utilizando un sistema seguro de autenticación con contraseñas cifradas en la base de datos, y validación mediante JWT (JSON Web Tokens).

- **Validación de Contraseña**: La contraseña está cifrada en la base de datos y se utiliza una API que conecta la base de datos con la aplicación.
  
- **Responsive Design**: El diseño es completamente adaptativo, tomando en cuenta dispositivos móviles, tablets y escritorio. Se han seguido las buenas prácticas de Material UI en cuanto a colores y estilos, junto con Bootstrap para garantizar una interfaz moderna y accesible.

- **Multilenguaje**: El sitio ofrece soporte para inglés y español mediante i18next, con la capacidad de añadir más idiomas. Se almacena la preferencia de idioma del usuario en Local Storage.
  
- **Local Storage**: Utilizamos Local Storage para almacenar información básica del usuario, como el nombre y la preferencia de idioma, lo que asegura que el idioma preferido se mantenga en futuras sesiones. Además, Local Storage también se emplea para gestionar el carrito de compras de usuarios no autenticados. Esto permite que un usuario que no ha iniciado sesión pueda añadir productos al carrito, y su selección se mantendrá temporalmente guardada en su navegador hasta que decida proceder con la compra o autenticarse.

- **Gestión de Carrito de Compras**: 
  - **Usuarios No Autenticados**: Los usuarios pueden agregar productos al carrito sin necesidad de estar autenticados. El carrito se almacena en el Local Storage del navegador, permitiendo que los productos seleccionados permanezcan en el carrito incluso si el usuario navega fuera del sitio o cierra el navegador temporalmente.
  - **Persistencia del Carrito**: Si un usuario no autenticado agrega productos al carrito y luego se registra o inicia sesión, el carrito de invitado se combina con el carrito existente asociado a su cuenta en la base de datos. Esto asegura que ningún producto seleccionado se pierda durante el proceso de autenticación.
  - **Sincronización de Carritos**: Cuando un usuario autenticado agrega productos al carrito, estos se almacenan en la base de datos. Si el usuario cierra sesión y luego vuelve a iniciar sesión, el carrito recupera los productos asociados a su cuenta, manteniendo una experiencia de compra continua.
  - **Unión de Carritos**: Si un usuario con una cuenta existente (que ya tiene productos en su carrito) agrega productos al carrito mientras no está autenticado y luego inicia sesión, los productos del carrito de invitado se combinan con los del carrito en la base de datos, sumando las cantidades de productos duplicados y evitando la pérdida de productos.

- **Filtro de Productos por Equipo**: Los productos (camisetas) pueden ser filtrados por equipo. Las imágenes son dinámicas, mostrando la camiseta local, de visita, tercera o de portero, según corresponda.

- **Base de Datos MySQL**: La tienda utiliza una base de datos MySQL para gestionar los productos y los usuarios. Los modelos de productos y usuarios están completamente implementados y conectados a través de una API segura.

- **Seguridad en Credenciales**: Las credenciales de acceso a la base de datos están protegidas en archivos .env y no se suben al repositorio público para mantener la seguridad de la información. Para la autenticación de usuarios, utilizamos JSON Web Tokens (JWT), asegurando que las sesiones sean seguras y fáciles de manejar. Además, para aumentar la seguridad de las contraseñas, implementamos una capa adicional de protección mediante un pepper y 10 rounds de salt, lo que asegura que incluso si una contraseña se ve comprometida, siga siendo extremadamente difícil de descifrar sin este valor extra.


---

## Requisitos

Asegúrate de tener instalados los siguientes programas en tu máquina:
- **Node.js**: https://nodejs.org/
- **XAMPP** o **MySQL Workbench** para MySQL
- **Git**

---

## Configuración del Proyecto

### Paso 1: Clonar el repositorio

Clona este repositorio en tu máquina local usando Git.

### Paso 2: Instalar dependencias del backend
Navega a la carpeta **backend** e instala las dependencias usando **npm**. Esto descargará todas las dependencias que estén listadas en el archivo `package.json`.
```bash
cd backend
npm install
```

Esto creará una carpeta `node_modules/` que no se sube a GitHub.

### Paso 3: Instalar dependencias del frontend
De manera similar, , navega a la carpeta **client** e instala las dependencias usando **npm**.
```bash
cd client
npm install
```

Aquí también se creará una carpeta `node_modules/` para el frontend, que tampoco se sube a GitHub.

### Paso 4: Configurar la base de datos local
Crea una base de datos en MySQL Workbench o XAMPP llamada `tienda_camisetas`.
Usa el archivo `create_database.sql` que se encuentra en la carpeta `sql/` para crear las tablas necesarias.


### Paso 5: Configurar el archivo `.env`
Cada miembro del equipo recibirá un archivo `.env` que debe ser configurado en la carpeta backend/. Este archivo contiene las credenciales para la base de datos y otras variables de entorno necesarias.

Ejemplo de contenido del archivo .env:
```env
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD=""
DB_NAME="tienda_camisetas"
PORT="5000"
JWT_SECRET=""
```

### Paso 6: Iniciar el servidor backend
Una vez configurada la base de datos y el archivo `.env`, navega a la carpeta backend y ejecuta el servidor Node.js.
```bash
cd backend
node server.js
```

### Paso 7: Iniciar el frontend
Navega a la carpeta client y ejecuta el servidor React.
```bash
cd client
npm start
```

### Paso 8: Acceder a la aplicación
- El backend estará corriendo en: http://localhost:5000
- El frontend estará disponible en: http://localhost:3000


---

## Tecnologías utilizadas

**Frontend**
- React: Librería para construir interfaces de usuario.
- Material UI: Librería de componentes para React con estilo moderno y responsivo.
- i18next: Librería para implementar multilenguaje en React.
- Bootstrap: Framework de CSS para un diseño responsivo.

**Backend**
- Node.js: Entorno de ejecución de JavaScript para el backend.
- Express: Framework web para Node.js.
- bcrypt: Para cifrar las contraseñas de los usuarios.
- jsonwebtoken (JWT): Para manejar la autenticación de usuarios.
- MySQL: Base de datos para almacenar información de los productos y usuarios.