let task = [
  {
    id: 1,
    name: "Fazer compras"
  },
  {
    id: 2,
    name: "Ler um livro"
  }
]

const allTasks = (_, res) => {
  res.json(task);
}

const taskByID = (req, res) => {
  let { id } = req.params;
  if(!task[id-1]) return res.status(404).json({msg: 'Task not found'});
  res.json(task[id-1])
}

const createTask = (req, res) => {
  const newTask = {
    id: task.length + 1,
    name: req.body.name
  };
  if(newTask.id) {
    task.push(newTask);
    return res.status(200).json({msg: 'Task created'})
  }
};

const updateTask = (req, res) => {
  let {id} = req.params
  if(!task[id-1]) return res.status(200).json({msg: 'Task not found'})
  let update = {
    id: id,
    name: req.body.name
  }
  task[id-1] = update
  res.json(update)
}

const deleteTask = (req, res) => {
  let { id } = req.params
  let filterTask = task.filter(todo => todo.id != id)
  if(filterTask.length === task.length) return res.status(404).json({msg: 'Task not found'})
  task = filterTask
  res.json({ message: 'To-do removido com sucesso' })
}

module.exports = {allTasks, taskByID, createTask, updateTask, deleteTask}

//Conectar com o banco
// Persitencia de dados (ele ficarem salvos)
// validação de task vazia (PUT, POST)