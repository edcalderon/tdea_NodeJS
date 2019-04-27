//Requires
require('./config/config');
const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const data = require('./data');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Sockets connection
//let countador = 0;

const { Users } = require('./models/chatUser');
const users = new Users();

 io.on('connection', client => {

 	console.log("User conected")

 	// client.emit("mensaje", "Bienvenido a mi página")

 	// client.on("mensaje", (informacion) =>{
 	// console.log(informacion)
 	// })

 	// client.on("contador", () =>{
 	// 	contador ++
 	// 	console.log(contador)
 	// 	io.emit("contador", contador )
 	// })

 	client.on('newUser', (user) =>{
 		let list = users.addUser(client.id, user)
 		console.log(list)
 		let text = `Se ha conectado a la sala el usuario ${user}`
 		io.emit('newUser', text )
 	  })

 	client.on('disconnect',()=>{
 		let deletedUser = users.deleteUser(client.id)
 		let text = `Se ha desconectado el usuario ${deletedUser.name}`
 		io.emit('disconnectedUser', text)
 	 })

 	client.on("text", (text, callback) =>{
 		let user = user.getUser(client.id)
 		let texto = `${user.name} : ${text}`
 		io.emit("text", (text))
 		callback()
 	})

 	client.on("privateText", (text, callback) =>{
 		let user = user.getUser(client.id)
 		let texto = `${user.name} : ${text.privateText}`
 		let destin = users.getDestin(text.destin)
 		client.broadcast.to(destin.id).emit("privateText", (text))
 		callback()
 })

});

// Local localstorage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

// Session
app.use(session({
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: true
}))

// Paths
const directory_public = path.join(__dirname, '../public');
const directory_templates = path.join(__dirname, '../templates');   //There is the folder with all the views in html and the partials footer and header

// Static
app.use(express.static(directory_public));


// Middlewares
app.use((req,res,next) => {

   // let token = localStorage.getItem('token')
   //   //  decof token
   //   jwt.verify(token,'word-secret',(err,decoded) =>{
   //       if(err){
   //        return next()
   //    }
   //
   //    res.locals.session = true
   //    res.locals.name = decoded.user.firstname
   //    next()
   //   })

  if(req.session.user){
    res.locals.session = true
    res.locals.user  = req.session.user
    res.locals.firstname = req.session.firstname
    res.locals.lastname = req.session.lastname
    res.locals.roll = req.session.roll
    res.locals.email = req.session.email
    res.locals.cc = req.session.cc
    res.locals.phone = req.session.phone
    res.locals.listado = req.session.listado
    res.locals.courses = req.session.courses
    res.locals.miscursos = req.session.miscursos
    res.locals.misusuarios = req.session.misusuarios
    res.locals.verCursosDisponibles = req.session.verCursosDisponibles
    res.locals.verUsuarios = req.session.verUsuarios
    res.locals.modificar = req.session.modificar
    res.locals.teachers = req.session.teachers
    //vars modify user by admin
    if(req.session.modificar){
      res.locals.cursosUser = req.session.cursosUser
      res.locals.fistnameUser =  req.session.firstnameUser
      res.locals.lastnameUser  =  req.session.lastnameUser
      res.locals.emailUser =  req.session.emailUser
      res.locals.passwordUser =  req.session.passwordUser
      res.locals.phoneUser =  req.session.phoneUser
      res.locals.ccUser = req.session.ccUser
      res.locals.rollUser =  req.session.rollUser
    }
    //vars change avatar
    if(req.session.avatar){
      res.locals.avatar = req.session.avatar
    }
    if(req.session.coordinador){
      res.locals.coordinador = true
    }
  }
  next()
});



// BodyParser
app.use(bodyParser.urlencoded({extended: false}));

// Routes
app.use(require('./routes/index'));
//app.use(multer({dest:'./../routes/index'}).any());


//mongoose Conection
mongoose.connect(process.env.URLDB, {useNewUrlParser:true},(err, result) =>{
  if(err){
    return console.log(err)
  }
  console.log("moongose conected")
})

//var puerto = 3000
server.listen(process.env.PORT, ()=>{
	console.log('Escuchando en el puerto ' + process.env.PORT)
});

//Guarda data de cursos
data.guardarCursos();

//Guarda data de usuarios
data.guardarUsuarios();
