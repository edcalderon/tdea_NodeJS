class Usuarios{

	constructor() {
		this.usuarios = [];
	}

	agregarUsuario(id, nombre){
		let usuario = {id, nombre}
		this.usuarios.push(usuario)
		return this.usuarios;
	}

	getUsuarios (){
		return this.usuarios
	}

	getUsuario(id){
		let usuario = this.usuarios.filter( user => user.id == id)[0]
		return usuario
	}

	borrarUsuario(id){
		let usuarioBorrado = this.getUsuario(id)
		this.usuarios = this.usuarios.filter( user => user.id!= id)
		return usuarioBorrado
	}

	getDestinatario(nombre){
		let destinatario = this.usuarios.filter(user => user.nombre == nombre)[0]
		return destinatario
		}
}


module.exports = {
	Usuarios
}
