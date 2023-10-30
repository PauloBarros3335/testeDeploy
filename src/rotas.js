const express = require("express");
const {
  cadastrarUsuario,
  login,
  detalharUsuario,
  editarPerfilUsuarioLogado,
} = require("./controladores/usuarios");
const schemaUsuario = require("./validacoes/schemaUsuario");
const schemaLogin = require("./validacoes/schemaLogin");
const validarCorpoRequisicao = require("./intermediarios/validarCorpoRequisicao");
const listarCategorias = require("./controladores/categorias");
const verificarUsuarioLogado = require("./intermediarios/autenticacao");

const rotas = express();
// Rota GET na raiz ("/")
rotas.get("/", (req, res) => {
  return res.send("Esta é a resposta da rota GET na raiz.");
});
rotas.get("/usuario", detalharUsuario);
rotas.post("/usuario", validarCorpoRequisicao(schemaUsuario), cadastrarUsuario);
rotas.get("/categoria", listarCategorias);
rotas.post("/login", validarCorpoRequisicao(schemaLogin), login);

rotas.use(verificarUsuarioLogado);

rotas.put(
  "/usuario/:id",
  validarCorpoRequisicao(schemaUsuario),
  editarPerfilUsuarioLogado
);

module.exports = rotas;
