-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS tienda_camisetas;
USE tienda_camisetas;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  address VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  two_factor_secret VARCHAR(255) NULL, -- Clave secreta para 2FA
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de códigos de respaldo para 2FA
CREATE TABLE IF NOT EXISTS backup_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  code VARCHAR(255) NOT NULL,
  status ENUM('used', 'not_used') DEFAULT 'not_used',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  team VARCHAR(100),
  brand VARCHAR(100),
  type ENUM('local', 'visita', 'tercera', 'cuarta', 'portero') NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para almacenar imágenes de los productos
CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  image_url VARCHAR(255) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabla de reseñas y calificaciones de productos
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_review (product_id, user_id) -- un usuario solo puede dejar una reseña por producto
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de detalles del pedido
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT NOT NULL,
  size VARCHAR(5),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabla de carritos
CREATE TABLE IF NOT EXISTS carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de detalles del carrito (productos en el carrito)
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT,
  product_id INT,
  quantity INT NOT NULL DEFAULT 1,
  size VARCHAR(10),
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (cart_id, product_id, size)
);

-- Usuario 1
INSERT INTO users (username, email, address, password)
VALUES (
  'Luis Guerra',
  'ldgb2004@gmail.com',
  'Los Álamos 456',
  '$2b$10$D57AtGevWZLozpJDYhzaOOdKS3irFmP.HstDYvHTqlzpIvueusrRK'
);

-- Usuario 2
INSERT INTO users (username, email, address, password)
VALUES (
  'Renato Calvo ',
  'renato@gmail.com',
  'Calle Falsa 123',
  '$2b$10$EGwrYzuNKEw2mofiTiiwVuNv.gF6r3vSE7jJIKkdwQzKSkkqoinei'
);

-- Usuario 3
INSERT INTO users (username, email, address, password)
VALUES (
  'Marcelo Pino',
  'marcelo@gmail.com',
  'Av. Siempre Viva 742',
  '$2b$10$7d6Hgkq/rrE6Z9lJUfZ.UukLjTVm7kkT.j5iEUxz.p0qXFLdv3UNa'
);


-- FC Barcelona

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'FC Barcelona', 119.99, 100, 'Nike', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Barca/Local/Barca_Local_24_1.jpg'),
(@product_id, '/images/Barca/Local/Barca_Local_24_2.jpg'),
(@product_id, '/images/Barca/Local/Barca_Local_24_3.jpg'),
(@product_id, '/images/Barca/Local/Barca_Local_24_4.jpg'),
(@product_id, '/images/Barca/Local/Barca_Local_24_5.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'FC Barcelona', 117.99, 100, 'Nike', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Barca/Visita/Barca_Visita_24_1.jpg'),
(@product_id, '/images/Barca/Visita/Barca_Visita_24_2.jpg'),
(@product_id, '/images/Barca/Visita/Barca_Visita_24_3.jpg'),
(@product_id, '/images/Barca/Visita/Barca_Visita_24_4.jpg'),
(@product_id, '/images/Barca/Visita/Barca_Visita_24_5.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'FC Barcelona', 117.99, 100, 'Nike', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Barca/Tercera/Barca_Tercera_24_1.jpg'),
(@product_id, '/images/Barca/Tercera/Barca_Tercera_24_2.jpg'),
(@product_id, '/images/Barca/Tercera/Barca_Tercera_24_3.jpg'),
(@product_id, '/images/Barca/Tercera/Barca_Tercera_24_4.jpg'),
(@product_id, '/images/Barca/Tercera/Barca_Tercera_24_5.jpg');

-- Camiseta Cuarta
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Cuarta 2024-2025', 'FC Barcelona', 117.99, 100, 'Nike', 'cuarta');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Barca/Cuarta/Barca_Cuarta_24_1.jpg'),
(@product_id, '/images/Barca/Cuarta/Barca_Cuarta_24_2.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Portero 2024-2025', 'FC Barcelona', 114.99, 100, 'Nike', 'portero');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Barca/Portero/Barca_Portero_24_1.jpg'),
(@product_id, '/images/Barca/Portero/Barca_Portero_24_2.jpg'),
(@product_id, '/images/Barca/Portero/Barca_Portero_24_3.jpg'),
(@product_id, '/images/Barca/Portero/Barca_Portero_24_4.jpg');

