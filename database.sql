-- Create database
DROP DATABASE IF EXISTS steam;
CREATE DATABASE IF NOT EXISTS steam;
USE steam;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Games table
CREATE TABLE games (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  genre VARCHAR(50),
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  publisher_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (publisher_id) REFERENCES users(id)
);

-- Test data
INSERT INTO users (username, email, password, role) VALUES 
('bowie_knife99', 'bowie_knife99@gmail.com', '$2b$10$9tJUohImBdLgeC32cXuL6uI.vhxAvCgfSp7/9EEqOztwD1cjEwNdm', 'user'),
('steam_admin', 'admin@steam.com', '$2b$10$9tJUohImBdLgeC32cXuL6uI.vhxAvCgfSp7/9EEqOztwD1cjEwNdm', 'developer'),
('elite', 'elite@gmail.com', '$2b$10$9tJUohImBdLgeC32cXuL6uI.vhxAvCgfSp7/9EEqOztwD1cjEwNdm', 'developer');

INSERT INTO games (title, description, genre, price, image_url, publisher_id) VALUES
('The Witcher 3 Wild Hunt', 'Eres Geralt de Rivia, cazador de monstruos. En un continente devastado por la guerra e infestado de criaturas, tu misión es encontrar a Ciri, la niña de la profecía, un arma viviente que puede alterar el mundo tal y como lo conocemos.', 'RPG', 29.99, 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/ad9240e088f953a84aee814034c50a6a92bf4516/header.jpg?t=1768303991', 2),
('Forza Horizon 6', 'Descubre los asombrosos paisajes de Japón con más de 550 coches reales y conviértete en una leyenda del automovilismo en la mayor aventura de conducción en mundo abierto de Forza Horizon.', 'Carreras', 44.99, 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2483190/27abb1584a118d50d0e3950fd48d557c51981db7/header.jpg?t=1779912021', 2),
('007 First Light', 'Gánate el título. 007 First Light es una trepidante aventura de espías llena de acción creada por IO Interactive. Sigue a un joven e ingenioso a la par que temerario James Bond durante su etapa como recluta del programa de entrenamiento del MI6, vive los primeros pasos del espía más famoso del mundo
', 'Acción', 39.99, 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3768760/dbe86ebd2edb4c77d113e9e2feefeb90189fabc9/header.jpg?t=1779968100', 3);

-- Verify
SELECT * FROM users;
SELECT * FROM games;
