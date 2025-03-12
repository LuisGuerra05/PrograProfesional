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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  team VARCHAR(100),
  brand VARCHAR(100),
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




-- FC Barcelona

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'FC Barcelona', 19.99, 100, 'Nike');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Barca/Local/Barca_Local_24_1.jpg'),
(@product_id, '/images/Barca/Local/Barca_Local_24_2.jpg'),
(@product_id, '/images/Barca/Local/Barca_Local_24_3.jpg'),
(@product_id, '/images/Barca/Local/Barca_Local_24_4.jpg'),
(@product_id, '/images/Barca/Local/Barca_Local_24_5.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'FC Barcelona', 17.99, 100, 'Nike');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Barca/Visita/Barca_Visita_24_1.jpg'),
(@product_id, '/images/Barca/Visita/Barca_Visita_24_2.jpg'),
(@product_id, '/images/Barca/Visita/Barca_Visita_24_3.jpg'),
(@product_id, '/images/Barca/Visita/Barca_Visita_24_4.jpg'),
(@product_id, '/images/Barca/Visita/Barca_Visita_24_5.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'FC Barcelona', 17.99, 100, 'Nike');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Barca/Tercera/Barca_Tercera_24_1.jpg'),
(@product_id, '/images/Barca/Tercera/Barca_Tercera_24_2.jpg'),
(@product_id, '/images/Barca/Tercera/Barca_Tercera_24_3.jpg'),
(@product_id, '/images/Barca/Tercera/Barca_Tercera_24_4.jpg'),
(@product_id, '/images/Barca/Tercera/Barca_Tercera_24_5.jpg');

-- Camiseta Cuarta
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Cuarta 2024-2025', 'FC Barcelona', 17.99, 100, 'Nike');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Barca/Cuarta/Barca_Cuarta_24_1.jpg'),
(@product_id, '/images/Barca/Cuarta/Barca_Cuarta_24_2.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Portero 2024-2025', 'FC Barcelona', 14.99, 100, 'Nike');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Barca/Portero/Barca_Portero_24_1.jpg'),
(@product_id, '/images/Barca/Portero/Barca_Portero_24_2.jpg'),
(@product_id, '/images/Barca/Portero/Barca_Portero_24_3.jpg'),
(@product_id, '/images/Barca/Portero/Barca_Portero_24_4.jpg');

-- Atlético de Madrid

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'Atlético de Madrid', 19.99, 100, 'Nike');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Atletico/Local/Atletico_Local_24_1.jpg'),
(@product_id, '/images/Atletico/Local/Atletico_Local_24_2.jpg'),
(@product_id, '/images/Atletico/Local/Atletico_Local_24_3.jpg'),
(@product_id, '/images/Atletico/Local/Atletico_Local_24_4.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'Atlético de Madrid', 17.99, 100, 'Nike');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Atletico/Visita/Atletico_Visita_24_1.jpg'),
(@product_id, '/images/Atletico/Visita/Atletico_Visita_24_2.jpg'),
(@product_id, '/images/Atletico/Visita/Atletico_Visita_24_3.jpg'),
(@product_id, '/images/Atletico/Visita/Atletico_Visita_24_4.jpg'),
(@product_id, '/images/Atletico/Visita/Atletico_Visita_24_5.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'Atlético de Madrid', 17.99, 100, 'Nike');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Atletico/Tercera/Atletico_Tercera_24_1.jpg'),
(@product_id, '/images/Atletico/Tercera/Atletico_Tercera_24_2.jpg'),
(@product_id, '/images/Atletico/Tercera/Atletico_Tercera_24_3.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Portero 2024-2025', 'Atlético de Madrid', 14.99, 100, 'Nike');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Atletico/Portero/Atletico_Portero_24_1.jpg'),
(@product_id, '/images/Atletico/Portero/Atletico_Portero_24_2.jpg');

