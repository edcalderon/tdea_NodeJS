const exportedcourses = require ('./Cursos');
const express = require('express');
const app = express();

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

if (!infoCurso && !argv.i){
  console.log(exportedcourses.show())
}

if (!infoCurso && argv.i){
  app.get('/', function (req, res) {
    res.send('Mensaje de Alerta: no se encontro el id')
  })
  app.listen(3000, ()=>console.log(exportedcourses.show()));
}

if (infoCurso){
  texto = "El estudiante "+argv.n+" con celuda  "+argv.c+ "\n" +" se a matriculado en el curso  "+ infoCurso.nombre + " que tiene una duracion de "+infoCurso.duracion+" horas y un valor de "+infoCurso.valor + " pesos";
  app.get('/', function (req, res) {
    res.send(texto)
  })
  app.listen(3000)
}
