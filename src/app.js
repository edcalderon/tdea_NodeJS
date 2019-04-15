require('./config/config');
const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const data = require('./data');
var multer = require('multer');

// Paths
const directorio_publico = path.join(__dirname, '../public');
const directorio_templates = path.join(__dirname, '../templates');   //Trae la carpeta donde esta el footer y el header

// Static
app.use(express.static(directorio_publico));

// BodyParser
app.use(bodyParser.urlencoded({extended: false}));

// Routes
app.use(require('./routes/index'));
//app.use(multer({dest:'./../routes/index'}).any());


//mongoose Conection
mongoose.connect('mongodb://localhost:27017/app-db', {useNewUrlParser:true},(err, result) =>{
  if(err){
    return console.log(err)
  }
  console.log("moongose conected")
})



/*
// Conection to mongodb native
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'app-db';

// Create a new MongoClient
const client = new MongoClient(url,{useNewUrlParser: true });

// Use connect method to connect to the Server
client.connect(function(err) {
  if (err){
    console.log("Can't connect to server")
  }
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collectionUsers = db.collection("users")
  client.close();
});
*/

//var puerto = 3000
app.listen(process.env.PORT, ()=>{
	console.log('Escuchando en el puerto ' + process.env.PORT)
});

//Guarda data de cursos
data.guardarCursos();

//Guarda data de usuarios
data.guardarUsuarios();