-- Real Madrid

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'Real Madrid', 19.99, 100, 'Adidas');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Madrid/Local/Madrid_Local_24_1.jpg'),
(@product_id, '/images/Madrid/Local/Madrid_Local_24_2.jpg'),
(@product_id, '/images/Madrid/Local/Madrid_Local_24_3.jpg'),
(@product_id, '/images/Madrid/Local/Madrid_Local_24_4.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'Real Madrid', 17.99, 100, 'Adidas');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Madrid/Visita/Madrid_Visita_24_1.jpg'),
(@product_id, '/images/Madrid/Visita/Madrid_Visita_24_2.jpg'),
(@product_id, '/images/Madrid/Visita/Madrid_Visita_24_3.jpg'),
(@product_id, '/images/Madrid/Visita/Madrid_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'Real Madrid', 17.99, 100, 'Adidas');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Madrid/Tercera/Madrid_Tercera_24_1.jpg'),
(@product_id, '/images/Madrid/Tercera/Madrid_Tercera_24_2.jpg'),
(@product_id, '/images/Madrid/Tercera/Madrid_Tercera_24_3.jpg'),
(@product_id, '/images/Madrid/Tercera/Madrid_Tercera_24_4.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Portero 2024-2025', 'Real Madrid', 14.99, 100, 'Adidas');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Madrid/Portero/Madrid_Portero_24_1.jpg'),
(@product_id, '/images/Madrid/Portero/Madrid_Portero_24_2.jpg'),
(@product_id, '/images/Madrid/Portero/Madrid_Portero_24_3.jpg');

-- Athletic de Club

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'Athletic Club', 19.99, 100, 'Castore');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Bilbao/Local/Bilbao_Local_24_1.jpg'),
(@product_id, '/images/Bilbao/Local/Bilbao_Local_24_2.jpg'),
(@product_id, '/images/Bilbao/Local/Bilbao_Local_24_3.jpg'),
(@product_id, '/images/Bilbao/Local/Bilbao_Local_24_4.jpg'),
(@product_id, '/images/Bilbao/Local/Bilbao_Local_24_5.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'Athletic Club', 17.99, 100, 'Castore');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Bilbao/Visita/Bilbao_Visita_24_1.jpg'),
(@product_id, '/images/Bilbao/Visita/Bilbao_Visita_24_2.jpg'),
(@product_id, '/images/Bilbao/Visita/Bilbao_Visita_24_3.jpg'),
(@product_id, '/images/Bilbao/Visita/Bilbao_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'Athletic Club', 17.99, 100, 'Castore');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Bilbao/Tercera/Bilbao_Tercera_24_1.jpg'),
(@product_id, '/images/Bilbao/Tercera/Bilbao_Tercera_24_2.jpg'),
(@product_id, '/images/Bilbao/Tercera/Bilbao_Tercera_24_3.jpg'),
(@product_id, '/images/Bilbao/Tercera/Bilbao_Tercera_24_4.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Portero 2024-2025', 'Athletic Club', 14.99, 100, 'Castore');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Bilbao/Portero/Bilbao_Portero_24_1.jpg'),
(@product_id, '/images/Bilbao/Portero/Bilbao_Portero_24_2.jpg'),
(@product_id, '/images/Bilbao/Portero/Bilbao_Portero_24_3.jpg'),
(@product_id, '/images/Bilbao/Portero/Bilbao_Portero_24_4.jpg');

-- Celta de Vigo

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'Celta de Vigo', 19.99, 100, 'Hummel');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Calta/Local/Calta_Local_24_1.jpg'),
(@product_id, '/images/Calta/Local/Calta_Local_24_2.jpg'),
(@product_id, '/images/Calta/Local/Calta_Local_24_3.jpg'),
(@product_id, '/images/Calta/Local/Calta_Local_24_4.jpg'),
(@product_id, '/images/Calta/Local/Calta_Local_24_5.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'Celta de Vigo', 17.99, 100, 'Hummel');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Calta/Visita/Calta_Visita_24_1.jpg'),
(@product_id, '/images/Calta/Visita/Calta_Visita_24_2.jpg'),
(@product_id, '/images/Calta/Visita/Calta_Visita_24_3.jpg'),
(@product_id, '/images/Calta/Visita/Calta_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'Celta de Vigo', 17.99, 100, 'Hummel');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Calta/Tercera/Calta_Tercera_24_1.jpg'),
(@product_id, '/images/Calta/Tercera/Calta_Tercera_24_2.jpg'),
(@product_id, '/images/Calta/Tercera/Calta_Tercera_24_3.jpg'),
(@product_id, '/images/Calta/Tercera/Calta_Tercera_24_4.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Portero 2024-2025', 'Celta de Vigo', 14.99, 100, 'Hummel');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Calta/Portero/Calta_Portero_24_1.jpg'),
(@product_id, '/images/Calta/Portero/Calta_Portero_24_2.jpg'),
(@product_id, '/images/Calta/Portero/Calta_Portero_24_3.jpg'),
(@product_id, '/images/Calta/Portero/Calta_Portero_24_4.jpg');

