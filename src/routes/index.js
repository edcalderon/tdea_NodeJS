//Requires
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const multer = require('multer');
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
				req.session.phone = result.phone
				req.session.coordinador = true
				if(result.avatar){
					req.session.avatar = result.avatar.toString('base64')
				}
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
					button: "success",
				})
			}
			if(result && bcrypt.compareSync(req.body.inputPassword, result.password) && result.roll == "aspirante"){
				// session variables
				req.session.user = result._id
				req.session.roll = result.roll
				req.session.name = result.firstname
				req.session.lastname = result.lastname
				req.session.email = result.email
				req.session.cc = result.cc
				req.session.phone = result.phone
				if(result.avatar){
					req.session.avatar = result.avatar.toString('base64')
				}

					// jwt jsonwebtoken creation
			 		// 	let token = jwt.sign({
			 		// 		user: result
			 		// 	}, 'word-secret',{expiresIn: '4h'});
			    //  // Save token in localstorage
					// 	 localStorage.setItem('token', token);

				 res.render('loginregister', {
					login: req.body.login,
					show: "Usuario y Contraseña correctas! ya puedes continuar.",
					path: "/dashboarduser",
					button: "success",
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
			listado : req.session.listado,
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
	// Guardar cursos

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
		}
		if(req.body.cerrar){
		 //Actualizar estado
			 Course.findOneAndUpdate({name: req.body.cerrar}, {$set: {state: "Cerrado"}}, (err, resultado) => {
		 		if (err){
		 			return console.log(err)
		 		}
				console.log(resultado)
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
		if(req.body.inscritos){
			res.render ('dashboardadmin', {
				courses : req.session.courses,
				verCursosDisponibles : req.session.verCursosDisponibles
			})

			console.log('HOLA')
			// students = req.session.courses;
			// console.log('los cursos ' + students)
			// names =  [];
			// students.forEach(student =>{
			// 	console.log('EL id_' + student)
			// 	User.aggregate([{$match: {_id: student}},{$project: {_id:0, firstname:1}}],(err,result)=>{
			// 		if(err){
			// 			return console.log('Error!: ' + err)
			// 		}
			// 		return console.log('Cada resultado es: ' + result)
			// 	});
			// })
		}

});

app.get('/dashboardprofile', (req, res) =>{
  	res.render('dashboardprofile', {
		})
});

// // Multer Storage
// var storage = multer.diskStorage({
// 	destination: function(req,file,cb){
// 		cb(null, 'public/uploads')
// 	},
// 	filename: function(req,file,cb){
// 		cb(null,'avatar' + req.session.name + path.extname(file.originalname))
// 	}
// })
// // Multer destin folder
// var upload = multer({storage:storage})

// Multer destin folder
var upload = multer({})

app.post('/dashboardprofile', upload.single('userPhoto') ,(req, res) =>{

		User.findOneAndUpdate({_id: req.session.user}, {$set: {avatar: req.file.buffer}}, (err, resultado) => {
			if (err){
				 return console.log(err)
			 }res.render('dashboardprofile', {
				resultshow: "avatar cargado correctamente"
			  })
		})
});

app.get('/exit', (req, res) =>{
		//localStorage.setItem('token', ' ')
		res.locals.session = false
		req.session.destroy()
  	res.render('indexdashboard', {
		})
});


app.get('*',(req, res)=>{
	res.render('error', {
		estudiante: 'error'
	});
});

module.exports = app;
