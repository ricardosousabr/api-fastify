const conection = require('../conection/conection')
conection.connect()

const allTasks = (_, res) => {
  conection.query('SELECT * FROM tasks', (err, rows, fields) => {
    res.json(rows)
  })
}

const taskByID = (req, res) => {
  let { id } = req.params;

  conection.query('SELECT name FROM tasks WHERE id IN (?)', [id], (err, rows, fields) => {
    res.json(rows)
  })
}

const createTask = (req, res) => {
  let task = req.body.name
  conection.execute('INSERT INTO tasks (name) VALUES (?)', [task], (err, rows, fields) => {
    res.status(200).json({msg: 'Task created successfully'})
  })

};

const updateTask = (req, res) => {
  let {id} = req.params
  let task = req.body.name

  conection.execute('UPDATE tasks SET name = ? WHERE id = ? ', [task, id], (err, rows, fields) => {
    res.json(rows)
  })
}

const deleteTask = (req, res) => {
  let { id } = req.params

  conection.execute('DELETE FROM tasks WHERE id = ?', [id], (err, rows, fields) => {
    res.status(200).json({msg: 'Task deleted'})
  })
}

module.exports = {allTasks, taskByID, createTask, updateTask, deleteTask}