-- Deportivo Alavés

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'Deportivo Alavés', 19.99, 100, 'Puma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Alaves/Local/Alaves_Local_24_1.jpg'),
(@product_id, '/images/Alaves/Local/Alaves_Local_24_2.jpg'),
(@product_id, '/images/Alaves/Local/Alaves_Local_24_3.jpg'),
(@product_id, '/images/Alaves/Local/Alaves_Local_24_4.jpg'),
(@product_id, '/images/Alaves/Local/Alaves_Local_24_5.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'Deportivo Alavés', 17.99, 100, 'Puma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Alaves/Visita/Alaves_Visita_24_1.jpg'),
(@product_id, '/images/Alaves/Visita/Alaves_Visita_24_2.jpg'),
(@product_id, '/images/Alaves/Visita/Alaves_Visita_24_3.jpg'),
(@product_id, '/images/Alaves/Visita/Alaves_Visita_24_4.jpg'),
(@product_id, '/images/Alaves/Visita/Alaves_Visita_24_5.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'Deportivo Alavés', 17.99, 100, 'Puma');
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
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'Espanyol', 19.99, 100, 'Kelme');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Espanyol/Local/Espanyol_Local_24_1.jpg'),
(@product_id, '/images/Espanyol/Local/Espanyol_Local_24_2.jpg'),
(@product_id, '/images/Espanyol/Local/Espanyol_Local_24_3.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'Espanyol', 17.99, 100, 'Kelme');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Espanyol/Visita/Espanyol_Visita_24_1.jpg'),
(@product_id, '/images/Espanyol/Visita/Espanyol_Visita_24_2.jpg'),
(@product_id, '/images/Espanyol/Visita/Espanyol_Visita_24_3.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'Espanyol', 17.99, 100, 'Kelme');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Espanyol/Tercera/Espanyol_Tercera_24_1.jpg'),
(@product_id, '/images/Espanyol/Tercera/Espanyol_Tercera_24_2.jpg');

-- Getafe

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'Getafe', 19.99, 100, 'Joma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Getafe/Local/Getafe_Local_24_1.jpg'),
(@product_id, '/images/Getafe/Local/Getafe_Local_24_2.jpg'),
(@product_id, '/images/Getafe/Local/Getafe_Local_24_3.jpg'),
(@product_id, '/images/Getafe/Local/Getafe_Local_24_4.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'Getafe', 17.99, 100, 'Joma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Getafe/Visita/Getafe_Visita_24_1.jpg'),
(@product_id, '/images/Getafe/Visita/Getafe_Visita_24_2.jpg'),
(@product_id, '/images/Getafe/Visita/Getafe_Visita_24_3.jpg'),
(@product_id, '/images/Getafe/Visita/Getafe_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'Getafe', 17.99, 100, 'Joma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Getafe/Tercera/Getafe_Tercera_24_1.jpg'),
(@product_id, '/images/Getafe/Tercera/Getafe_Tercera_24_2.jpg'),
(@product_id, '/images/Getafe/Tercera/Getafe_Tercera_24_3.jpg');

-- Girona

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'Girona', 19.99, 100, 'Puma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Girona/Local/Girona_Local_24_1.jpg'),
(@product_id, '/images/Girona/Local/Girona_Local_24_2.jpg'),
(@product_id, '/images/Girona/Local/Girona_Local_24_3.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'Girona', 17.99, 100, 'Puma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Girona/Visita/Girona_Visita_24_1.jpg'),
(@product_id, '/images/Girona/Visita/Girona_Visita_24_2.jpg'),
(@product_id, '/images/Girona/Visita/Girona_Visita_24_3.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'Girona', 17.99, 100, 'Puma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Girona/Tercera/Girona_Tercera_24_1.jpg'),
(@product_id, '/images/Girona/Tercera/Girona_Tercera_24_2.jpg'),
(@product_id, '/images/Girona/Tercera/Girona_Tercera_24_3.jpg');

-- Leganés

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'Leganés', 19.99, 100, 'Joma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Leganes/Local/Leganes_Local_24_1.jpg'),
(@product_id, '/images/Leganes/Local/Leganes_Local_24_2.jpg'),
(@product_id, '/images/Leganes/Local/Leganes_Local_24_3.jpg'),
(@product_id, '/images/Leganes/Local/Leganes_Local_24_4.jpg'),
(@product_id, '/images/Leganes/Local/Leganes_Local_24_5.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'Leganés', 17.99, 100, 'Joma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Leganes/Visita/Leganes_Visita_24_1.jpg'),
(@product_id, '/images/Leganes/Visita/Leganes_Visita_24_2.jpg'),
(@product_id, '/images/Leganes/Visita/Leganes_Visita_24_3.jpg'),
(@product_id, '/images/Leganes/Visita/Leganes_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'Leganés', 17.99, 100, 'Joma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Leganes/Tercera/Leganes_Tercera_24_1.jpg'),
(@product_id, '/images/Leganes/Tercera/Leganes_Tercera_24_2.jpg'),
(@product_id, '/images/Leganes/Tercera/Leganes_Tercera_24_3.jpg'),
(@product_id, '/images/Leganes/Tercera/Leganes_Tercera_24_4.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Portero 2024-2025', 'Leganés', 14.99, 100, 'Joma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Leganes/Portero/Leganes_Portero_24_1.jpg'),
(@product_id, '/images/Leganes/Portero/Leganes_Portero_24_2.jpg');

-- Osasuna

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'Osasuna', 19.99, 100, 'Macron');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Osasuna/Local/Osasuna_Local_24_1.jpg'),
(@product_id, '/images/Osasuna/Local/Osasuna_Local_24_2.jpg'),
(@product_id, '/images/Osasuna/Local/Osasuna_Local_24_3.jpg'),
(@product_id, '/images/Osasuna/Local/Osasuna_Local_24_4.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'Osasuna', 17.99, 100, 'Macron');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Osasuna/Visita/Osasuna_Visita_24_1.jpg'),
(@product_id, '/images/Osasuna/Visita/Osasuna_Visita_24_2.jpg'),
(@product_id, '/images/Osasuna/Visita/Osasuna_Visita_24_3.jpg'),
(@product_id, '/images/Osasuna/Visita/Osasuna_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'Osasuna', 17.99, 100, 'Macron');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Osasuna/Tercera/Osasuna_Tercera_24_1.jpg'),
(@product_id, '/images/Osasuna/Tercera/Osasuna_Tercera_24_2.jpg'),
(@product_id, '/images/Osasuna/Tercera/Osasuna_Tercera_24_3.jpg'),
(@product_id, '/images/Osasuna/Tercera/Osasuna_Tercera_24_4.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Portero 2024-2025', 'Osasuna', 14.99, 100, 'Macron');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Osasuna/Portero/Osasuna_Portero_24_1.jpg'),
(@product_id, '/images/Osasuna/Portero/Osasuna_Portero_24_2.jpg'),
(@product_id, '/images/Osasuna/Portero/Osasuna_Portero_24_3.jpg'),
(@product_id, '/images/Osasuna/Portero/Osasuna_Portero_24_4.jpg');

-- RCD Mallorca

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'RCD Mallorca', 19.99, 100, 'Nike');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Mallorca/Local/Mallorca_Local_24_1.jpg'),
(@product_id, '/images/Mallorca/Local/Mallorca_Local_24_2.jpg'),
(@product_id, '/images/Mallorca/Local/Mallorca_Local_24_3.jpg'),
(@product_id, '/images/Mallorca/Local/Mallorca_Local_24_4.jpg'),
(@product_id, '/images/Mallorca/Local/Mallorca_Local_24_5.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'RCD Mallorca', 17.99, 100, 'Nike');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Mallorca/Visita/Mallorca_Visita_24_1.jpg'),
(@product_id, '/images/Mallorca/Visita/Mallorca_Visita_24_2.jpg'),
(@product_id, '/images/Mallorca/Visita/Mallorca_Visita_24_3.jpg'),
(@product_id, '/images/Mallorca/Visita/Mallorca_Visita_24_4.jpg'),
(@product_id, '/images/Mallorca/Visita/Mallorca_Visita_24_5.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'RCD Mallorca', 17.99, 100, 'Nike');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Mallorca/Tercera/Mallorca_Tercera_24_1.jpg'),
(@product_id, '/images/Mallorca/Tercera/Mallorca_Tercera_24_2.jpg'),
(@product_id, '/images/Mallorca/Tercera/Mallorca_Tercera_24_3.jpg'),
(@product_id, '/images/Mallorca/Tercera/Mallorca_Tercera_24_4.jpg'),
(@product_id, '/images/Mallorca/Tercera/Mallorca_Tercera_24_5.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Portero 2024-2025', 'RCD Mallorca', 14.99, 100, 'Nike');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Mallorca/Portero/Mallorca_Portero_24_1.jpg'),
(@product_id, '/images/Mallorca/Portero/Mallorca_Portero_24_2.jpg');

-- Rayo Vallecano

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'Rayo Vallecano', 19.99, 100, 'Umbro');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Rayo/Local/Rayo_Local_24_1.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'Rayo Vallecano', 17.99, 100, 'Umbro');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Rayo/Visita/Rayo_Visita_24_1.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'Rayo Vallecano', 17.99, 100, 'Umbro');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Rayo/Tercera/Rayo_Tercera_24_1.jpg');

