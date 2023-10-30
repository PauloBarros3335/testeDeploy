require("dotenv").config();
const express = require("express");
const rotas = require("./rotas");

const app = express();

app.use(express.json());

app.use(rotas);

// app.listen(process.env.PORT);

app.listen(process.env.PORT, () => {
  console.log(`servidor rodando na porta http://localhost:${process.env.PORT}`);
});