-- Atlético de Madrid

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'Atlético de Madrid', 119.99, 100, 'Nike', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Atletico/Local/Atletico_Local_24_1.jpg'),
(@product_id, '/images/Atletico/Local/Atletico_Local_24_2.jpg'),
(@product_id, '/images/Atletico/Local/Atletico_Local_24_3.jpg'),
(@product_id, '/images/Atletico/Local/Atletico_Local_24_4.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'Atlético de Madrid', 117.99, 100, 'Nike', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Atletico/Visita/Atletico_Visita_24_1.jpg'),
(@product_id, '/images/Atletico/Visita/Atletico_Visita_24_2.jpg'),
(@product_id, '/images/Atletico/Visita/Atletico_Visita_24_3.jpg'),
(@product_id, '/images/Atletico/Visita/Atletico_Visita_24_4.jpg'),
(@product_id, '/images/Atletico/Visita/Atletico_Visita_24_5.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'Atlético de Madrid', 117.99, 100, 'Nike', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Atletico/Tercera/Atletico_Tercera_24_1.jpg'),
(@product_id, '/images/Atletico/Tercera/Atletico_Tercera_24_2.jpg'),
(@product_id, '/images/Atletico/Tercera/Atletico_Tercera_24_3.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Portero 2024-2025', 'Atlético de Madrid', 114.99, 100, 'Nike', 'portero');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Atletico/Portero/Atletico_Portero_24_1.jpg'),
(@product_id, '/images/Atletico/Portero/Atletico_Portero_24_2.jpg');

-- Real Madrid

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'Real Madrid', 119.99, 100, 'Adidas', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Madrid/Local/Madrid_Local_24_1.jpg'),
(@product_id, '/images/Madrid/Local/Madrid_Local_24_2.jpg'),
(@product_id, '/images/Madrid/Local/Madrid_Local_24_3.jpg'),
(@product_id, '/images/Madrid/Local/Madrid_Local_24_4.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'Real Madrid', 117.99, 100, 'Adidas', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Madrid/Visita/Madrid_Visita_24_1.jpg'),
(@product_id, '/images/Madrid/Visita/Madrid_Visita_24_2.jpg'),
(@product_id, '/images/Madrid/Visita/Madrid_Visita_24_3.jpg'),
(@product_id, '/images/Madrid/Visita/Madrid_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'Real Madrid', 117.99, 100, 'Adidas', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Madrid/Tercera/Madrid_Tercera_24_1.jpg'),
(@product_id, '/images/Madrid/Tercera/Madrid_Tercera_24_2.jpg'),
(@product_id, '/images/Madrid/Tercera/Madrid_Tercera_24_3.jpg'),
(@product_id, '/images/Madrid/Tercera/Madrid_Tercera_24_4.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Portero 2024-2025', 'Real Madrid', 114.99, 100, 'Adidas', 'portero');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Madrid/Portero/Madrid_Portero_24_1.jpg'),
(@product_id, '/images/Madrid/Portero/Madrid_Portero_24_2.jpg'),
(@product_id, '/images/Madrid/Portero/Madrid_Portero_24_3.jpg');


