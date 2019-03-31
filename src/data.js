
const fs = require('fs');

class Curso {
  constructor(nombre, descripcion, id , valor, intensidadhoraria, modalidad, estado){
    this.nombre= nombre;
    this.descripcion= descripcion;
    this.id = id;
    this.valor = valor;
    this.intensidadhoraria= intensidadhoraria;
    this.modalidad = modalidad;
    this.estado = estado;
  }
};
const c1 = new  Curso('NodeJS','curos NodeJS',1,0,30,' virtual','encurso');
const c2 = new  Curso('alaVergaJS','curos deMIerda',2,999999,30,' virtual','disponibe');

let listadecursos = [];
listadecursos.push(c1);
listadecursos.push(c2);

const guardar = () => {

	let datos = JSON.stringify(listadecursos);
	fs.writeFile('dbcursos.json', datos, (err) => {
		if (err) throw (err);
		console.log('Archivo creado con éxito');
	})

};




module.exports = {
  Curso,
  listadecursos,
  guardar
};
