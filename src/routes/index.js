//Requires
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');
var $ = require("jquery");
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
				req.session.name = result.firstname
				req.session.lastname = result.lastname
				req.session.email = result.email
				req.session.cc = result.cc

				// jwt jsonwebtoken creation
				//  let token = jwt.sign({
				// 		user: result
				// 	}, 'word-secret',{expiresIn: '4h'});
			 	// // Save token in localstorage
				//    localStorage.setItem('token', token);

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
				req.session.name = result.firstname
				req.session.lastname = result.lastname
				req.session.email = result.email


						// jwt jsonwebtoken creation
			 		// 	let token = jwt.sign({
			 		// 		user: result
			 		// 	}, 'word-secret',{expiresIn: '4h'});

			    //  // Save token in localstorage
					// 	 localStorage.setItem('token', token);

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
	Course.find({state: "Disponible"},(err,result)=>{
		if (err){
			return console.log(err)
		}
		req.session.listado = result;
		res.render ('dashboarduser',{
			listado : req.session.listado
		})
	})
});

app.post('/dashboarduser', (req, res) =>{
	//Validación
var conditions = {
	name: req.body.inscribir,
	students: { $in: req.session.user}
};

Course.find(conditions,(err,result)=>{
	if (err){
		return console.log(err)
	}
	console.log('LOS RESULTADOS SON:')
	console.log(req.session.user)
	console.log(result)
	console.log(result.length)
	if(result.length == 0){
			//********************* Actualización*****
			console.log('Te inscribiste correctamente!!!!')
			Course.findOneAndUpdate({name: req.body.inscribir},{$addToSet:{students: req.session.user}}, (err, curso) =>{
				console.log('RESULTADOS DEL POST')
				console.log(req.body.inscribir);
				console.log(curso)
				if (err){
					return res.render('dashboarduser',{
					  resultshow: "Hubo un error: " + err,
					  cardcolor: "danger"
				 })
				}

				res.render ('dashboarduser', {
					listado: req.session.listado,
					name: curso.name,
					description: curso.description,
					value: curso.value,
					intensity: curso.intensity,
					modality: curso.modality,
					state: curso.state,
					students: req.session.user,
					resultshow: "¡Se inscribió exitosamente en el curso " + curso.name + "!",
					cardcolor: "success"
				})
			})
	}else{
		return res.render('dashboarduser',{
			resultshow: "Upss! Actualmente estas inscrito",
			cardcolor: "warning"
		})
	}
});
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
	Course.find({},(err,result)=>{
		console.log(result)
		if (err){
			return res.render('dashboardadmin',{
				resultshow2: "Hubo un error: " + err,
				cardcolor2: "danger"
		 })
		}
		req.session.courses = result;
		req.session.verCursosDisponibles = req.query.verCursosDisponibles;
		res.render ('dashboardadmin',{
			courses : req.session.courses,
			verCursosDisponibles : req.session.verCursosDisponibles
		})
	})
});

app.post('/dashboardadmin', (req, res) =>{

	//______Guardar cursos
	if(req.body.nombreCurso){
	  	 let course = new Course ({
				name: req.body.nombreCurso,
	      description: req.body.descripcion,
				value: req.body.valor,
				intensity: req.body.intensidad,
				modality: req.body.modalidad,
				state:  req.body.estado,
			  students: []
			 })
			 course.save((err,result) =>{
				 if(err){
					 return res.render('dashboardadmin',{
			 				result: "Error!",
							resultshow: "Hubo un error: " + err,
							cardcolor: "danger"
						})
				 }
				 return res.render('dashboardadmin',{
			 			result: "Hecho!",
						resultshow: "Curso creado correctamente",
						cardcolor: "success"
					})
			 })
		}else{
		 //*******Actualizar estado*********
			 Course.findOneAndUpdate({name: req.body.cerrar}, {$set: {state: "Cerrado"}}, (err, resultado) => {
		 		if (err){
		 			return console.log(err)
		 		}

		 		res.render ('dashboardadmin', {
					courses : req.session.courses,
					verCursosDisponibles : req.session.verCursosDisponibles,
					name: resultado.name,
					description: resultado.description,
					value: resultado.value,
					intensity: resultado.intensity,
					modality: resultado.modality,
					state: resultado.states,
					students: resultado.students,
					resultshow2: "El curso "+resultado.name+" ha finalizado " ,
					cardcolor2: "success"
		 		})
		 	})
		}
});

app.get('/dashboardprofile', (req, res) =>{
  	res.render('dashboardprofile', {
		})
});

app.get('/dashboardprofile', (req, res) =>{
  	res.render('dashboardprofile', {
		})
});

app.get('/dashboardprofile', (req, res) =>{
  	res.render('dashboardprofile', {
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
