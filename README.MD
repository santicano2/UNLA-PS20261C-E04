# TP Proyecto de Software - Equipo 4

## Integrantes

- Santiago Cano
- Tomás Casco
- Ariel Mendoza
- Brian Avila
- Joel Fernandez

## Stack

- Frontend: Next.js, Typescript, TailwindCSS
- Backend: Spring Boot, Maven, Hibernate
- DB: MySQL

## Requisitos

- Node.js 22+
- Java 21+
- MySQL 8+

## Setup

### 1. Base de datos

Ejecutar el script para crear la base de datos y los datos de prueba:

```
mysql -u root -p < database.sql
```

Los usuarios de prueba tienen password `1234`:

- `steam_admin` (rol developer)
- `elite` (rol developer)
- `bowie_knife99` (rol user)

### 2. Backend

Configurar la conexion a MySQL en `backend/src/main/resources/application.properties`:

```properties
spring.datasource.password=TU_CONTRASENA
```

Iniciar el backend:

```
cd backend
.\mvnw.cmd spring-boot:run
```

El servidor arranca en `http://localhost:8080/api`.

### 3. Frontend

```
cd frontend
npm install
npm run dev
```

El servidor arranca en `http://localhost:3000`.

## Rutas

| Ruta        | Descripcion                                 |
| ----------- | ------------------------------------------- |
| `/`         | Tienda: lista de juegos, agregar al carrito |
| `/login`    | Iniciar sesion                              |
| `/register` | Registrarse (usuario o desarrollador)       |
| `/publish`  | Publicar juego (solo desarrolladores)       |
| `/cart`     | Carrito de compras                          |
| `/library`  | Biblioteca con juegos adquiridos y descarga |

## API endpoints

| Metodo | Ruta                           | Auth           | Descripcion                |
| ------ | ------------------------------ | -------------- | -------------------------- |
| POST   | `/auth/register`               | No             | Registrar usuario          |
| POST   | `/auth/login`                  | No             | Iniciar sesion             |
| GET    | `/auth/me`                     | Si             | Datos del usuario actual   |
| GET    | `/games`                       | No             | Listar juegos              |
| POST   | `/games`                       | Si (developer) | Publicar juego             |
| GET    | `/cart`                        | Si             | Ver carrito                |
| POST   | `/cart/{gameId}`               | Si             | Agregar al carrito         |
| DELETE | `/cart/{gameId}`               | Si             | Quitar del carrito         |
| POST   | `/purchases`                   | Si             | Comprar carrito            |
| GET    | `/purchases`                   | Si             | IDs de juegos comprados    |
| GET    | `/purchases/library`           | Si             | Biblioteca completa        |
| POST   | `/purchases/{gameId}/install`  | Si             | Instalar/desinstalar juego |
| POST   | `/purchases/{gameId}/favorite` | Si             | Marcar/desmarcar favorito  |