-- Athletic de Club

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'Athletic Club', 119.99, 100, 'Castore', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Bilbao/Local/Bilbao_Local_24_1.jpg'),
(@product_id, '/images/Bilbao/Local/Bilbao_Local_24_2.jpg'),
(@product_id, '/images/Bilbao/Local/Bilbao_Local_24_3.jpg'),
(@product_id, '/images/Bilbao/Local/Bilbao_Local_24_4.jpg'),
(@product_id, '/images/Bilbao/Local/Bilbao_Local_24_5.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'Athletic Club', 117.99, 100, 'Castore', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Bilbao/Visita/Bilbao_Visita_24_1.jpg'),
(@product_id, '/images/Bilbao/Visita/Bilbao_Visita_24_2.jpg'),
(@product_id, '/images/Bilbao/Visita/Bilbao_Visita_24_3.jpg'),
(@product_id, '/images/Bilbao/Visita/Bilbao_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'Athletic Club', 117.99, 100, 'Castore', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Bilbao/Tercera/Bilbao_Tercera_24_1.jpg'),
(@product_id, '/images/Bilbao/Tercera/Bilbao_Tercera_24_2.jpg'),
(@product_id, '/images/Bilbao/Tercera/Bilbao_Tercera_24_3.jpg'),
(@product_id, '/images/Bilbao/Tercera/Bilbao_Tercera_24_4.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Portero 2024-2025', 'Athletic Club', 114.99, 100, 'Castore', 'portero');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Bilbao/Portero/Bilbao_Portero_24_1.jpg'),
(@product_id, '/images/Bilbao/Portero/Bilbao_Portero_24_2.jpg'),
(@product_id, '/images/Bilbao/Portero/Bilbao_Portero_24_3.jpg'),
(@product_id, '/images/Bilbao/Portero/Bilbao_Portero_24_4.jpg');

-- Celta de Vigo

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'Celta de Vigo', 119.99, 100, 'Hummel', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Calta/Local/Calta_Local_24_1.jpg'),
(@product_id, '/images/Calta/Local/Calta_Local_24_2.jpg'),
(@product_id, '/images/Calta/Local/Calta_Local_24_3.jpg'),
(@product_id, '/images/Calta/Local/Calta_Local_24_4.jpg'),
(@product_id, '/images/Calta/Local/Calta_Local_24_5.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'Celta de Vigo', 117.99, 100, 'Hummel', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Calta/Visita/Calta_Visita_24_1.jpg'),
(@product_id, '/images/Calta/Visita/Calta_Visita_24_2.jpg'),
(@product_id, '/images/Calta/Visita/Calta_Visita_24_3.jpg'),
(@product_id, '/images/Calta/Visita/Calta_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'Celta de Vigo', 117.99, 100, 'Hummel', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Calta/Tercera/Calta_Tercera_24_1.jpg'),
(@product_id, '/images/Calta/Tercera/Calta_Tercera_24_2.jpg'),
(@product_id, '/images/Calta/Tercera/Calta_Tercera_24_3.jpg'),
(@product_id, '/images/Calta/Tercera/Calta_Tercera_24_4.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Portero 2024-2025', 'Celta de Vigo', 114.99, 100, 'Hummel', 'portero');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Calta/Portero/Calta_Portero_24_1.jpg'),
(@product_id, '/images/Calta/Portero/Calta_Portero_24_2.jpg'),
(@product_id, '/images/Calta/Portero/Calta_Portero_24_3.jpg'),
(@product_id, '/images/Calta/Portero/Calta_Portero_24_4.jpg');


-- Deportivo Alavés

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'Deportivo Alavés', 119.99, 100, 'Puma', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Alaves/Local/Alaves_Local_24_1.jpg'),
(@product_id, '/images/Alaves/Local/Alaves_Local_24_2.jpg'),
(@product_id, '/images/Alaves/Local/Alaves_Local_24_3.jpg'),
(@product_id, '/images/Alaves/Local/Alaves_Local_24_4.jpg'),
(@product_id, '/images/Alaves/Local/Alaves_Local_24_5.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'Deportivo Alavés', 117.99, 100, 'Puma', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Alaves/Visita/Alaves_Visita_24_1.jpg'),
(@product_id, '/images/Alaves/Visita/Alaves_Visita_24_2.jpg'),
(@product_id, '/images/Alaves/Visita/Alaves_Visita_24_3.jpg'),
(@product_id, '/images/Alaves/Visita/Alaves_Visita_24_4.jpg'),
(@product_id, '/images/Alaves/Visita/Alaves_Visita_24_5.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'Deportivo Alavés', 117.99, 100, 'Puma', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Alaves/Tercera/Alaves_Tercera_24_1.jpg'),
(@product_id, '/images/Alaves/Tercera/Alaves_Tercera_24_2.jpg'),
(@product_id, '/images/Alaves/Tercera/Alaves_Tercera_24_3.jpg'),
(@product_id, '/images/Alaves/Tercera/Alaves_Tercera_24_4.jpg'),
(@product_id, '/images/Alaves/Tercera/Alaves_Tercera_24_5.jpg');

