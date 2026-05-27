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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Test data
INSERT INTO users (username, email, password) VALUES 
('bowie_knife99', 'bowie_knife99@gmail.com', '1234'),
('steam_admin', 'admin@steam.com', '1234'),
('elite', 'elite@gmail.com', '1234');

-- Verify
SELECT * FROM users;
