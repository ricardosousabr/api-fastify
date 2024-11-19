const db = require('../conection/conection')
const { ObjectId } = require('mongodb');
const Joi = require('joi');
const schema = require('./validation/validetion');

const getUser = async (req, res) => {
  let {user, pass} = req.body
  let collection = db.collection('user');
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  let result = await collection.findOne({userName: user});
  res.status(200).json(result)
}

const createUser = (req, res) => {
  let {user, pass} = req.body;
  let collection = db.collection('user');

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  let result = collection.insertOne({userName: user, password: pass});
  res.status(200).json({msg: 'User created successfully'});
}

const updateUser = async (req, res) => {
  console.log("test")
  let {id} = req.params
  let {name, pass} = req.body
  let collection = await db.collection("user")
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  let result = collection.updateOne({_id: new ObjectId(id)}, {$set: {userName: name}})
  res.status(200).json({msg: 'User aupdate successfully'})
}

const deleteUser = async (req, res) => {
  let { id } = req.params
  let collection = await db.collection("user")
  let result = await collection.deleteOne({_id: new ObjectId(id)});
  res.status(200).json({msg: 'User deleted'})
}

module.exports = {getUser, createUser, updateUser, deleteUser};
