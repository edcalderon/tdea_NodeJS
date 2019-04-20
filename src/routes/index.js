//Requires
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');
require('./../helpers/helpers');

// Directory Paths
const directorio_partials = path.join(__dirname, './../../templates/partials');
const directorio_views = path.join(__dirname, './../../templates/views');


// HBS
hbs.registerPartials(directorio_partials);
app.set('views',directorio_views);
app.set('view engine', 'hbs');//Le configuramos el motor de templates o de vistas

// Models mongodb
const User = require('./../models/user');
const Course = require('./../models/course');

// Session
app.use(session({
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: true
}))


// Paths
app.get('/', (req, res) =>{
	res.render('indexdashboard', {
	});
});

app.get('/login', (req, res) =>{
	res.render('login', {
		inicio: "req.body.seccion"
	});
});

app.post('/login', (req, res) =>{

/*	res.render('login', {
		inicio: "req.body.seccion",
		login: req.body.login,
		logeusername: req.body.logeusername,
		logepassword: req.body.logepassword,
		registro: req.body.registro
*/

		let user = new User({
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			phone: req.body.phone,
			cc: req.body.cc,
			roll: "aspirante",
			cursos: []
		})
		user.save((err,result)=>{
			if(err){
				res.render('login', {
					show: err,
					registro: "success"
				})
			}res.render('login',{
				  show: "registro exitoso",
					registro: "success"
			})

		})

});

// SB admin pages

app.get('/indexdashboard', (req, res) =>{
  	res.render('indexdashboard', {

		})
});

app.get('/loginregister', (req, res) =>{
  	res.render('loginregister', {

		})
});

app.post('/loginregister', (req, res) =>{
    User.findOne({email : req.body.inputEmail}, (err,result)=>{
			if(err){
				console.log(err)
				res.render('loginregister', {
								registro: req.body.registro,
								show: "Error"
				})
			}
			if(!result){
				res.render('loginregister', {
					login: req.body.login,
					show: "Usuario o contraseña incorrectas",
					path: "/loginregister",
					button: "danger"
				})
			}
			if(result && !bcrypt.compareSync(req.body.inputPassword, result.password)){
				res.render('loginregister', {
					login: req.body.login,
					show: "Usuario o contraseña incorrectas",
					path: "/loginregister",
					button: "danger"
				})
			}
			if(result && bcrypt.compareSync(req.body.inputPassword, result.password) && result.roll == "coordinador"){

				// session variables
				req.session.user = result._id
				req.session.roll = result.roll
				req.session.name = result.fisrtname
				req.session.email = result.email

				// jwt jsonwebtoken creation
				 let token = jwt.sign({
						user: result
					}, 'word-secret',{expiresIn: '4h'});
			 	// Save token in localstorage
				   localStorage.setItem('token', token);

				res.render('loginregister', {
					login: req.body.login,
					show: "Bienvenido coordinador.",
					path: "/dashboardadmin",
					button: "success"
				})
			}
			if(result && bcrypt.compareSync(req.body.inputPassword, result.password) && result.roll == "aspirante"){
				// session variables
				req.session.user = result._id
				req.session.roll = result.roll
				req.session.name = result.fisrtname
				req.session.email = result.email


						// jwt jsonwebtoken creation
			 			let token = jwt.sign({
			 				user: result
			 			}, 'word-secret',{expiresIn: '4h'});

			     // Save token in localstorage
						 localStorage.setItem('token', token);

						 req.session.inputEmail = req.body.inputEmail;
						 res.render('loginregister', {
							login: req.body.login,
							show: "Usuario y Contraseña correctas! ya puedes continuar.",
							path: "/dashboarduser",
							button: "success",
							session: true
						})
			}
		})
});

app.get('/dashboarduser', (req, res) =>{
  	res.render('dashboarduser', {

		})
});






app.get('/register', (req, res) =>{
  	res.render('register', {
		})
});

