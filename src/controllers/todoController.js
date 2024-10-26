let task = [
  {
    id: 1,
    name: "Fazer compras",
  },
  {
    id: 2,
    name: "Ler um livro",
  },
]

const allTasks = (req, res) => {
  res.json(task);
}

const createTask = (req, res) => {
  console.log(req.body);
  const newId = task.length++;
  const { name } = req.body;
  const newTask = { id: newId, name };
  task[newId] = newTask
  res.json(newTask);
}

const deleteTask = (req, res) => {
  const { id } = req.params
  let filterTask = task.filter(todo => todo.id != id)
  task = filterTask
  res.json({ message: 'To-do removido com sucesso' });
}

module.exports = {allTasks, deleteTask, createTask}
