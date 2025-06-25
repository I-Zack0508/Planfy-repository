const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.createTask = async (req, res) => {
  try {
    const { name, time, date, category } = req.body;

    // Validate required fields
    if (!name || !time || !date || !category) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios faltando',
        required: ['name', 'time', 'date', 'category']
      });
    }

    const task = await prisma.task.create({
      data: {
        name,
        time,
        date: new Date(date),
        category,
        userId: req.userId
      }
    });

    res.status(201).json(task);
  } catch (err) {
    console.error('Erro ao criar tarefa:', err);
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'asc' }
    });
    res.json(tasks);
  } catch (err) {
    console.error('Erro ao buscar tarefas:', err);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, time, date, category } = req.body;

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        name,
        time,
        date: new Date(date),
        category,
        userId: req.userId
      }
    });

    res.json(task);
  } catch (err) {
    console.error('Erro ao atualizar tarefa:', err);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Tarefa excluída com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir tarefa:', err);
    res.status(500).json({ error: 'Erro ao excluir tarefa' });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: Number(id) }
    });
    if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

    const now = new Date();
    const taskDateTime = new Date(task.date);
    // Adiciona hora à data
    const [hours, minutes] = task.time.split(":");
    taskDateTime.setHours(Number(hours), Number(minutes), 0, 0);

    if (now < taskDateTime) {
      return res.status(400).json({ error: "Só pode concluir após a data/hora definida" });
    }

    const updated = await prisma.task.update({
      where: { id: Number(id) },
      data: { completed: true }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Erro ao concluir tarefa" });
  }
};

exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.userId;
    const completed = await prisma.task.count({ where: { userId, completed: true } });
    const notCompleted = await prisma.task.count({ where: { userId, completed: false } });
    res.json({ completed, notCompleted });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }
};