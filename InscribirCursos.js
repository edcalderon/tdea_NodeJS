const exportedcourses = require ('./Cursos');
const fs = require('fs');

const options = {
   id:{
     demand: true,
     alias: 'i'
   },
   nombre:{
     demand: true,
     alias: 'n'
   },
   cedula:{
     demand: true,
     alias: 'c'
   }
}
const argv = require('yargs')
            .command('inscribir','inscribirse ',options)
            .argv

var infoCurso = exportedcourses.cursos.find(curso => curso.id  == argv.i );

let createArchivo = () =>{
  texto = "El estudiante "+argv.n+" con celuda  "+argv.c+ "\n" +
           " se a matriculado en el curso  "+ infoCurso.nombre + " que tiene una duracion de "+infoCurso.duracion+
           " horas y un valor de "+infoCurso.valor + " pesos";
  /*
  fs.appendFile('Incripcion.txt',texto,(err)=>{
    if (err) throw (err);
    console.log('se ha creado el archivo');
  */
  return texto;
  }

if(!infoCurso && !argv.i){
    exportedcourses.show();
}
if (!infoCurso && argv.i ){
  console.log("Mensaje de Alerta no se encontro el id");
  exportedcourses.show();
}
if (infoCurso){
  createArchivo();
}

module.exports = {
  createArchivo,
  argv

};
