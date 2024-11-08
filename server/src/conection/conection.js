const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

const connectToMongoDB = () => mongoose.connect(mongoURI);

module.exports = connectToMongoDB