CREATE DATABASE tretaheroi;
 
\c tretaheroi;

CREATE TABLE herois (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    vida INT NOT NULL,
    ataque INT NOT NULL,
    defesa INT NOT NULL
);

INSERT INTO herois (nome, vida, ataque, defesa) VALUES ('Mulher Maravilha', 100, 50, 20);
INSERT INTO herois (nome, vida, ataque, defesa) VALUES ('Homem de Ferro', 180, 80, 100);
INSERT INTO herois (nome, vida, ataque, defesa) VALUES ('Capitao America', 190, 90, 80);
INSERT INTO herois (nome, vida, ataque, defesa) VALUES ('Homem Formiga', 200, 100, 30);
INSERT INTO herois (nome, vida, ataque, defesa) VALUES ('Homem Aranha', 150, 150, 120);
INSERT INTO herois (nome, vida, ataque, defesa) VALUES ('Lanterna Verde', 230, 80, 50);
INSERT INTO herois (nome, vida, ataque, defesa) VALUES ('Pantera Negra', 130, 70, 100);
INSERT INTO herois (nome, vida, ataque, defesa) VALUES ('Hulk', 200, 80, 90);
INSERT INTO herois (nome, vida, ataque, defesa) VALUES ('Dr Estranho', 180, 100, 120);
INSERT INTO herois (nome, vida, ataque, defesa) VALUES ('Thor', 190, 100, 100);

CREATE TABLE batalha (
    id SERIAL PRIMARY KEY,
    heroi1_id INT NOT NULL,
    heroi2_id INT NOT NULL,
    vencedor_id INT,
    FOREIGN KEY (heroi1_id) REFERENCES herois(id),
    FOREIGN KEY (heroi2_id) REFERENCES herois(id),
    FOREIGN KEY (vencedor_id) REFERENCES herois(id)
);