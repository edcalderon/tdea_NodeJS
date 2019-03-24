const {argv} = require('./yargs');
const funciones = require('./funciones');


let comando = argv._[0];

switch (comando){
	case 'crear':
	funciones.crear(argv); //Recibe como parametro nombre, notas de las materias que estan almacenados en 'argv'
	break

	case 'mostrar':
	funciones.mostrar();
	break

	case 'mostrarest':
	funciones.mostrarest(argv.nombre); //Mostrar solo los datos de ese estudiante con identificador unico nombre
	break

	case 'mostrarmat':
	funciones.mostrarmat();
	break

	case 'promedio':
	funciones.promedio(argv.nombre);
	break

	case 'mostrarprom':
	funciones.mostrarprom();
	break

	case 'actualizar':
	funciones.actualizar(argv.nombre, argv.asignatura, argv.calificacion)
	break

	case 'eliminar':
	funciones.eliminar(argv.nombre);
	break

	default:
	console.log('No ingreso un comando existente')
}

// console.log(argv)
// console.log(argv.asignatura)