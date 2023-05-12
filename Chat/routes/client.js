const {io} = require('socket.io-client');

const socket = io('https://localhost:3004')


console.log("this is a test line");

socket.on("connect", ()=>{
  console.log(`you are connected with id : ${socket.id}`);
  socket.emit('userConnect', userId);
  router.post('/chat/send-message', function(req, res, next) {
    console.log("This is a send message with the message: ", req.body.message)
    socket.emit("sendMessage", "sendUserr", "receiveUserr", req.body.message)
  });
  socket.on('receiveMessage', (data) => {
    console.log(`Received message: "${data.message}" from user ${data.senderId}.`);
  });
  
})




// Receive message from server

