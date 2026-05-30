# TP Proyecto de Software - Equipo 4

TP grupal de Proyecto de Software, aplicación STEAM

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

- `user1@test.com` (rol developer)
- `ea@steam.com` (rol developer)
- `capcom@steam.com` (rol developer)

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