-- Espanyol

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'Espanyol', 119.99, 100, 'Kelme', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Espanyol/Local/Espanyol_Local_24_1.jpg'),
(@product_id, '/images/Espanyol/Local/Espanyol_Local_24_2.jpg'),
(@product_id, '/images/Espanyol/Local/Espanyol_Local_24_3.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'Espanyol', 117.99, 100, 'Kelme', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Espanyol/Visita/Espanyol_Visita_24_1.jpg'),
(@product_id, '/images/Espanyol/Visita/Espanyol_Visita_24_2.jpg'),
(@product_id, '/images/Espanyol/Visita/Espanyol_Visita_24_3.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'Espanyol', 117.99, 100, 'Kelme', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Espanyol/Tercera/Espanyol_Tercera_24_1.jpg'),
(@product_id, '/images/Espanyol/Tercera/Espanyol_Tercera_24_2.jpg');

-- Getafe

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'Getafe', 119.99, 100, 'Joma', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Getafe/Local/Getafe_Local_24_1.jpg'),
(@product_id, '/images/Getafe/Local/Getafe_Local_24_2.jpg'),
(@product_id, '/images/Getafe/Local/Getafe_Local_24_3.jpg'),
(@product_id, '/images/Getafe/Local/Getafe_Local_24_4.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'Getafe', 117.99, 100, 'Joma', 'visita
');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Getafe/Visita/Getafe_Visita_24_1.jpg'),
(@product_id, '/images/Getafe/Visita/Getafe_Visita_24_2.jpg'),
(@product_id, '/images/Getafe/Visita/Getafe_Visita_24_3.jpg'),
(@product_id, '/images/Getafe/Visita/Getafe_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'Getafe', 117.99, 100, 'Joma', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Getafe/Tercera/Getafe_Tercera_24_1.jpg'),
(@product_id, '/images/Getafe/Tercera/Getafe_Tercera_24_2.jpg'),
(@product_id, '/images/Getafe/Tercera/Getafe_Tercera_24_3.jpg');

-- Girona

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'Girona', 119.99, 100, 'Puma', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Girona/Local/Girona_Local_24_1.jpg'),
(@product_id, '/images/Girona/Local/Girona_Local_24_2.jpg'),
(@product_id, '/images/Girona/Local/Girona_Local_24_3.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'Girona', 117.99, 100, 'Puma', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Girona/Visita/Girona_Visita_24_1.jpg'),
(@product_id, '/images/Girona/Visita/Girona_Visita_24_2.jpg'),
(@product_id, '/images/Girona/Visita/Girona_Visita_24_3.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'Girona', 117.99, 100, 'Puma', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Girona/Tercera/Girona_Tercera_24_1.jpg'),
(@product_id, '/images/Girona/Tercera/Girona_Tercera_24_2.jpg'),
(@product_id, '/images/Girona/Tercera/Girona_Tercera_24_3.jpg');

