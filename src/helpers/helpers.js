const hbs = require('hbs');
const fs = require('fs');
const data = require('./../data.js');
const app = require('./../app.js');
var jsdom = require('jsdom');
$ = require('jquery')(new jsdom.JSDOM().window);
const listaCursos = data.listadecursos;

const listaUsuarios = data.listadeusuarios;
listaPersonas = data.listadeusuarios;
listaInscritos = [];
listaActualizaUsuarios = [];

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
							let texto = `<p> usuario y contraseña correctas </p>
														<form method='post' action='/indexcoordinador'>
																 <input type='hidden' name='session' value='session'>
																 <input type='hidden' name='coordinador' value=${check.username}>
											  				<button type='submit'  class='btn btn-success'>Continuar </button>
													  </form>`;
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

	let campos = "<div class='col-sm-4'>\
	       <table class='table' style='width: 400px'>\
				<thead class='thead-dark'>\
				<th> Nombre </th>\
				<th> Descripcion </th>\
				<th> valor </th>\
				</thead>\
				</table>\
				</div>";

	let texto = "<div class='accordion' id='accordionExample' >";

	i=1;
	listaCursos.forEach( curso => {

		if(curso.estado == 'disponible'){
			texto = texto +
				`<div class="card col-xs-4">
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
				    </div>
				</div>`
				i=i+1;
		}
	})

	return campos+texto;
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
		if(datoAspirante){
			var cursosRepetidos = datoAspirante.curso.find(a => a == Curso)
		}
		if(!cursosRepetidos && datoAspirante){
			datoAspirante.curso.push(Curso)
			inscribir();
			let texto = "<p>La inscripción se realizo satisfactoriamente. </p>";
			return texto;
		}else if(!datoAspirante){
			let texto = "<p>No existes, por favor EXITe .</p>";
			return texto;
		}else{
			let texto = "<p>No te puedes inscribir al curso por ya estas en él, baboso.</p>";
			return texto;
		}
});



//________________________Funcionalidad adicional para coordinador__________________________________
hbs.registerHelper('listarCursosDisponibles', ()=>{
let texto = " ";
let count = 1;
	listaCursos.forEach ( curso => {
		if(curso.estado == "disponible"){
			console.log(curso.nombre);
	     texto = texto + `
			 <div class="card">
			     <div class="card-header" id="heading${count}">
			       <h5 class="mb-0">
			         <button class="btn btn-link" data-toggle="collapse" data-target="#collapse${count}" aria-expanded="true" aria-controls="collapse${count}">
			          CURSO: ${curso.nombre} VALOR: ${curso.valor} DESCRIPCION: ${curso.descripcion}
			         </button>
			       </h5>
			     </div>
			     <div id="collapse${count}" class="collapse " aria-labelledby="heading${count}" data-parent="#accordion">
			       <div class="card-body">
			        DESCRIPCION: ${curso.descripcion} MODALIDAD: ${curso.modalidad} INTENSIDAD HORARIA: ${curso.intensidadhoraria}
			       </div>
			     </div>
			  </div>`;
		 }
		 console.log(count)
		 count++;
	});
	return texto;
	console.log(texto);
});


hbs.registerHelper('listarCursosPropios', (id)=>{
	console.log(id);
	console.log(id);
let texto = " ";
let count = 1;
	listaUsuarios.forEach ( usuario => {
		if(usuario.id == id ){

	     texto = texto + `
			 <div class="card">
			     <div class="card-header" id="heading${count}">
			       <h5 class="mb-0">
			         <button class="btn btn-link" data-toggle="collapse" data-target="#collapse${count}" aria-expanded="true" aria-controls="collapse${count}">
			          CURSO: ${usuario.curso}
			         </button>
			       </h5>
			     </div>
			     <div id="collapse${count}" class="collapse " aria-labelledby="heading${count}" data-parent="#accordion">
			       <div class="card-body">

			       </div>
			     </div>
			  </div>`;
		 }
		 console.log(count)
		 count++;
	});
	return texto;
	console.log(texto);
});

