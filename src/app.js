const express = require('express')
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser')
const data = require('./data.js');
require('./helpers');


// app.use(express.static(__dirname + '/public'))
//Lo que se quiere con este bloque de código es ir a la carpeta donde se tienen todos lo html o lo que se quiere mostrar
//_____________________________________________________________________________________________________
//Se debe utilizar path (que es para rutas), debido a que hay que salirse de /src para ir /public
const directorio_publico = path.join(__dirname, '../public');
const directorio_partials = path.join(__dirname, '../templates/partials');
const directorio_views = path.join(__dirname, '../templates/views');
const directorio_templates = path.join(__dirname, '../templates');   //Trae la carpeta donde esta el footer y el header
app.use(express.static(directorio_publico));
hbs.registerPartials(directorio_partials);
app.use(bodyParser.urlencoded({extended: false}));
app.set('views',directorio_views);
app.set('view engine', 'hbs');//Le configuramos el motor de templates o de vistas


//Guarda datos
data.guardar();

//rutas
app.get('/', (req, res) =>{
	res.render('index', {
		estudiante: 'Edward',
		titulo: 'Inicio'
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
		persona: "pepe"
	});
});

app.post('/crearcursos', (req,res)=>{
	res.render('crearcursos',{
		titulo: 'Creacion de cursos',
		persona: "aqui va seccion de administrador",
		nombre: req.body.nombre,
		descripcion: req.body.descripcion,
		id: req.body.id,
		valor: req.body.valor,
		intensidadhoraria: req.body.intensidadhoraria,
		modalidad: req.body.modalidad,
		estado: req.body.estado,
		boton:req.body.boton
	});
});


app.get('*',(req, res)=>{
	res.render('error', {
		estudiante: 'error'
	});
});


var puerto = 3001
app.listen(puerto,() =>{
	console.log('Escuchando en el puerto ' + puerto)
});
