CREATE DATABASE tretaheroi;
 
\c tretaheroi;

CREATE TABLE herois (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    vida INT NOT NULL,
    ataque INT NOT NULL,
    defesa INT NOT NULL
);

CREATE TABLE batalha (
    id SERIAL PRIMARY KEY,
    heroi1_id INT NOT NULL,
    heroi2_id INT NOT NULL,
    ganhador_id INT,
    FOREIGN KEY (heroi1_id) REFERENCES herois(id),
    FOREIGN KEY (heroi2_id) REFERENCES herois(id),
    FOREIGN KEY (ganhador_id) REFERENCES herois(id)
);