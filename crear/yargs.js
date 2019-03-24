const nombre = {
	demand: true,
	alias: 'n'
}

const matematicas = {
	demand: true,
	alias: 'm'
}

const ingles = {
	demand: true,
	alias: 'i'
}

const programacion = {
	demand: true,
	alias: 'p'
}

const creacion = {
	nombre,
	matematicas,
	ingles,
	programacion
}

const mostrarest = {
	nombre
}

const actualiza = {
	nombre,
	asignatura: {
		demand: true,
		alias: 'a'
	},
	calificacion: {
		demand: true,
		alias: 'c'
	}
}

const elimina = {
	nombre
}

const promediar ={
	nombre
}

const argv = require('yargs')
			 .command('crear', 'Crear un estudiante', creacion)
			 .command('mostrar', 'Muestra las notas de los estudiante')
			 .command('mostrarest', 'Muestra las notas del estudiante',mostrarest)
			 .command('actualizar', 'Actualizar la información de un curso',actualiza)
			 .command('eliminar', 'Elimina un estudiante', elimina)
			 .command('promedio', 'Calcular promedio del estudiante', promediar)
			 .argv

module.exports = {
	argv
};

