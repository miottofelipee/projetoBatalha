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
app.post("/herois", async (req, res) => {
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
  const { id }  = req.params;
  const { nome, vida, ataque, defesa } = req.body;

  try {
    await pool.query(
      "UPDATE herois SET nome = $1, vida = $2, ataque = $3, defesa = $4 WHERE id = $5",
      [nome, vida, ataque, defesa, id]
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
    const heroi111 = await pool.query("SELECT * FROM herois WHERE id = $1", [
      heroi1,
    ]);
    const heroi222 = await pool.query("SELECT * FROM herois WHERE id = $1", [
      heroi2,
    ]);

    const heroi1Ataque = heroi111.rows[0].ataque;
    const heroi2Ataque = heroi222.rows[0].ataque;

    let heroi1Vida = heroi111.rows[0].vida;
    let heroi2Vida = heroi222.rows[0].vida;

    let vencedor_id = null;

    while (heroi1Vida > 0 && heroi2Vida > 0) {
      heroi2Vida -= heroi1Ataque;
      heroi1Vida -= heroi2Ataque;
    }

    if (heroi1Vida == heroi2Vida) {
      vencedor_id = null;
      res.json("Empate");
    } else if (heroi1Vida < heroi2Vida) {
      vencedor_id = heroi222.rows[0].id;
      res.json(`${heroi222.rows[0].nome} venceu`);
    } else {
      vencedor_id = heroi111.rows[0].id;
      res.json(`${heroi111.rows[0].nome} venceu`);
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

/*Batalha por heroi
app.get("/batalhas/:id/herois/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM batalha WHERE heroi1_id=$1 OR heroi2_id=$1`,
      [req.params.id]
    );
    const batalhas = result.rows;

    //Se não tiver nenhuma batalha relacionada com o herói retorna mensagem de erro
    if (!batalhas.length) {
      return res.status(404).json({ message: "Héroi sem batalhas" });
    }

    let vencedores = batallasPorHeroi(batallasPorData(batallasOrdenadas(batalla)));
    vencedores = vencedores.filter((vencedor_id) => vencedor_id === req.params.heroiId);

    res.json(vencedores);
  } catch (error) {
    console.log("Erro na busca das batalhas do Héroe", error);
    res.status(500).json({ error: error.message });
  }
});
*/

//Heroi por nome
app.get("/herois/:nome", async (req, res) => {
  try {
    const result = await pool.query("SELECT * from herois where lower(nome)=lower($1)", [
      req.params.nome,
    ]);
    const herois = result.rows;

    if (!herois.length) {
      return res.status(404).json({ message: "Heroi não encontrado!" });
    }

    res.json(herois[0]);
  } catch (error) {
    console.log("Erro ao buscar Heroi pelo Nome", error);
    res.status(500).json({ error: error.message });
  }
});

//Historico de batalha
app.get('/batalhas', async (req, res) => {
  try {
      const { rows } = await pool.query('SELECT * FROM batalha');
      res.json(rows);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

//Heroi por nome
app.get('/herois/nome/:nome', async (req, res) => {
  const { nome } = req.params;
  try {
      const { rows } = await pool.query('SELECT * FROM herois WHERE nome = $1', [nome]);
      res.json(rows);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}💤`);
})