//_______________________Quinta historia de usuario: aspirante eliminar curso________________________________________________

hbs.registerHelper('eliminarcursosInscritos', (id, Curso) =>{

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
			console.log('Se desinscribio satisfactoriamente')
		})
	}

	listar();
	let datoInscrito = listaInscritos.find(i => i.id == id);
	console.log(datoInscrito)

	const eliminarInscripcion = () => {
		index = '';
		if(datoInscrito){
			for(var i=0; i<listaInscritos.length; i++){
				if(datoInscrito.id == listaInscritos[i].id){
					listaInscritos.splice(i,1)
					break;
				}
			}
			var index = datoInscrito.curso.indexOf(Curso);
		}else{
			console.log('El usuario con la id ingresada no existe');
			let texto = "<p>El usuario con la id ingresada no existe</p>";
			return texto;
			index = -1;
		}

		if(index > -1){
			var cursoBorrado = datoInscrito.curso.splice(index, 1);
			listaInscritos.push(datoInscrito);
			guardar();
			console.log(datoInscrito)
			let texto = "<p>La inscripción ha sido eliminada con éxito</p>";
			return texto;
		}else{
			let texto = `<p>Actualmente no tienes el curso inscrito</p>`;
			return texto;
		}
	}

	eliminarInscripcion();

	const listarcursosInscritos = () => {
		listar();
		let datoInscrito = listaInscritos.find(i => i.id == id);
		if(datoInscrito){
			let texto = "<table class='table table-hover'>\
					<thead>\
					<th> Nombre </th>\
					</thead>\
					<tbody>";

			listaCursos.forEach ( curso => {
				texto = texto +
						'<tr>'+
							'<td>'+ datoInscrito.curso + '</td>' +
						'</tr>'
						'</tbody>'
						'</table>';
			});
			return texto;
		}else{
			console.log('paso algo' +datoInscrito)
		}
	}
	listarcursosInscritos();

})

//___________Segunda parte quinta historia de usuario listar los cursos en el que el aspirante esta inscrito_____


//_____________________Octava historia de usuario: Actualizar usuario_______________________________________
hbs.registerHelper('actualizarUsuario',(id, username, email, phone, roll) =>{
	console.log(username)
	console.log(email)
	console.log(phone)
	console.log(roll)
	console.log(id)

	const listar = () =>{
		try{
			listaActualizaUsuarios = require('../dbusuarios.json');
		} catch(error){
			listaActualizaUsuarios = [];
		}
	}

	const guardar = () => {
		let datos = JSON.stringify(listaActualizaUsuarios);
		fs.writeFile('dbusuarios.json', datos, (err) => {
			if (err) throw (err);
			console.log('Se actualizo el usuario satisfactoriamente')
		})
	}

	const actualizar = () =>{
		listar();
		for(var i=0; i<listaActualizaUsuarios.length; i++){
			if(datoUsuario.id == listaActualizaUsuarios[i].id){
				listaActualizaUsuarios.splice(i,1)
			break;
			}
		}
		var usuarioActualizado = {email: email, username: username, password: datoUsuario.password, phone: phone, id: datoUsuario.id, roll: roll, curso: datoUsuario.curso};
		listaActualizaUsuarios.push(usuarioActualizado)
		guardar();
	}

	var datoUsuario = listaPersonas.find(i => i.id == id);
	if(datoUsuario){
		actualizar();
		let texto = "<p>La actualizacion se realizo satisfactoriamente</p>";
		return texto
	}else{
		let texto = "<p>Ingresa correctamente la id</p>";
		return texto
	}
})

// mongodb third delivery

hbs.registerHelper('createUserMongo',(email, username, password, phone, id, roll) => {
	  collectionUsers.insertOne({
	    email: email,
	    username: username,
	    password: password,
	    phone: phone,
			id: id,
	    roll: roll,
	    curso: []
	    }, (err,result)=>{
	      if(err){
	        return console.log("error" + err)
	      }
	      return console.log(result.ops)
	  	});
});
