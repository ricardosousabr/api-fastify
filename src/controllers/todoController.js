const task = [
  {
    id: 1,
    name: "Fazer compras",
  },
  {
    id: 2,
    name: "Ler um livro",
  }
]

const allTasks = (req, res) => {
  res.json(task);
}

const createTask = (req, res) => {
  const newId = Object.keys(task).length + 1;
  const { name } = req.body;
    const newTask = { id: newId, name };
    res.status(201).json(newTask);
}

const deleteTask = (req, res) => {
  const { id } = req.params
  const index = task.findIndex(todo => todo.id === parseInt(id));
  task.splice(index, 1)
  res.json({ message: 'To-do removido com sucesso' });
}

module.exports = {allTasks, deleteTask, createTask}
