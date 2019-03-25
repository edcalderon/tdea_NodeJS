var InscribirCursos = require('./InscribirCursos')
var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send(InscribirCursos.createArchivo())
})

app.listen(3000)
