class Users{

	constructor() {
		this.users = [];
	}

	addrUser(id, nombre){
		let user = {id, name}
		this.users.push(user)
		return this.users;
	}

	getUser (){
		return this.users
	}

	getUsers(id){
		let user = this.users.filter( fuser => fuser.id == id)[0]
		return user
	}

	deleteUser(id){
		let deletedUser = this.getUser(id)
		this.users= this.users.filter( fuser => fuser.id!= id)
		return deletedUser
	}

	getDestin(name){
		let destin = this.users.filter(fuser => fuser.nombre == name)[0]
		return destin
		}
}

module.exports = {
	Users
}