-- Leganés

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'Leganés', 119.99, 100, 'Joma', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Leganes/Local/Leganes_Local_24_1.jpg'),
(@product_id, '/images/Leganes/Local/Leganes_Local_24_2.jpg'),
(@product_id, '/images/Leganes/Local/Leganes_Local_24_3.jpg'),
(@product_id, '/images/Leganes/Local/Leganes_Local_24_4.jpg'),
(@product_id, '/images/Leganes/Local/Leganes_Local_24_5.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'Leganés', 117.99, 100, 'Joma', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Leganes/Visita/Leganes_Visita_24_1.jpg'),
(@product_id, '/images/Leganes/Visita/Leganes_Visita_24_2.jpg'),
(@product_id, '/images/Leganes/Visita/Leganes_Visita_24_3.jpg'),
(@product_id, '/images/Leganes/Visita/Leganes_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'Leganés', 117.99, 100, 'Joma', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Leganes/Tercera/Leganes_Tercera_24_1.jpg'),
(@product_id, '/images/Leganes/Tercera/Leganes_Tercera_24_2.jpg'),
(@product_id, '/images/Leganes/Tercera/Leganes_Tercera_24_3.jpg'),
(@product_id, '/images/Leganes/Tercera/Leganes_Tercera_24_4.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Portero 2024-2025', 'Leganés', 114.99, 100, 'Joma', 'portero');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Leganes/Portero/Leganes_Portero_24_1.jpg'),
(@product_id, '/images/Leganes/Portero/Leganes_Portero_24_2.jpg');

-- Osasuna

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'Osasuna', 119.99, 100, 'Macron', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Osasuna/Local/Osasuna_Local_24_1.jpg'),
(@product_id, '/images/Osasuna/Local/Osasuna_Local_24_2.jpg'),
(@product_id, '/images/Osasuna/Local/Osasuna_Local_24_3.jpg'),
(@product_id, '/images/Osasuna/Local/Osasuna_Local_24_4.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'Osasuna', 117.99, 100, 'Macron', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Osasuna/Visita/Osasuna_Visita_24_1.jpg'),
(@product_id, '/images/Osasuna/Visita/Osasuna_Visita_24_2.jpg'),
(@product_id, '/images/Osasuna/Visita/Osasuna_Visita_24_3.jpg'),
(@product_id, '/images/Osasuna/Visita/Osasuna_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'Osasuna', 117.99, 100, 'Macron', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Osasuna/Tercera/Osasuna_Tercera_24_1.jpg'),
(@product_id, '/images/Osasuna/Tercera/Osasuna_Tercera_24_2.jpg'),
(@product_id, '/images/Osasuna/Tercera/Osasuna_Tercera_24_3.jpg'),
(@product_id, '/images/Osasuna/Tercera/Osasuna_Tercera_24_4.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Portero 2024-2025', 'Osasuna', 114.99, 100, 'Macron', 'portero');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Osasuna/Portero/Osasuna_Portero_24_1.jpg'),
(@product_id, '/images/Osasuna/Portero/Osasuna_Portero_24_2.jpg'),
(@product_id, '/images/Osasuna/Portero/Osasuna_Portero_24_3.jpg'),
(@product_id, '/images/Osasuna/Portero/Osasuna_Portero_24_4.jpg');

-- RCD Mallorca

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'RCD Mallorca', 119.99, 100, 'Nike', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Mallorca/Local/Mallorca_Local_24_1.jpg'),
(@product_id, '/images/Mallorca/Local/Mallorca_Local_24_2.jpg'),
(@product_id, '/images/Mallorca/Local/Mallorca_Local_24_3.jpg'),
(@product_id, '/images/Mallorca/Local/Mallorca_Local_24_4.jpg'),
(@product_id, '/images/Mallorca/Local/Mallorca_Local_24_5.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'RCD Mallorca', 117.99, 100, 'Nike', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Mallorca/Visita/Mallorca_Visita_24_1.jpg'),
(@product_id, '/images/Mallorca/Visita/Mallorca_Visita_24_2.jpg'),
(@product_id, '/images/Mallorca/Visita/Mallorca_Visita_24_3.jpg'),
(@product_id, '/images/Mallorca/Visita/Mallorca_Visita_24_4.jpg'),
(@product_id, '/images/Mallorca/Visita/Mallorca_Visita_24_5.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'RCD Mallorca', 117.99, 100, 'Nike', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Mallorca/Tercera/Mallorca_Tercera_24_1.jpg'),
(@product_id, '/images/Mallorca/Tercera/Mallorca_Tercera_24_2.jpg'),
(@product_id, '/images/Mallorca/Tercera/Mallorca_Tercera_24_3.jpg'),
(@product_id, '/images/Mallorca/Tercera/Mallorca_Tercera_24_4.jpg'),
(@product_id, '/images/Mallorca/Tercera/Mallorca_Tercera_24_5.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Portero 2024-2025', 'RCD Mallorca', 114.99, 100, 'Nike', 'portero');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Mallorca/Portero/Mallorca_Portero_24_1.jpg'),
(@product_id, '/images/Mallorca/Portero/Mallorca_Portero_24_2.jpg');

