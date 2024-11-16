const db = require('../conection/conection')
const { ObjectId } = require('mongodb');

const getUser = async (req, res) => {
  let {user} = req.body
  let collection = db.collection('user');
  let result = await collection.findOne({userName: user});
  res.status(200).json(result)
}

const createUser = (req, res) => {
  let {user, pass} = req.body;
  let collection = db.collection('user');

  if (user != null && user != "" && pass != null && pass != "" ) {
    let result = collection.insertOne({userName: user, password: pass});
    res.status(200).json({msg: 'User created successfully'});
  } else{
    res.status(500).json({msg: 'the user cannot be null or empty'});
  }
}

const updateUser = async (req, res) => {
  console.log("test")
  let {id} = req.params
  let name = req.body
  let collection = await db.collection("user")


  if (id != null && id != "" && name != null && name != "" ) {
    let result = collection.updateOne({_id: new ObjectId(id)}, {$set: {userName: name}})
    res.status(200).json({msg: 'User aupdate successfully'})
    } else{
    res.status(500).json({msg: 'the user cannot be null or empty'});
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
