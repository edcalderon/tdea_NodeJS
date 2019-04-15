const express = require('express');
const app = express()
const path = require('path')
const hbs = require('hbs');
const bodyParser = require('body-parser')
require('./../helpers/helpers');

// Directory Paths
const directorio_partials = path.join(__dirname, './../../templates/partials');
const directorio_views = path.join(__dirname, './../../templates/views');

hbs.registerPartials(directorio_partials);
app.set('views',directorio_views);
app.set('view engine', 'hbs');//Le configuramos el motor de templates o de vistas


// Model user mongodb
const User = require('./../models/user.js');

// Paths
app.get('/', (req, res) =>{
	res.render('index', {

	});
});

app.get('/login', (req, res) =>{
	res.render('login', {
		inicio: "req.body.seccion"
	});
});

app.post('/login', (req, res) =>{

/*
	res.render('login', {
		inicio: "req.body.seccion",
		registro: req.body.registro,
		login: req.body.login,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		phone: req.body.phone,
		cc: req.body.cc,
		roll: req.body.roll,
	});
*/

  let user = new User({
    email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		phone: req.body.phone,
		id: req.body.cc,
		roll: req.body.roll
  })

  user.save( (err,result) => {
    if(err){
      console.log("error" + err )
      res.render('loginpost',{
        show: err
      })
    }
    console.log("result" + result)
    console.log("pipisote")
    res.render('loginpost', {
        show: result
    })
  })

});

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