-- Rayo Vallecano

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'Rayo Vallecano', 119.99, 100, 'Umbro', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Rayo/Local/Rayo_Local_24_1.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'Rayo Vallecano', 117.99, 100, 'Umbro', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Rayo/Visita/Rayo_Visita_24_1.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'Rayo Vallecano', 117.99, 100, 'Umbro', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Rayo/Tercera/Rayo_Tercera_24_1.jpg');

-- Real Betis

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'Real Betis', 119.99, 100, 'Hummel', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Betis/Local/Betis_Local_24_1.jpg'),
(@product_id, '/images/Betis/Local/Betis_Local_24_2.jpg'),
(@product_id, '/images/Betis/Local/Betis_Local_24_3.jpg'),
(@product_id, '/images/Betis/Local/Betis_Local_24_4.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'Real Betis', 117.99, 100, 'Hummel', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Betis/Visita/Betis_Visita_24_1.jpg'),
(@product_id, '/images/Betis/Visita/Betis_Visita_24_2.jpg'),
(@product_id, '/images/Betis/Visita/Betis_Visita_24_3.jpg'),
(@product_id, '/images/Betis/Visita/Betis_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'Real Betis', 117.99, 100, 'Hummel', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Betis/Tercera/Betis_Tercera_24_1.jpg'),
(@product_id, '/images/Betis/Tercera/Betis_Tercera_24_2.jpg'),
(@product_id, '/images/Betis/Tercera/Betis_Tercera_24_3.jpg'),
(@product_id, '/images/Betis/Tercera/Betis_Tercera_24_4.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Portero 2024-2025', 'Real Betis', 114.99, 100, 'Hummel', 'portero');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Betis/Portero/Betis_Portero_24_1.jpg'),
(@product_id, '/images/Betis/Portero/Betis_Portero_24_2.jpg');

-- Real Sociedad

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'Real Sociedad', 119.99, 100, 'Macron', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Sociedad/Local/Sociedad_Local_24_1.jpg'),
(@product_id, '/images/Sociedad/Local/Sociedad_Local_24_2.jpg'),
(@product_id, '/images/Sociedad/Local/Sociedad_Local_24_3.jpg'),
(@product_id, '/images/Sociedad/Local/Sociedad_Local_24_4.jpg'),
(@product_id, '/images/Sociedad/Local/Sociedad_Local_24_5.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'Real Sociedad', 117.99, 100, 'Macron', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Sociedad/Visita/Sociedad_Visita_24_1.jpg'),
(@product_id, '/images/Sociedad/Visita/Sociedad_Visita_24_2.jpg'),
(@product_id, '/images/Sociedad/Visita/Sociedad_Visita_24_3.jpg'),
(@product_id, '/images/Sociedad/Visita/Sociedad_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'Real Sociedad', 117.99, 100, 'Macron', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Sociedad/Tercera/Sociedad_Tercera_24_1.jpg'),
(@product_id, '/images/Sociedad/Tercera/Sociedad_Tercera_24_2.jpg'),
(@product_id, '/images/Sociedad/Tercera/Sociedad_Tercera_24_3.jpg'),
(@product_id, '/images/Sociedad/Tercera/Sociedad_Tercera_24_4.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Portero 2024-2025', 'Real Sociedad', 114.99, 100, 'Macron', 'portero');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Sociedad/Portero/Sociedad_Portero_24_1.jpg');

