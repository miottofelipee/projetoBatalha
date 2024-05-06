const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 4000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: '',
  password: 'ds564',
  port: 5432,
});

app.use(express.json());














app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}🧙🪄✨`);
  })