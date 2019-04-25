const hbs = require('hbs');
const fs = require('fs');
const data = require('./../data.js');
const app = require('./../app.js');
var jsdom = require('jsdom');
$ = require('jquery')(new jsdom.JSDOM().window);
const listaCursos = data.listadecursos;
const User = require('./../models/user');
const Course = require('./../models/course');
const session = require('express-session');

const listaUsuarios = data.listadeusuarios;
listaPersonas = data.listadeusuarios;
listaInscritos = [];
listaActualizaUsuarios = [];

//Incribir cursos con mongodb y listarlos

hbs.registerHelper('inscription', (listado) => {
	let texto = `	<form action="/dashboarduser" method="post">
			<table class='table table-striped table-hover'>
					<thead class='thead-dark'>
					<th>Nombre</th>
					<th>Valor</th>
					<th>Intensidad</th>
					<th>Modalidad</th>
					<th></th>
					<th></th>
					</thead>
					<tbody>`;
		listado.forEach(materia =>{
			texto = texto +
					`<tr>
					<td> ${materia.name} </td>
					<td> ${materia.value} </td>
					<td> ${materia.intensity}</td>
					<td> ${materia.modality} </td>
					<td><button class="btn btn-primary" name="ver" id="informacion">Ver</button></td>
					<td><button class="btn btn-primary" name="inscribir" value="${materia.name}">Inscribir</button></td>
					</tr> `;
		})
	texto = texto + '</tbody> </table></form>';
	return texto;
});

//Cerrar cursos y listarlos mongo
hbs.registerHelper('closeCourse', (courses,nameUser) => {
	let texto = `	<form action="/dashboardadmin" method="post">
			<table class='table table-striped table-hover'>
					<thead class='thead-dark'>
					<th>Nombre</th>
					<th>Valor</th>
					<th>Intensidad</th>
					<th>Modalidad</th>
					<th>Estado</th>
					<th></th>
					<th></th>
					</thead>
					<tbody>`;
		courses.forEach(course =>{

			// switch
			let switchVal = "cerrar"
  		if(course.state == "Cerrado"){
    			switchVal  = "abrir"
			}
      console.log(course.students);
			var myJSON = JSON.stringify(course.students);

			texto = texto +
					`<tr>
					<td> ${course.name} </td>
					<td> ${course.value} </td>
					<td> ${course.intensity}</td>
					<td> ${course.modality} </td>
					<td> ${course.state}</td>
					<td>
						<p>
						  <button class="btn btn-primary" type="submit" data-toggle="collapse" data-target="#collapseExample${course.name}" aria-expanded="false" aria-controls="collapseExample${course.name}" name="inscritos" value="${course.name}">
						    Inscritos
						  </button>
						</p>
						<div class="collapse" id="collapseExample${course.name}">
						  <div class="card card-body">
						     ${myJSON}
						  </div>
						</div>
					</td>
					<td><button class="btn btn-primary" type="submit" name=${switchVal} value="${course.name}">${switchVal}</button></td>
					</tr> `;
		})
	texto = texto + '</tbody> </table></form>';
	return texto;
});

//Eliminar inscripcion base de dato

hbs.registerHelper('cancelIncription', (miscursos) => {
	let texto = `	<form action="/dashboarduser" method="post">
			<table class='table table-striped table-hover'>
					<thead class='thead-dark'>
					<th>Nombre</th>
					<th>Valor</th>
					<th>Intensidad</th>
					<th>Modalidad</th>
					<th></th>
					</thead>
					<tbody>`;
		miscursos.forEach(materia =>{
			texto = texto +
					`<tr>
					<td> ${materia.name} </td>
					<td> ${materia.value} </td>
					<td> ${materia.intensity}</td>
					<td> ${materia.modality} </td>
					<td><button class="btn btn-danger" name="eliminar" value="${materia.name}">Cancelar</button></td>
					</tr> `;
		})
	texto = texto + '</tbody> </table></form>';
	return texto;
});




// helpers viejos --------------------

hbs.registerHelper('listarCursosDisponibles', ()=>{
let texto = " ";
let count = 1;
	listaCursos.forEach ( curso => {
		if(curso.estado == "disponible"){
			console.log(curso.nombre);
	     texto = texto + `<div id='accordion'>
			 <div class="card mb-2">
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
			  </div>
				</div>`;
		 }
		 console.log(count)
		 count++;
	});
	return texto;
	console.log(texto);
});

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
