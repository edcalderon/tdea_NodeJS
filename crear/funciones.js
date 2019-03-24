const fs = require('fs');
listaEstudiantes = [];

const crear = (estudiante) => {
	listar();
	let est = {
		nombre: estudiante.nombre,
		matematicas: estudiante.matematicas,
		ingles: estudiante.ingles,
		programacion: estudiante.programacion
	};
	let duplicado = listaEstudiantes.find(nom => nom.nombre == estudiante.nombre)
	if(!duplicado){
		listaEstudiantes.push(est);
		console.log(listaEstudiantes)
		guardar();	
	}else{
		console.log('Ya existe un estudiante con ese nombre');
	}
}

//Permite traer lo que ya se tenia en el archivo json y agregarle datos
const listar = () =>{
	//Se utiliza si el listado es basicamente una constante
	try{
	listaEstudiantes = require('./listado.json');
	} catch(error){
	listaEstudiantes = [];
}
	//Si se esta trabajando de forma asincronica y el json varia de manera sincrona
	// listaEstudiantes = JSON.parse(fs.readFileSync('listado.json'));
}

const guardar = () => {
	//La funcion de json guarda el string lista estudiante dentro de un json 
	let datos = JSON.stringify(listaEstudiantes);
	fs.writeFile('listado.json', datos, (err) => {
		if (err) throw (err);
		console.log('Archivo creado con éxito');
	})
}

const mostrar = () =>{
	listar()
	console.log('Notas de los estudiantes')
	listaEstudiantes.forEach(estudiante =>{
		console.log(estudiante.nombre);
		console.log('notas');
		console.log(' matematicas ' +estudiante.matematicas);
		console.log(' ingles ' +estudiante.ingles);
		console.log(' programacion ' +estudiante.programacion + '\n')
	})
}

const mostrarest = (nom) => {
	listar();
	console.log(listaEstudiantes)
	let est = listaEstudiantes.find(buscar => buscar.nombre == nom);
	if(!est){
		console.log('No existe este estudiante');
	}else{
		console.log(est.nombre);
		console.log('notas');
		console.log(' matematicas ' +est.matematicas);
		console.log(' ingles ' +est.ingles);
		console.log(' programacion ' +est.programacion);
	}
}

const mostrarmat = () =>{
	listar()
	let ganan = listaEstudiantes.filter(mat => mat.matematicas >= 3);
	if (ganan.length == 0) {
		console.log('Ningun estudiante gano')
	}else{
		ganan.forEach(estudiante =>{
		console.log(estudiante.nombre);
		console.log('notas');
		console.log(' matematicas ' +estudiante.matematicas+'\n');
	})
	}
}

const actualizar = (nom, asignatura, calificacion) =>{
	listar()
	let encontrado = listaEstudiantes.find(buscar => buscar.nombre == nom);
	if(!encontrado){
		console.log('El estudiante no existe');
	}else{
		encontrado[asignatura] = calificacion;
		guardar()
	}
}

const eliminar = (nom) =>{
	listar()
	let nuevo = listaEstudiantes.filter(mat => mat.nombre != nom);
	console.log(nuevo)
	console.log(nuevo.length)
	console.log(listaEstudiantes.length)
	if (nuevo.length == listaEstudiantes.length) {
		console.log('Ningun estudiante tiene el nombre especificado')
	}else{
		listaEstudiantes = nuevo
		guardar()
	}
}
const promedio = (nom) =>{
	listar()
	let est = listaEstudiantes.find(buscar => buscar.nombre == nom);
	if (!est) {
		console.log('El estudiante no existe')
	}else{
		promEst = (est.matematicas+est.ingles+est.programacion)/3
		console.log('El promedio del estudiante ' +est.nombre + ' es ' +promEst );
	}
}

const mostrarprom = () =>{
	listar()
	listaEstudiantes.forEach(est=>{ 
		let prom = (est.matematicas+est.ingles+est.programacion)/3;
		if (prom > 3) {
			console.log(est.nombre + ' tiene un promedio mayor a 3')
		}else{
			console.log(est.nombre + ' tiene un promedio menor a 3')
		}
	})
}


module.exports = {
	crear,
	mostrar,
	mostrarest,
	mostrarmat,
	actualizar,
	eliminar,
	promedio,
	mostrarprom
}