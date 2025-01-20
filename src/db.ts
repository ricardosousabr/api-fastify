import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const mongoUri = 'mongodb://localhost:27017/'

// Função para conectar ao MongoDB
export default async function connectToDatabase() {
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log('Conectado ao MongoDB Atlas')
    })
    .catch((error) => {
      console.error('Erro ao conectar ao MongoDB:', error)
    })
}