-- Real Betis

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'Real Betis', 19.99, 100, 'Hummel');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Betis/Local/Betis_Local_24_1.jpg'),
(@product_id, '/images/Betis/Local/Betis_Local_24_2.jpg'),
(@product_id, '/images/Betis/Local/Betis_Local_24_3.jpg'),
(@product_id, '/images/Betis/Local/Betis_Local_24_4.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'Real Betis', 17.99, 100, 'Hummel');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Betis/Visita/Betis_Visita_24_1.jpg'),
(@product_id, '/images/Betis/Visita/Betis_Visita_24_2.jpg'),
(@product_id, '/images/Betis/Visita/Betis_Visita_24_3.jpg'),
(@product_id, '/images/Betis/Visita/Betis_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'Real Betis', 17.99, 100, 'Hummel');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Betis/Tercera/Betis_Tercera_24_1.jpg'),
(@product_id, '/images/Betis/Tercera/Betis_Tercera_24_2.jpg'),
(@product_id, '/images/Betis/Tercera/Betis_Tercera_24_3.jpg'),
(@product_id, '/images/Betis/Tercera/Betis_Tercera_24_4.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Portero 2024-2025', 'Real Betis', 14.99, 100, 'Hummel');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Betis/Portero/Betis_Portero_24_1.jpg'),
(@product_id, '/images/Betis/Portero/Betis_Portero_24_2.jpg');