app.post('/register', (req, res) =>{
	let user = new User({
		firstname: req.body.firstName,
		lastname: req.body.lastName,
		email: req.body.inputEmail,
		password: bcrypt.hashSync(req.body.inputPassword, 10),
		phone: req.body.phone,
		cc: req.body.cedula,
		roll: "aspirante",
		cursos: []
	})
	user.save((err,result)=>{
		if(err){
			console.log(err);
						res.render('register', {
							registro: req.body.registro,
							show: "Upss! el usuario con ese email o cedula ya existe"
						})
		}res.render('register',{
			  registro: req.body.registro,
				show: "<a href='/loginregister' >Registro exitoso! ya puedes ingresar </a>"
		})
	})
});

app.get('/dashboardadmin', (req, res) =>{
  	res.render('dashboardadmin', {

		})
});



app.get('/exit', (req, res) =>{
		localStorage.setItem('token', ' ')
  	res.render('indexdashboard', {
			session: false
		})
});

//////

app.get('/indexaspirante', (req, res) =>{
	res.render('indexaspirante', {
    session: req
	});
});

app.post('/indexaspirante', (req, res) =>{
	res.render('indexaspirante', {
    session: req.body.session,
		inscribir:req.body.inscribir,
    id:req.body.id,
		Curso: req.body.Curso
	});
});

app.get('/eliminarcursos', (req, res) =>{
	res.render('eliminarcursos',{
		session: req,
		deshacer: req

	});
});

app.post('/eliminarcursos', (req, res) =>{
	res.render('eliminarcursos',{
		session: req.body.session,
		deshacer: req.body.deshacer,
    id:req.body.id,
		Curso: req.body.Curso,
		mostrarid: req.body.mostrarid,
		id1: req.body.id1,
		id2: req.body.id2
	});
});

app.get('/indexcoordinador', (req, res) =>{
	res.render('indexcoordinador', {
    session: req
	});
});

app.post('/indexcoordinador', (req, res) =>{
	res.render('indexcoordinador', {
    session: req.body.session,
		coordinador: req.body.coordinador
	});
});

app.get('/actualizarusuarios', (req, res) =>{
	res.render('actualizarusuarios',{
		session: req,
	})
});

app.post('/actualizarusuarios', (req, res) =>{
	res.render('actualizarusuarios',{
		session: req.body.session,
		username: req.body.username,
		email: req.body.email,
		phone: req.body.phone,
		roll: req.body.roll,
		id: req.body.id
	})
});

app.get('/listadocursos', (req, res) =>{
	res.render('listadocursos', {
    session: req,
	});
});

app.get('/listadocursosaspirante', (req, res) =>{
	res.render('listadocursosaspirante', {
    session: req,
	});
});

app.post('/calculos', (req,res)=>{
	res.render('calculos',{
		estudiante: req.body.nombre,
		nota1: parseInt(req.body.nota1),
    nota2: parseInt(req.body.nota2),
    nota3: parseInt(req.body.nota3)

	});
});

app.get('/crearcursos', (req,res)=>{
	res.render('crearcursos',{
		titulo: 'Creacion de cursos',
		persona: "pepe",
		session: req
	});
});

app.post('/crearcursos', (req,res)=>{
	res.render('crearcursos',{
		titulo: 'Creacion de cursos',
		persona: "aqui va seccion de administrador",
		session: req,
		nombre: req.body.nombre,
		descripcion: req.body.descripcion,
		id: req.body.id,
		valor: req.body.valor,
		intensidadhoraria: req.body.intensidadhoraria,
		modalidad: req.body.modalidad,
		estado: req.body.estado,
		inscritos: req.body.inscritos,
		boton:req.body.boton
	});
});

app.get('/ofertacursos', (req, res) =>{
	res.render('ofertacursos')
});

app.get('*',(req, res)=>{
	res.render('error', {
		estudiante: 'error'
	});
});

module.exports = app;
