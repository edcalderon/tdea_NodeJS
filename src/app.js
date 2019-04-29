//Requires
const {PORT} = require('./config/config')
const {URLDB} = require('./config/config');
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


// Models mongodb
const User = require('./models/user');

// Sockets connection
let counter = 0;
const { Usuarios } = require('./models/usuarioschat');
const usuarios = new Usuarios();

io.on('connection', client => {
  // Counter
      console.log("User conected")
     	client.emit("message", "Welcome / Bienvenido")
     	client.on("message", (info) =>{
     	  console.log(info)
   	  })
   	client.on("count", () =>{
     	counter++
     	console.log(counter)
     	io.emit("count", "Views counter: " + counter )
   	})

  // Chat
  client.on('usuarioNuevo', (usuario, idm) =>{
    let listado = usuarios.agregarUsuario(client.id, usuario, idm)
    console.log(listado)
    let texto = `Se ha conectado a la sala el usuario <b>${usuario}</b>`
    io.emit('nuevoUsuario', texto )
  })

  client.on('disconnect',()=>{
    let usuarioBorrado = usuarios.borrarUsuario(client.id)
    let texto = `Se ha desconectado <b>${usuarioBorrado.nombre}</b>`
    io.emit('usuarioDesconectado', texto)
      })

  client.on("texto", (text, callback) =>{
    let usuario = usuarios.getUsuario(client.id)
    User.findOne({_id: usuario.idm}, (err,result)=>{
     if(err){
       console.log(err)
     }   let texto = `<div class="incoming_msg">
          <div class="incoming_msg_img"> <img src="data:img/jpeg;base64,${result.avatar.toString('base64')}" alt="sunil"> </div>
          <div class="received_msg">
           <div class="received_withd_msg">
             <p>${usuario.nombre} : ${text} </p> </div>`
         io.emit("texto", (texto))
         callback()
    })
  })



  client.on("textoPrivado", (text, callback) =>{
    let usuario = usuarios.getUsuario(client.id)
    let texto = `${usuario.nombre} : ${text.mensajePrivado}`
    let destinatario = usuarios.getDestinatario(text.destinatario)
    client.broadcast.to(destinatario.id).emit("textoPrivado", (texto))
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
    res.locals.mismaterias = req.session.mismaterias
    res.locals.cursosInscritos = req.session.cursosInscritos
    res.locals.cursosDisponibles = req.session.cursosDisponibles
    res.locals.cursosCerrados = req.session.cursosCerrados
    res.locals.valorCursosInscritos = req.session.valorCursosInscritos
    res.locals.ganancia = req.session.ganancia
    res.locals.datos = req.session.datos
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
mongoose.connect(URLDB, {useNewUrlParser:true},(err, result) =>{
  if(err){
    return console.log(err)
  }
  console.log("moongose conected")
})

//var puerto = 3000
server.listen(PORT, ()=>{
	console.log('Escuchando en el puerto ' + PORT)
});