-- Real Sociedad

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'Real Sociedad', 19.99, 100, 'Macron');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Sociedad/Local/Sociedad_Local_24_1.jpg'),
(@product_id, '/images/Sociedad/Local/Sociedad_Local_24_2.jpg'),
(@product_id, '/images/Sociedad/Local/Sociedad_Local_24_3.jpg'),
(@product_id, '/images/Sociedad/Local/Sociedad_Local_24_4.jpg'),
(@product_id, '/images/Sociedad/Local/Sociedad_Local_24_5.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'Real Sociedad', 17.99, 100, 'Macron');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Sociedad/Visita/Sociedad_Visita_24_1.jpg'),
(@product_id, '/images/Sociedad/Visita/Sociedad_Visita_24_2.jpg'),
(@product_id, '/images/Sociedad/Visita/Sociedad_Visita_24_3.jpg'),
(@product_id, '/images/Sociedad/Visita/Sociedad_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'Real Sociedad', 17.99, 100, 'Macron');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Sociedad/Tercera/Sociedad_Tercera_24_1.jpg'),
(@product_id, '/images/Sociedad/Tercera/Sociedad_Tercera_24_2.jpg'),
(@product_id, '/images/Sociedad/Tercera/Sociedad_Tercera_24_3.jpg'),
(@product_id, '/images/Sociedad/Tercera/Sociedad_Tercera_24_4.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Portero 2024-2025', 'Real Sociedad', 14.99, 100, 'Macron');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Sociedad/Portero/Sociedad_Portero_24_1.jpg');

