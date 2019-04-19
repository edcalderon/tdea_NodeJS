//Requires
require('./config/config');
const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const data = require('./data');
const jwt = require('jsonwebtoken');


// Local localstorage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


// Paths
const directory_public = path.join(__dirname, '../public');
const directory_templates = path.join(__dirname, '../templates');   //There is the folder with all the views in html and the partials footer and header

// Static
app.use(express.static(directory_public));


// Middleware
app.use((req,res,next) => {
  let token = localStorage.getItem('token')
  // decof token
  jwt.verify(token,'word-secret',(err,decoded) =>{
    if(err){
      return next()
    }
    res.locals.session = true
    res.locals.name = decoded.user.firstname
    req.user = decoded.user._id
    next()
  })
  /* session
  if(req.session.user){
    res.locals.session = true,
    res.locals.name = req.session.name
  }
  next()
  */
})



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

//var puerto = 3000
app.listen(process.env.PORT, ()=>{
	console.log('Escuchando en el puerto ' + process.env.PORT)
});

//Guarda data de cursos
data.guardarCursos();

//Guarda data de usuarios
data.guardarUsuarios();