-- Sevilla

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'Sevilla FC', 119.99, 100, 'Castore', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Sevilla/Local/Sevilla_Local_24_1.jpg'),
(@product_id, '/images/Sevilla/Local/Sevilla_Local_24_2.jpg'),
(@product_id, '/images/Sevilla/Local/Sevilla_Local_24_3.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'Sevilla FC', 117.99, 100, 'Castore', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Sevilla/Visita/Sevilla_Visita_24_1.jpg'),
(@product_id, '/images/Sevilla/Visita/Sevilla_Visita_24_2.jpg'),
(@product_id, '/images/Sevilla/Visita/Sevilla_Visita_24_3.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'Sevilla FC', 117.99, 100, 'Castore', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Sevilla/Tercera/Sevilla_Tercera_24_1.jpg'),
(@product_id, '/images/Sevilla/Tercera/Sevilla_Tercera_24_2.jpg'),
(@product_id, '/images/Sevilla/Tercera/Sevilla_Tercera_24_3.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Portero 2024-2025', 'Sevilla FC', 114.99, 100, 'Castore', 'portero');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Sevilla/Portero/Sevilla_Portero_24_1.jpg');

-- Palmas

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'U.D. Las Palmas', 119.99, 100, 'Hummel', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Palmas/Local/Palmas_Local_24_1.jpg'),
(@product_id, '/images/Palmas/Local/Palmas_Local_24_2.jpg'),
(@product_id, '/images/Palmas/Local/Palmas_Local_24_3.jpg'),
(@product_id, '/images/Palmas/Local/Palmas_Local_24_4.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'U.D. Las Palmas', 117.99, 100, 'Hummel', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Palmas/Visita/Palmas_Visita_24_1.jpg'),
(@product_id, '/images/Palmas/Visita/Palmas_Visita_24_2.jpg'),
(@product_id, '/images/Palmas/Visita/Palmas_Visita_24_3.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'U.D. Las Palmas', 117.99, 100, 'Hummel', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Palmas/Tercera/Palmas_Tercera_24_1.jpg'),
(@product_id, '/images/Palmas/Tercera/Palmas_Tercera_24_2.jpg');

-- Valencia

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'Valencia', 119.99, 100, 'Puma', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Valencia/Local/Valencia_Local_24_1.jpg'),
(@product_id, '/images/Valencia/Local/Valencia_Local_24_2.jpg'),
(@product_id, '/images/Valencia/Local/Valencia_Local_24_3.jpg'),
(@product_id, '/images/Valencia/Local/Valencia_Local_24_4.jpg'),
(@product_id, '/images/Valencia/Local/Valencia_Local_24_5.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'Valencia', 117.99, 100, 'Puma', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Valencia/Visita/Valencia_Visita_24_1.jpg'),
(@product_id, '/images/Valencia/Visita/Valencia_Visita_24_2.jpg'),
(@product_id, '/images/Valencia/Visita/Valencia_Visita_24_3.jpg'),
(@product_id, '/images/Valencia/Visita/Valencia_Visita_24_4.jpg'),
(@product_id, '/images/Valencia/Visita/Valencia_Visita_24_5.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'Valencia', 117.99, 100, 'Puma', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Valencia/Tercera/Valencia_Tercera_24_1.jpg'),
(@product_id, '/images/Valencia/Tercera/Valencia_Tercera_24_2.jpg'),
(@product_id, '/images/Valencia/Tercera/Valencia_Tercera_24_3.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Portero 2024-2025', 'Valencia', 114.99, 100, 'Puma', 'portero');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Valencia/Portero/Valencia_Portero_24_1.jpg'),
(@product_id, '/images/Valencia/Portero/Valencia_Portero_24_2.jpg');

