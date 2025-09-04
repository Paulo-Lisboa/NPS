-- Criar banco de dados NPS no MySQL do HostGator
CREATE DATABASE IF NOT EXISTS nps_system;
USE nps_system;

-- Tabela de empresas
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    domain VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de usuários
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Tabela de pesquisas NPS
CREATE TABLE nps_surveys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Tabela de respostas NPS
CREATE TABLE nps_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    survey_id INT,
    score INT CHECK (score >= 0 AND score <= 10),
    comment TEXT,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    channel VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_id) REFERENCES nps_surveys(id)
);

-- Inserir empresa padrão
INSERT INTO companies (name, email, domain) VALUES 
('Minha Empresa', 'admin@certtech.com.br', 'certtech.com.br');

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO users (company_id, name, email, password, role) VALUES 
(1, 'Administrador', 'admin@certtech.com.br', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
