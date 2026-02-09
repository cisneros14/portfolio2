CREATE TABLE tbl_plataformas (
    plataforma_id INT AUTO_INCREMENT PRIMARY KEY,
    plataforma_nombre VARCHAR(100) NOT NULL UNIQUE,
    plataforma_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE tbl_credenciales (
    cred_id INT AUTO_INCREMENT PRIMARY KEY,
    plataforma_id INT NOT NULL,
    cred_correo VARCHAR(150),
    cred_contrasena VARCHAR(255),
    cred_usuario VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plataforma_id) REFERENCES tbl_plataformas(plataforma_id)
);

CREATE TABLE tbl_cliente_credenciales (
    cliente_id INT NOT NULL,
    cred_id INT NOT NULL,
    alias VARCHAR(100), -- opcional: "Cuenta Ads", "Cuenta Principal"
    PRIMARY KEY (cliente_id, cred_id),
    FOREIGN KEY (cliente_id) REFERENCES tbl_cliente(cliente_id) ON DELETE CASCADE,
    FOREIGN KEY (cred_id) REFERENCES tbl_credenciales(cred_id) ON DELETE CASCADE
);

CREATE TABLE tbl_numeros (
    numero_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    numero VARCHAR(20) NOT NULL,
    tipo ENUM('personal', 'empresa', 'whatsapp', 'otro') DEFAULT 'otro',
    FOREIGN KEY (cliente_id) REFERENCES tbl_cliente(cliente_id) ON DELETE CASCADE
);
CREATE TABLE tbl_correos (
    correo_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    correo VARCHAR(150) NOT NULL,
    tipo ENUM('personal', 'empresa', 'facturacion', 'otro') DEFAULT 'otro',
    FOREIGN KEY (cliente_id) REFERENCES tbl_cliente(cliente_id) ON DELETE CASCADE
);
CREATE TABLE tbl_notas (
    nota_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    nota TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES tbl_cliente(cliente_id) ON DELETE CASCADE
);