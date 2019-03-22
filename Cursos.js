class Curso {
  constructor(id,nombre,duracion,valor){
    this.id = id;
    this.nombre = nombre;
    this.duracion = duracion;
    this.valor = valor;
  }
};
const c1 = new  Curso(1,'NodeJS',1,0);
const c2 = new  Curso(2,'Java',999,999);
const c3 = new  Curso(3,'Python',40,100);
const c4 = new  Curso(4,'MachineLearning',0101,1000);

let cursos = [c1,c2,c3,c4];

let showCourses = (callback) => {
        cursos.forEach(function(c,index){
            setTimeout(function(){
                let result = "El curso con id " +c.id+ " se llama curso " + c.nombre + " tiene una duracion de " +c.duracion+ " horas y tiene un costo de "+c.valor+ " pesos";
                callback(result);
             },2000 * index  )
        })
};

let show = () =>{
showCourses(function(result){
  console.log(result)
});
}

module.exports = {
  cursos,
  show
};
