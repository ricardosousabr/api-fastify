const express = require('express');
const app = express();
const port = 8080;
const name = ['Ricardo', 'joão', 'Caio', 'Matheus']


const myMiddleware = function (req, res, next) {
  console.log("Nome:" + name);
  next()
}


app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

app.use(myMiddleware)

app.get('/contatos', (req, res) => {
  res.send('Hello word')
})

app.listen(port, () => {
  console.log('Servidor rodando na porta 8080')
})