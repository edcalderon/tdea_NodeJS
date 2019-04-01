const hbs = require('hbs');
const fs = require('fs');
const data = require('./data.js');

const listaCursos = data.listadecursos;

const listaUsuarios = data.listadeusuarios;
listaPersonas = data.listadeusuarios;
listaInscritos = [];

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

	listaCursos.forEach ( curso => {
		texto = texto +
				'<tr>'+
					'<td>'+ curso.nombre + '</td>' +
					'<td>'+ curso.descripcion + '</td>' +
					'<td>'+ curso.id +'</td>' +
					'<td>'+ curso.valor +'</td>' +
					'<td>'+ curso.intensidadhoraria +'</td>' +
					'<td>'+ curso.modalidad +'</td>' +
					'<td>'+ curso.estado + '</td>' +
				'</tr>'
				'</tbody>'
				'</table>';
	});
	return texto;
});


hbs.registerHelper( 'registrarCurso', (nombre, descripcion, id , valor, intensidadhoraria, modalidad, estado, inscritos) => {


		let cur = new data.Curso(nombre, descripcion, id , valor, intensidadhoraria, modalidad, estado, inscritos)
		let duplicado = listaCursos.find(nom => nom.nombre == nombre)
		if(!duplicado){
			listaCursos.push(cur);
			data.guardarCursos();
		}else{
			console.log('Ya existe un curso con ese nombre');
		}
		console.log(listaCursos);

});


hbs.registerHelper( 'registrarUsuario', (email, username, password, phone, id, roll) => {


		let usr = new data.Usuario(email, username ,password, phone, id, roll)
		let duplicado = listaUsuarios.find(iter => iter.id == id)
		if(!duplicado){
			listaUsuarios.push(usr);
			data.guardarUsuarios();
			let texto = "Usuario creado correctamente.";
			return texto;
		}else{
			return "Ya existe un usuario con ese ID.";

		}
		console.log(listaUsuarios);
});



hbs.registerHelper( 'checkearUsuario', ( username, password ) => {
    console.log(username,password);
		let check = listaUsuarios.find(usern => usern.username == username && usern.password== password );
		if(!check){
			let texto = "<p> usuario o contraseña incorrectas </p>\
									<form>\
				  					<button class='btn btn-danger' formaction='/login'>Continuar </button>\
									</form>";
			return texto;
				console.log('no existe usuario con ese email');
		}

		if(check && check.roll == 'coordinador'){

							let texto = "<p> usuario y contraseña correctas </p>\
														<form method='post' action='/indexcoordinador'>\
																 <input type='hidden' name='session' value='session'>\
											  				<button type='submit'  class='btn btn-success'>Continuar </button>\
													  </form>";
							return texto;
			}
			else{

								let texto = "<p> usuario y contraseña correctas </p>\
															<form method='post' action='/indexaspirante'>\
																	 <input type='hidden' name='session' value='session'>\
																	<button type='submit'  class='btn btn-success'>Continuar </button>\
															</form>";
								return texto;
				}


});

//______________________________________________________________________________
//TERCERA HISTORIA DE USUSARIO: Listar oferta de cursos para interesados

hbs.registerHelper('listarofertaCursos', ()=>{

	let campos = "<div class='col-md-6'><table class='table' style='width: 400px'>\
				<thead class='thead-dark'>\
				<th> Nombre </th>\
				<th> Descripcion </th>\
				<th> valor </th>\
				</thead>\
				</table></div>";

	let texto = "<div class='accordion' id='accordionExample' >";

	i=1;
	listaCursos.forEach( curso => {

		if(curso.estado == 'disponible'){
			texto = texto +
				`<div class="card col-xs-12">
				    <div class="card-header" id="heading${i}">
				      <h5 class="mb-0">
				        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapseOne">
				          <table class="table">
				          <tbody>
				          	<tr>
				          		<td>${curso.nombre}</td>
				          		<td>${curso.descripcion}</td>
				          		<td>${curso.valor}</td>
				          	</tr>
				          	</tbody>
				          </table>
				        </button>
				      </h5>
				    </div>

				    <div id="collapse${i}" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
				      <div class="card-body">
				      	La descripción del curso es: ${curso.descripcion}<br>
				      	La intensidad horaria es: ${curso.intensidadhoraria}<br>
				      	La modalidad es: ${curso.modalidad}<br>
				      </div>
				    </div>`
				i=i+1;
		}
	})
	texto = texto + '</div>';
	return campos+texto
});

//_________Inscribir cursos como aspirante_____________________________

hbs.registerHelper('inscribirCurso', (id, Curso) => {

	const listar = () =>{
		try{
			listaInscritos = require('../inscritos.json');
		} catch(error){
			listaInscritos = [];
		}
	}

	const guardar = () => {
			let datos = JSON.stringify(listaInscritos);
			fs.writeFile('inscritos.json', datos, (err) => {
				if (err) throw (err);
				console.log('se inscribio satisfactoriamente')
			})
	}

	const inscribir = () =>{
		listar()
		for(var i=0; i<listaInscritos.length; i++){
			if(datoAspirante.id == listaInscritos[i].id){
				listaInscritos.splice(i,1)
			break;
			}
		}
		
		var nuevoInscrito = {email: datoAspirante.email, username: datoAspirante.username, password: datoAspirante.password, phone: datoAspirante.phone, id: datoAspirante.id, roll: datoAspirante.roll, curso: datoAspirante.curso};
		listaInscritos.push(nuevoInscrito)
		guardar();
	}

	var datoAspirante = listaPersonas.find(i => i.id == id);
	var cursosRepetidos = datoAspirante.curso.find(a => a == Curso)

	console.log(cursosRepetidos)
	if(!cursosRepetidos){
		datoAspirante.curso.push(Curso)
		inscribir();
		let texto = "<p>La inscripción se realizo satisfactoriamente</p>";
		return texto
	}else{
		let texto = "<p>No te puedes inscribir al curso</p>";
		return texto
	}
})
