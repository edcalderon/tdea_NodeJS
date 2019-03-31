const hbs = require('hbs');

const data = require('./data.js');

const listaCursos = data.listadecursos;

const listaUsuarios = data.listadeusuarios;

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
			data.guardarCursos();

		}else{
			console.log('Ya existe un curso con ese nombre');
		}
		console.log(listaCursos);

});


hbs.registerHelper( 'registrarUsuario', (email, username, password ) => {


		let usr = new data.Usuario(email, username ,password)
		let duplicado = listaUsuarios.find(ema => ema.email == email)
		if(!duplicado){
			listaUsuarios.push(usr);
			data.guardarUsuarios();

		}else{
			console.log('Ya existe un usuario con ese email');
		}
		console.log(listaUsuarios);

});



hbs.registerHelper( 'checkearUsuario', ( username, password ) => {
    console.log(username,password);

		let check= listaUsuarios.find(usern => usern.username == username && usern.password== password )
		if(!check){

			let texto = "<p> usuario o contraseña incorrectas </p>\
									<form>\
				  					<button class='btn btn-danger' formaction='/login'>Continuar </button>\
									</form>";
			return texto;
				console.log('no existe usuario con ese email');
		}else{
			let texto = "<p> usuario y contraseña correctas </p>\
										<form>\
							  				<button class='btn btn-success' formaction='/indexUsuarios?seccion=seccion'>Continuar </button>\
									  </form>";
			return  texto;
		}

});