-- Valladolid

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'Valladolid', 119.99, 100, 'Kappa', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Valladolid/Local/Valladolid_Local_24_1.jpg'),
(@product_id, '/images/Valladolid/Local/Valladolid_Local_24_2.jpg'),
(@product_id, '/images/Valladolid/Local/Valladolid_Local_24_3.jpg'),
(@product_id, '/images/Valladolid/Local/Valladolid_Local_24_4.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'Valladolid', 117.99, 100, 'Kappa', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Valladolid/Visita/Valladolid_Visita_24_1.jpg'),
(@product_id, '/images/Valladolid/Visita/Valladolid_Visita_24_2.jpg'),
(@product_id, '/images/Valladolid/Visita/Valladolid_Visita_24_3.jpg'),
(@product_id, '/images/Valladolid/Visita/Valladolid_Visita_24_4.jpg'),
(@product_id, '/images/Valladolid/Visita/Valladolid_Visita_24_5.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'Valladolid', 117.99, 100, 'Kappa', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Valladolid/Tercera/Valladolid_Tercera_24_1.jpg'),
(@product_id, '/images/Valladolid/Tercera/Valladolid_Tercera_24_2.jpg'),
(@product_id, '/images/Valladolid/Tercera/Valladolid_Tercera_24_3.jpg'),
(@product_id, '/images/Valladolid/Tercera/Valladolid_Tercera_24_4.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Portero 2024-2025', 'Valladolid', 114.99, 100, 'Kappa', 'portero');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Valladolid/Portero/Valladolid_Portero_24_1.jpg'),
(@product_id, '/images/Valladolid/Portero/Valladolid_Portero_24_2.jpg');

-- Villarreal

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Local 2024-2025', 'Villarreal', 119.99, 100, 'Joma', 'local');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Villarreal/Local/Villarreal_Local_24_1.jpg'),
(@product_id, '/images/Villarreal/Local/Villarreal_Local_24_2.jpg'),
(@product_id, '/images/Villarreal/Local/Villarreal_Local_24_3.jpg'),
(@product_id, '/images/Villarreal/Local/Villarreal_Local_24_4.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Visita 2024-2025', 'Villarreal', 117.99, 100, 'Joma', 'visita');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Villarreal/Visita/Villarreal_Visita_24_1.jpg'),
(@product_id, '/images/Villarreal/Visita/Villarreal_Visita_24_2.jpg'),
(@product_id, '/images/Villarreal/Visita/Villarreal_Visita_24_3.jpg'),
(@product_id, '/images/Villarreal/Visita/Villarreal_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Tercera 2024-2025', 'Villarreal', 117.99, 100, 'Joma', 'tercera');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Villarreal/Tercera/Villarreal_Tercera_24_1.jpg'),
(@product_id, '/images/Villarreal/Tercera/Villarreal_Tercera_24_2.jpg'),
(@product_id, '/images/Villarreal/Tercera/Villarreal_Tercera_24_3.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand, type)
VALUES ('Camiseta Portero 2024-2025', 'Villarreal', 114.99, 100, 'Joma', 'portero');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Villarreal/Portero/Villarreal_Portero_24_1.jpg'),
(@product_id, '/images/Villarreal/Portero/Villarreal_Portero_24_2.jpg'),
(@product_id, '/images/Villarreal/Portero/Villarreal_Portero_24_3.jpg'),
(@product_id, '/images/Villarreal/Portero/Villarreal_Portero_24_4.jpg');



-- Reseña del usuario 1 (Luis Guerra)
INSERT INTO reviews (product_id, user_id, rating, comment)
VALUES (1, 1, 5, 'La calidad es excelente, muy recomendada.');

-- Reseña del usuario 2 (Renato Calvo)
INSERT INTO reviews (product_id, user_id, rating, comment)
VALUES (1, 2, 4, 'Muy buena camiseta, aunque la talla corre un poco justa.');

-- Reseña del usuario 3 (Marcelo Pino)
INSERT INTO reviews (product_id, user_id, rating, comment)
VALUES (1, 3, 5, 'Colores vibrantes y tela cómoda. ¡Me encantó!');
