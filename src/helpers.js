const hbs = require('hbs');

const data = require('./data.js');

listaCursos = data.listadecursos;

hbs.registerHelper('listarCursos', ()=>{


	let texto = "<table class='table table-hover'>\
				<thead>\
				<th> Nombre </th>\
				<th> Descripcion </th>\
				<th> id </th>\
				<th> valor </th>\
				<th> intensidadhoraria </th>\
				<th> modalidad </th>\
				<th> estado </th>\
				</thead>\
				<tbody>";

	listaCursos.forEach( curso => {
		texto = texto +
				'<tr>'+
					'<td>'+ curso.nombre + '</td>' +
					'<td>'+ curso.descripcion + '</td>' +
					'<td>'+ curso.id +'</td>' +
					'<td>'+ curso.valor +'</td>' +
					'<td>'+ curso.intensidadhoraria +'</td>' +
					'<td>'+ curso.modalidad +'</td>' +
					'<td>'+ curso.estado + '</td>'
				'</tr>'
				'</tbody>'
				'</table>';
	})
	return texto



});

hbs.registerHelper( 'registrarCurso', (nombre, descripcion, id , valor, intensidadhoraria, modalidad, estado) => {




		let cur = new data.Curso(nombre, descripcion, id , valor, intensidadhoraria, modalidad, estado)


		let duplicado = listaCursos.find(nom => nom.nombre == nombre)

		if(!duplicado){
			listaCursos.push(cur);
			data.guardar();

		}else{
			console.log('Ya existe un estudiante con ese nombre');
		}

		console.log(listaCursos);

});
