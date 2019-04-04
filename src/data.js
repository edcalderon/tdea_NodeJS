
const fs = require('fs');

class Curso {
  constructor(nombre, descripcion, id , valor, intensidadhoraria, modalidad, estado, inscritos){
    this.nombre= nombre;
    this.descripcion= descripcion;
    this.id = id;
    this.valor = valor;
    this.intensidadhoraria= intensidadhoraria;
    this.modalidad = modalidad;
    this.estado = estado;
    this.inscritos = inscritos;
  }
};
const c1 = new  Curso('NodeJS','el mejor cursos de todos ',1,0,30,' virtual','disponible',['edward','valentina']);
const c2 = new  Curso('Java','curso introduccion a java',2,999999,30,' virtual','disponible',['edward']);
const c3 = new  Curso('FundamentosDeJS','curso de javaScript',3,999999,30,'virtual','disponible',[]);

let listadecursos = [];



if(listadecursos.length==0){
  listadecursos.push(c1);
  listadecursos.push(c2);
  listadecursos.push(c3);
}


const guardarCursos = () => {
	let datos = JSON.stringify(listadecursos);
      fs.writeFile('dbcursos.json', datos, (err) => {
    		if (err) throw (err);
    		console.log('Archivo creado con éxito');
    	});
};

class Usuario {
  constructor(email, username, password, phone, id, roll, curso){
    this.email= email;
    this.username = username;
    this.password = password;
    this.phone = phone;
    this.id = id;
    this.roll = roll;
    this.curso = curso;
  }
};

const u1 = new  Usuario('edwardca12@gmail.com','ed','123',301,1152,'coordinador',[]);
const u2 = new  Usuario('valentina@gmail.com','valentina','abc',302,1153,'aspirante',['NodeJS']);
const u3 = new  Usuario('emilio@gmail.com','Emilio','456','1234567','2','aspirante',['NodeJS']);

let listadeusuarios = [];
listadeusuarios.push(u1);
listadeusuarios.push(u2);
listadeusuarios.push(u3);

const guardarUsuarios = () => {

	let datos = JSON.stringify(listadeusuarios);
	fs.writeFile('dbusuarios.json', datos, (err) => {
		if (err) throw (err);
		console.log('Archivo creado con éxito');
	})

};


















module.exports = {
  Curso,
  listadecursos,
  guardarCursos,
  Usuario,
  listadeusuarios,
  guardarUsuarios
};
