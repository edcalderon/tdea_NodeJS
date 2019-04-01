
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
const c1 = new  Curso('NodeJS','curos NodeJS',1,0,30,' virtual','encurso',['edward','valentina']);
const c2 = new  Curso('AlaVergaJS','curso deMIerda',2,999999,30,' virtual','disponibe',['edward']);
const c3 = new  Curso('FundamentosDeProcastinacion','pereza al 100',3,999999,30,'virtual','disponibe',[]);


let listadecursos = [];


console.log("holavalentoina");
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
  constructor(email, username, password, phone, id, roll){
    this.email= email;
    this.username = username;
    this.password = password;
    this.phone = phone;
    this.id = id;
    this.roll = roll;
  }
};

const u1 = new  Usuario('edwardca12@gmail.com','ed','123',301,1152,'coordinador');
const u2 = new  Usuario('sabrosongal@hot.sexy','valentina','abc',302,1153,'aspirante');

let listadeusuarios = [];
listadeusuarios.push(u1);
listadeusuarios.push(u2);

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
