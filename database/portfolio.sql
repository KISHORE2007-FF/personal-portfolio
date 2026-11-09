CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  technologies VARCHAR(500) DEFAULT '',
  project_url VARCHAR(500) NULL,
  github_url VARCHAR(500) NULL,
  image_url VARCHAR(1000) NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  subject VARCHAR(200) NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO projects
(title, description, technologies, project_url, github_url, image_url, featured)
SELECT 'Florist Application',
       'A web application that allows users to submit florist applications and browse florist details.',
       'React, Java, Spring Boot, MySQL',
       NULL, NULL, NULL, TRUE
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Florist Application');

INSERT INTO projects
(title, description, technologies, project_url, github_url, image_url, featured)
SELECT 'Agima Gifts',
       'A frontend e-commerce demo for personalized printed gifts such as photo mugs, keychains, phone cases and photo frames.',
       'HTML, CSS, JavaScript',
       NULL, NULL, NULL, TRUE
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Agima Gifts');

INSERT INTO projects
(title, description, technologies, project_url, github_url, image_url, featured)
SELECT 'IoT Rain Alert System',
       'An IoT project designed to detect rainfall and provide an alert when rain is detected.',
       'IoT, Sensors, Embedded Systems',
       NULL, NULL, NULL, TRUE
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'IoT Rain Alert System');
