const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')

exports.getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      name: true,
      email: true,
      profilePic: true,
      birthDate: true,
      createdAt: true
    }
  })
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })

  // estatísticas
  const tasks = await prisma.task.findMany({ where: { userId: req.userId } })
  const completed = tasks.filter(t => t.completed).length
  const total = tasks.length
  const percent = total ? Math.round((completed / total) * 100) : 0

  res.json({ ...user, stats: { completed, total, percent } })
}

exports.updateProfile = async (req, res) => {
  const { name, email } = req.body
  const profilePic = req.file?.filename
  try {
    const data = { name, email }
    if (profilePic) data.profilePic = profilePic
    await prisma.user.update({ where: { id: req.userId }, data })
    res.json({ message: 'Perfil atualizado com sucesso' })
  } catch {
    res.status(400).json({ error: 'Erro ao atualizar perfil' })
  }
}

// exports.updatePassword = async (req, res) => {
//   const { password } = req.body
//   const hashed = await bcrypt.hash(password, 10)
//   await prisma.user.update({ where: { id: req.userId }, data: { password: hashed } })
//   res.json({ message: 'Senha atualizada' })
// }

exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const senhaConfere = await bcrypt.compare(currentPassword, user.password);

    if (!senhaConfere) {
      return res.status(401).json({ message: 'Senha atual incorreta' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashed }
    });

    res.status(200).json({ message: 'Senha atualizada' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar a senha' });
  }
};

exports.updateProfilePic = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'Nenhuma imagem enviada.' });

    const imageUrl = `/uploads/${req.file.filename}`;
    try {
        await prisma.user.update({
            where: { id: req.userId },
            data: { profilePic: imageUrl }
        });
        res.json({ profilePicUrl: imageUrl });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao salvar imagem.' });
    }
};

exports.deleteUser = async (req, res) => {
  const { password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const senhaConfere = await bcrypt.compare(password, user.password);
    if (!senhaConfere) return res.status(401).json({ error: 'Senha incorreta' });

    // Exclui todas as tarefas do usuário antes de excluir o usuário
    await prisma.task.deleteMany({ where: { userId: req.userId } });

    await prisma.user.delete({ where: { id: req.userId } });
    res.json({ message: 'Conta excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir conta' });
  }
};