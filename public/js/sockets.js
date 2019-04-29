socket = io()

// Counter
socket.on("message", (info) =>{
	console.log(info)
})
socket.emit("message", "I'm connected")
socket.emit("count")
socket.on("count", (count) =>{
	console.log(count)
})

// -----Chat------- //
var param = new URLSearchParams(window.location.search);

var usuario = param.get('nombre')

socket.on("connect",() =>{
	console.log(usuario)
	socket.emit('usuarioNuevo', usuario)
})

socket.on('nuevoUsuario', (texto) =>{
	console.log(texto)
	chat.innerHTML  = chat.innerHTML + texto + '<br>'
})

socket.on('usuarioDesconectado', (texto) =>{
	console.log(texto)
	chat.innerHTML  = chat.innerHTML + texto + '<br>'
})

const formulario = document.querySelector('#formulario')
const mensaje = formulario.querySelector('#texto')
const chat = document.querySelector('#chat')

formulario.addEventListener('submit', (datos) => {
	datos.preventDefault()
	socket.emit('texto', mensaje.value, () => {
			mensaje.value = ''
			mensaje.focus()
			}
		)
})

socket.on("texto", (text) =>{
	console.log(text)
  var currentTime = new Date();
	chat.innerHTML  = chat.innerHTML +
	`<div class="incoming_msg">
    <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
    <div class="received_msg">
      <div class="received_withd_msg">
        <p>${text}</p>
        <span class="time_date">${currentTime}</span></div>
    </div>
  </div>` + '<br>'
})

const formularioPrivado = document.querySelector('#formularioPrivado')
const mensajePrivado = formularioPrivado.querySelector('#textoPrivado')
const destinatario = formularioPrivado.querySelector('#destinatario')
const chatPrivado = document.querySelector('#chatPrivado')

formularioPrivado.addEventListener('submit', (datos) => {
	datos.preventDefault()
	socket.emit('textoPrivado', {
		destinatario : destinatario.value,
		mensajePrivado : mensajePrivado.value
	}, () => {
			chatPrivado.innerHTML  = chatPrivado.innerHTML + usuario + ':' + mensajePrivado.value  + '<br>'
			mensajePrivado.value = ''
			mensajePrivado.focus()
			}
		)
})

socket.on("textoPrivado", (text) =>{
	console.log(text)
	chatPrivado.innerHTML  = chatPrivado.innerHTML + text + '<br>'
})
