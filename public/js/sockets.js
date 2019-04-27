socket = io()

// socket.on("mensaje", (informacion) =>{
// 	console.log(informacion)
// })

// socket.emit("mensaje", "Estoy conectado")

// socket.emit("contador")

// socket.on("contador", (contador) =>{
// 	console.log(contador)
// })

const form = document.querySelector('#chatForm')
const menssage = form.querySelector('#text')
const chat = document.querySelector('#chat')
var param = new URLSearchParams(window.location.search);

var users = param.get('name')

socket.on("connect",() =>{
	console.log(user)
	socket.emit('newUser', user)
})

socket.on('newUser', (text) =>{
	console.log(text)
	chat.innerHTML  = chat.innerHTML + text + '<br>'
})

socket.on('desconnectedUser', (text) =>{
	console.log(text)
	 chat.innerHTML  = chat.innerHTML + text + '<br>'
})

form.addEventListener('submit', (data) => {
	data.preventDefault()
	socket.emit('text', menssage.value, () => {
			menssage.value = ''
			menssage.focus()
			}
		)
})

socket.on("text", (text) =>{
	console.log(text)
	chat.innerHTML  = chat.innerHTML + text + '<br>'
})

const privateForm = document.querySelector('#privateForm')
const privateText = privateForm.querySelector('#PrivateText')
const destin = privateForm.querySelector('#destin')
const privateChat = document.querySelector('#privateChat')

privateForm.addEventListener('submit', (data) => {
	data.preventDefault()
	socket.emit('privateText', {
		destin : destin.value,
		privateMessage : privateMessage.value
	}, () => {
			privateChat.innerHTML  = privateChat.innerHTML + user + ':' + privateMessage.value  + '<br>'
			privateMessage.value = ''
			privateMessage.focus()
			}
		)
})

socket.on("privateText", (text) =>{
	console.log(text)
	privateChat.innerHTML  = privateChat.innerHTML + text + '<br>'
})
