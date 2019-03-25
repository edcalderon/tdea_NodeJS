const express = require('express')
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./helpers');

//Acceso a los directorios
const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../partials');

app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);

//Middleware
app.use(express.static(directoriopublico));
app.use(bodyParser.urlencoded({extended: false}));


//Settings
app.set('view engine', 'hbs') 

//rutas
app.get('/', (req, res)=>{
	res.render('index')
})

app.get('/cursos', (req, res,)=>{
	  	res.render('cursos', {
  		cursoDispobible1: 'Matemáticas',
  		descripcion1: 'Ciclo de fundamentación',
  		valor1: '$1000',

  		cursoDispobible2: 'Ciencias S',
  		descripcion2: 'Ciclo de fundamentación',
  		valor2: '$2000',
  	});

	// console.log(req.query.hasOwnProperty("butt1"));
	// if(req.query.hasOwnProperty("butt1")){
	// 	return res.redirect(path.join(__dirname, '../views', 'masInfoCurso.hbs'));
	// }else{
	// 	return res.redirect(path.join(__dirname, '../views', 'masInfoCurso.hbs'));
	// }
});

app.get('/cursos',(req, res) =>{
	console.log(req.query.hasOwnProperty("butt1"));
	if(req.query.hasOwnProperty("butt1")){
		return res.redirect(path.join(__dirname, '../views', 'masInfoCurso.hbs'));
	}else{
	return res.redirect(path.join(__dirname, '../views', 'masInfoCurso.hbs'));
	}
});

app.get('/masInfoCurso' ,(req, res, next) =>{
	res.render('masInfoCurso',{
		descripcion1: 'Ciclo fundamental',
		modalidad1: 'Virtual',
		horas1: '20 horas semanales',
		
		descripcion2: 'Ciclo fundamental',
		modalidad2: 'Presecial',
		horas2: '10 horas semanales',
	})
})


//Servidor montado
app.listen(3000,()=>{
	console.log('Servidor funcionando en puerto 3000')
})