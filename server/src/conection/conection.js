const {MongoClient}  = require("mongodb");
const connectionString = process.env.MONGO_URI || "";
const client = new MongoClient(connectionString);
let db = client.db("taskUser");

module.exports = db;