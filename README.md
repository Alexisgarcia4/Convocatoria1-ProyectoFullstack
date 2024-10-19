
# Gestión de Proyectos, Tareas y Usuarios

Este proyecto es una aplicación de gestión de proyectos, tareas y usuarios desarrollada como parte de la actividad Convocatoria 1 - Proyecto Full stack - Prueba Objetiva. Está implementada con Ionic y React para el frontend, y Express, Sequelize y MySQL para el backend. La aplicación permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre proyectos, tareas y usuarios a través de una API REST.

## Descripción
La aplicación permite a los usuarios:

- Crear proyectos, tareas y cuentas de usuario.
- Listar proyectos y las tareas asociadas.
- Editar proyectos, tareas y el perfil de usuario.
- Eliminar proyectos, tareas y cuentas de usuario.
- Subir y gestionar fotos para las tareas.

## Tecnologías Utilizadas

### Frontend:
- **Ionic Framework**: Para el desarrollo de la interfaz de usuario móvil y responsiva.
- **React**: Para la gestión de estado y los componentes del frontend.
- **React Router**: Para el enrutamiento dentro de la aplicación.
- **Axios**: Para la comunicación con el backend.
- **Capacitor**: Para la integración de funcionalidades nativas, como la captura de fotos.

### Backend:
- **Express**: Para la gestión de la API REST.
- **Sequelize**: ORM (Object Relational Mapping) utilizado para interactuar con la base de datos.
- **MySQL**: Base de datos relacional para almacenar los datos de los usuarios, proyectos y tareas.
- **Multer**: Para la subida de imágenes en las tareas.
- **Bcrypt**: Para la encriptación de contraseñas y su seguridad.
- **JWT (JSON Web Token)**: Para la autenticación y generación de tokens seguros para las sesiones de usuario.

La comunicación entre el frontend y el backend se realiza a través de una API REST. Sequelize facilita la interacción con la base de datos MySQL, mientras que JWT y Bcrypt se encargan de la autenticación segura y la protección de contraseñas.

## Instalación

### Requisitos previos
- Node.js y npm instalados.
- MySQL instalado y corriendo en tu máquina.

### Backend
1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu_usuario/tu_proyecto.git
   ```

2. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

4. Abre tu terminal de MySQL y ejecuta el siguiente comando:
   ```sql
   CREATE DATABASE db_tareas8;
   ```

5. Configura la base de datos MySQL en el archivo `db.config.js`:
   ```javascript
   module.exports = {
     HOST: "localhost",
     USER: "root",
     PASSWORD: "tu_contraseña",
     DB: "db_tareas8",
     dialect: "mysql",
     pool: {
       max: 5,
       min: 0,
       acquire: 30000,
       idle: 10000
     }
   };
   ```

6. Inicia el servidor backend:
   ```bash
   node server.js
   ```

### Frontend
1. En otra terminal, navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia la aplicación Ionic:
   ```bash
   ionic serve
   ```

## Uso
- **Crear proyecto, tarea o usuario**: A través del frontend, puedes crear nuevos proyectos, tareas y usuarios llenando los formularios correspondientes.
- **Listar proyectos, tareas y usuarios**: La lista de proyectos y sus tareas asociadas aparecerán en las pantallas principales. Los usuarios pueden gestionar su perfil.
- **Editar proyectos, tareas y usuarios**: Haz clic en el botón "Editar" para modificar un proyecto, tarea o los datos de usuario existentes.
- **Eliminar proyectos, tareas y usuarios**: Haz clic en el botón "Eliminar" para borrar un proyecto, tarea o eliminar la cuenta de usuario de la base de datos.
- **Subir fotos**: En la creación y edición de tareas, puedes tomar o subir fotos asociadas a la tarea.

## Documentación de la API
La documentación completa de la API está disponible en Postman. Puedes acceder a la colección de Postman desde el siguiente enlace:

[Documentación de la API - Postman](https://documenter.getpostman.com/view/38465474/2sAXxWapQB)

## Endpoints

### Usuarios
- `POST /api/usuarios`: Crea un nuevo usuario.
- `POST /api/usuarios/login`: Inicia sesión.
- `PUT /api/usuarios/:id`: Actualiza un usuario existente.
- `DELETE /api/usuarios/:id`: Elimina un usuario.

### Proyectos
- `GET /api/proyectos`: Lista todos los proyectos.
- `GET proyectos/usuario/:id`: Lista todos los proyectos de un usuario.
- `POST /api/proyectos`: Crea un nuevo proyecto.
- `PUT /api/proyectos/:id`: Actualiza un proyecto existente.
- `DELETE /api/proyectos/:id`: Elimina un proyecto existente.

### Tareas
- `GET /api/tareas/:id?prioridad=&hecha=&orden=desc`: Lista todas las tareas de un usuario con filtros opcionales (prioridad, hecha, orden).
- `POST /api/tareas`: Crea una nueva tarea.
- `PUT /api/tareas/:id`: Actualiza una tarea existente.
- `DELETE /api/tareas/:id`: Elimina una tarea existente.api/tareas/2/eliminarfoto
- `PUT /api/tareas/:id/eliminarfoto`: Elimina una foto existente asociada a la tarea.

## Notas Importantes
Las rutas para conectarse al backend desde el frontend son variables, y si accedes a través de un navegador simulando una vista móvil, esto puede ocasionar problemas. Si cierras sesión y el sistema detecta que es un móvil, cambiará la ruta al formato de emulador (por ejemplo, 10.0.2.2 en lugar de localhost). Para solucionar esto, simplemente cambia la vista nuevamente a "web" y refresca la página antes de continuar.
