const db = require('../conection/conection')
const { ObjectId } = require('mongodb');

const allTasks = async (_, res) => {
  let collection = await db.collection("task")
  let results = await collection.find({}, { projection: { name: 1, _id: 0 } }).toArray()
  res.send(results).status(200)
}

const taskByID = async (req, res) => {
  let { id } = req.params;
  let collection = await db.collection("task")
  let results = await collection.find({_id: new ObjectId(id)}, { projection: { name: 1, _id: 0 } }).toArray()
  res.send(results).status(200)
}

const createTask = async (req, res) => {
  let task = req.body.name
  let collection = await db.collection("task")
  let result = collection.insertOne({name: task})
  res.status(200).json({msg: 'Task created successfully'})
};

const updateTask = async (req, res) => {
  let {id} = req.params
  let task = req.body.name
  let collection = await db.collection("task")
  let result = collection.updateOne({_id: new ObjectId(id)}, {$set: {name: task}})
  res.status(200).json({msg: 'Task created successfully'})

}

const deleteTask = async (req, res) => {
  let { id } = req.params
  let collection = await db.collection("task")
  let result = await collection.deleteOne({_id: new ObjectId(id)});
  res.status(200).json({msg: 'Task deleted'})
}

 module.exports = {allTasks, taskByID, createTask, updateTask, deleteTask}