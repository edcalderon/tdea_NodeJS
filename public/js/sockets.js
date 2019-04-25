socket = io()

socket.on("message", (info) => {
  console.log(info)
})

socket.emit("message","Estoy conectado")
