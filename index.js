const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 4000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tretaheroi',
  password: 'ds564',
  port: 5432,
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ta on");
});

//GET todos herois
app.get("/herois", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM herois");
    res.json({
      total: result.rowCount,
      herois: result.rows,
    });
  } catch (error) {
    console.error("Erro ao obter herois", error);
    res.status(500).json({ error: error.message });
  }
});

//GET herois por id
app.get("/herois/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM herois WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao obter heroi", error);
    res.status(500).json({ error: error.message });
  }
});

//POST herois 
app.post("/heroes", async (req, res) => {
  const { nome, vida, ataque, defesa } = req.body;

  try {
    await pool.query(
      "INSERT INTO herois (nome, vida, ataque, defesa) VALUES ($1, $2, $3, $4)",
      [nome, vida, ataque, defesa]
    );
    res.json("Heroi adicionado");
  } catch (error) {
    console.error("Erro ao criar heroi", error);
    res.status(500).json({ error: error.message });
  }
});

//PUT herois
app.put("/herois/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, vida, ataque, defesa } = req.body;

  try {
    await pool.query(
      "UPDATE herois SET nome = $1, vida = $2, ataque = $3, defesa = $4 WHERE id = $5",
      [nome, vida, ataque, defesa]
    );
    res.json("Heroi atualizado");
  } catch (error) {
    console.error("Erro ao atualizar heroi", error);
    res.status(500).json({ error: error.message });
  }
});

//DELETE herois
app.delete("/herois/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM herois WHERE id = $1", [id]);
    res.json("Heroi deletado");
  } catch (error) {
    console.error("Erro ao deletar heroi", error);
    res.status(500).json({ error: error.message });
  }
});

//Batalha de herois 
app.post("/batalhas", async (req, res) => {
  const { heroi1, heroi2 } = req.body;

  try {
    const heroi11 = await pool.query("SELECT * FROM herois WHERE id = $1", [
      heroi1,
    ]);
    const heroi22 = await pool.query("SELECT * FROM herois WHERE id = $1", [
      heroi2,
    ]);

    const heroi1Ataque = heroi11.rows[0].ataque;
    const heroi2Ataque = heroi22.rows[0].ataque;

    let heroi1Vida = heroi11.rows[0].vida;
    let heroi2Vida = heroi22.rows[0].vida;

    let vencedor_id = null;

    while (heroi1Vida > 0 && heroi2Vida > 0) {
      heroi2Vida -= heroi1Ataque;
      heroi1Vida -= heroi2Ataque;
    }

    if (heroi1Vida == heroi2Vida) {
      vencedor_id = null;
      res.json("Empate");
    } else if (heroi1Vida < heroi2Vida) {
      vencedor_id = heroi22.rows[0].id;
      res.json(`${heroi22.rows[0].nome} venceu`);
    } else {
      vencedor_id = heroi11.rows[0].id;
      res.json(`${heroi11.rows[0].nome} venceu`);
    }

    await pool.query(
      "INSERT INTO batalha (heroi1_id, heroi2_id, vencedor_id ) VALUES ($1, $2, $3)",
      [heroi1, heroi2, vencedor_id]
    );
  } catch (error) {
    console.error("Erro ao criar batalha", error);
    res.status(500).json({ error: error.message });
  }
});






app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}💤`);
})