-- Sevilla

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'Sevilla FC', 19.99, 100, 'Castore');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Sevilla/Local/Sevilla_Local_24_1.jpg'),
(@product_id, '/images/Sevilla/Local/Sevilla_Local_24_2.jpg'),
(@product_id, '/images/Sevilla/Local/Sevilla_Local_24_3.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'Sevilla FC', 17.99, 100, 'Castore');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Sevilla/Visita/Sevilla_Visita_24_1.jpg'),
(@product_id, '/images/Sevilla/Visita/Sevilla_Visita_24_2.jpg'),
(@product_id, '/images/Sevilla/Visita/Sevilla_Visita_24_3.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'Sevilla FC', 17.99, 100, 'Castore');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Sevilla/Tercera/Sevilla_Tercera_24_1.jpg'),
(@product_id, '/images/Sevilla/Tercera/Sevilla_Tercera_24_2.jpg'),
(@product_id, '/images/Sevilla/Tercera/Sevilla_Tercera_24_3.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Portero 2024-2025', 'Sevilla FC', 14.99, 100, 'Castore');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Sevilla/Portero/Sevilla_Portero_24_1.jpg');

-- Palmas

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'U.D. Las Palmas', 19.99, 100, 'Hummel');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Palmas/Local/Palmas_Local_24_1.jpg'),
(@product_id, '/images/Palmas/Local/Palmas_Local_24_2.jpg'),
(@product_id, '/images/Palmas/Local/Palmas_Local_24_3.jpg'),
(@product_id, '/images/Palmas/Local/Palmas_Local_24_4.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'U.D. Las Palmas', 17.99, 100, 'Hummel');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Palmas/Visita/Palmas_Visita_24_1.jpg'),
(@product_id, '/images/Palmas/Visita/Palmas_Visita_24_2.jpg'),
(@product_id, '/images/Palmas/Visita/Palmas_Visita_24_3.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'U.D. Las Palmas', 17.99, 100, 'Hummel');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Palmas/Tercera/Palmas_Tercera_24_1.jpg'),
(@product_id, '/images/Palmas/Tercera/Palmas_Tercera_24_2.jpg');

