const knex = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const quantidadeUsuarios = await knex("usuarios").where({ email }).first();

    if (quantidadeUsuarios) {
      return res.status(400).json("O email já existe");
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = await knex("usuarios")
      .insert({
        nome,
        email,
        senha: senhaCriptografada,
      })
      .returning("*");

    return res.status(201).json("Usuário cadastrado com sucesso");
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await knex("usuarios").where({ email }).first();
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json("Senha Inválida");
    }

    const token = jwt.sign({ id: usuario.id }, process.env.SENHA_JWT, {
      expiresIn: "6d",
    });

    const { senha: _, ...usuarioLogado } = usuario;

    return res.status(200).json({ usuario: usuarioLogado, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const detalharUsuario = async (req, res) => {
  return res.status(200).json("tudo certo"); //apenas um teste para ver se a autenticação funcionou (está funcionando)
  // implantar a função aqui
};

// Rota para editar perfil do usuário logado
const editarPerfilUsuarioLogado = async (req, res) => {
  const idUsuario = req.usuario.id;
  const { nome, email, senha } = req.body;

  const senhaCriptografada = bcrypt.hashSync(senha, 10);

  // Verifica se o email já está sendo usado por outro usuário
  await knex("usuarios")
    .where({ id: idUsuario })
    .update({ nome, email, senha: senhaCriptografada })
    .then((updatedCount) => {
      if (updatedCount === 0) {
        res.status(404).json({ mensagem: "Usuário não encontrado" });
      } else {
        res.json({ mensagem: "Perfil atualizado com sucesso" });
      }
    })
    .catch((error) => {
      if (error.code === "23505") {
        res
          .status(400)
          .json({ mensagem: "E-mail já cadastrado por outro usuário" });
      } else {
        res.status(500).json({ mensagem: "Erro interno do servidor" });
      }
    });
};

module.exports = {
  cadastrarUsuario,
  login,
  detalharUsuario,
  editarPerfilUsuarioLogado,
};
