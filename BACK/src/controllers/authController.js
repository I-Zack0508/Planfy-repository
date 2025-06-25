const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = new PrismaClient()
const { sendRecoveryEmail } = require('../utils/mailer')

exports.register = async (req, res) => {
    const { name, email, password, birthDate } = req.body;

    console.log("Dados recebidos no registro:", req.body); // Log dos dados recebidos

    if (!name || !email || !password || !birthDate) {
        console.error("Erro: Campos obrigatórios ausentes.");
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Senha criptografada com sucesso.");

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, birthDate: new Date(birthDate) }
        });
        console.log("Usuário criado com sucesso:", user);

        res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        res.status(400).json({ error: 'Erro ao registrar usuário' });
    }
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Email ou senha inválidos' })
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.json({
      token,
      user: {
        nome: user.name,
        email: user.email,
        profilePic: user.profilePic
      }
    })
  } catch {
    res.status(500).json({ error: 'Erro no login' })
  }
}

// Função para solicitar a recuperação de senha (passo 1)
exports.recoverPassword = async (req, res) => {
  const { email } = req.body
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })

    // cria token para recuperação (válido por 1h)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    const resetLink = `http://localhost:3000/redefinir-senha.html?token=${token}`

    // envia o e-mail com o link de redefinição
    await sendRecoveryEmail(email, resetLink)

    res.json({ message: 'Email de recuperação enviado com sucesso' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao enviar e-mail de recuperação' })
  }
}

// Função para redefinir a senha (passo 2) - Agora com o banco de dados e token de recuperação
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verifica o token de recuperação no banco de dados
    const user = await prisma.user.findUnique({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(), // Verifica se o token não expirou
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    // Atualiza a senha do usuário
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null, // Limpa o token após o uso
        passwordResetExpires: null, // Limpa a data de expiração
      },
    });

    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao redefinir a senha' });
  }
};