-- Valencia

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'Valencia', 19.99, 100, 'Puma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Valencia/Local/Valencia_Local_24_1.jpg'),
(@product_id, '/images/Valencia/Local/Valencia_Local_24_2.jpg'),
(@product_id, '/images/Valencia/Local/Valencia_Local_24_3.jpg'),
(@product_id, '/images/Valencia/Local/Valencia_Local_24_4.jpg'),
(@product_id, '/images/Valencia/Local/Valencia_Local_24_5.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'Valencia', 17.99, 100, 'Puma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Valencia/Visita/Valencia_Visita_24_1.jpg'),
(@product_id, '/images/Valencia/Visita/Valencia_Visita_24_2.jpg'),
(@product_id, '/images/Valencia/Visita/Valencia_Visita_24_3.jpg'),
(@product_id, '/images/Valencia/Visita/Valencia_Visita_24_4.jpg'),
(@product_id, '/images/Valencia/Visita/Valencia_Visita_24_5.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'Valencia', 17.99, 100, 'Puma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Valencia/Tercera/Valencia_Tercera_24_1.jpg'),
(@product_id, '/images/Valencia/Tercera/Valencia_Tercera_24_2.jpg'),
(@product_id, '/images/Valencia/Tercera/Valencia_Tercera_24_3.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Portero 2024-2025', 'Valencia', 14.99, 100, 'Puma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Valencia/Portero/Valencia_Portero_24_1.jpg'),
(@product_id, '/images/Valencia/Portero/Valencia_Portero_24_2.jpg');

-- Valladolid

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'Valladolid', 19.99, 100, 'Kappa');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Valladolid/Local/Valladolid_Local_24_1.jpg'),
(@product_id, '/images/Valladolid/Local/Valladolid_Local_24_2.jpg'),
(@product_id, '/images/Valladolid/Local/Valladolid_Local_24_3.jpg'),
(@product_id, '/images/Valladolid/Local/Valladolid_Local_24_4.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'Valladolid', 17.99, 100, 'Kappa');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Valladolid/Visita/Valladolid_Visita_24_1.jpg'),
(@product_id, '/images/Valladolid/Visita/Valladolid_Visita_24_2.jpg'),
(@product_id, '/images/Valladolid/Visita/Valladolid_Visita_24_3.jpg'),
(@product_id, '/images/Valladolid/Visita/Valladolid_Visita_24_4.jpg'),
(@product_id, '/images/Valladolid/Visita/Valladolid_Visita_24_5.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'Valladolid', 17.99, 100, 'Kappa');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Valladolid/Tercera/Valladolid_Tercera_24_1.jpg'),
(@product_id, '/images/Valladolid/Tercera/Valladolid_Tercera_24_2.jpg'),
(@product_id, '/images/Valladolid/Tercera/Valladolid_Tercera_24_3.jpg'),
(@product_id, '/images/Valladolid/Tercera/Valladolid_Tercera_24_4.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Portero 2024-2025', 'Valladolid', 14.99, 100, 'Kappa');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Valladolid/Portero/Valladolid_Portero_24_1.jpg'),
(@product_id, '/images/Valladolid/Portero/Valladolid_Portero_24_2.jpg');

-- Villarreal

-- Camiseta Local
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Local 2024-2025', 'Villarreal', 19.99, 100, 'Joma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Villarreal/Local/Villarreal_Local_24_1.jpg'),
(@product_id, '/images/Villarreal/Local/Villarreal_Local_24_2.jpg'),
(@product_id, '/images/Villarreal/Local/Villarreal_Local_24_3.jpg'),
(@product_id, '/images/Villarreal/Local/Villarreal_Local_24_4.jpg');

-- Camiseta Visita
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Visita 2024-2025', 'Villarreal', 17.99, 100, 'Joma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Villarreal/Visita/Villarreal_Visita_24_1.jpg'),
(@product_id, '/images/Villarreal/Visita/Villarreal_Visita_24_2.jpg'),
(@product_id, '/images/Villarreal/Visita/Villarreal_Visita_24_3.jpg'),
(@product_id, '/images/Villarreal/Visita/Villarreal_Visita_24_4.jpg');

-- Camiseta Tercera
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Tercera 2024-2025', 'Villarreal', 17.99, 100, 'Joma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Villarreal/Tercera/Villarreal_Tercera_24_1.jpg'),
(@product_id, '/images/Villarreal/Tercera/Villarreal_Tercera_24_2.jpg'),
(@product_id, '/images/Villarreal/Tercera/Villarreal_Tercera_24_3.jpg');

-- Camiseta Portero
INSERT INTO products (name, team, price, stock, brand)
VALUES ('Camiseta Portero 2024-2025', 'Villarreal', 14.99, 100, 'Joma');
SET @product_id = LAST_INSERT_ID();
INSERT INTO product_images (product_id, image_url)
VALUES 
(@product_id, '/images/Villarreal/Portero/Villarreal_Portero_24_1.jpg'),
(@product_id, '/images/Villarreal/Portero/Villarreal_Portero_24_2.jpg'),
(@product_id, '/images/Villarreal/Portero/Villarreal_Portero_24_3.jpg'),
(@product_id, '/images/Villarreal/Portero/Villarreal_Portero_24_4.jpg');
