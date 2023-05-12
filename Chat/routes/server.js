var express = require('express');
var router = express.Router();
const {Server} = require("socket.io");

/* GET home page. */

const httpServer = require("http").createServer(router);



const io = new Server(httpServer, {
  cors:{
    origin:['http://localhost:8080','http://localhost:3004','http://localhost:3002']
  }
});

let clients = {};

io.on('connection', (socket) => {
  console.log(`User ${socket.id} has connected.`);

  // Handle user connection
  socket.on('userConnect', (userId) => {
    clients[userId] = socket.id;
    console.log(`User ${userId} connected.`);
  });

  // Handle message sent by user
  socket.on('sendMessage', (sender, receiver, messag) => {
    const userId = receiver;
    const message = messag;
    const senderId = sender;

    // If recipient is connected, send message to them
    if (userId in clients) {
      io.to(clients[userId]).emit('receiveMessage', {message: message, senderId:senderId});
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    for (let userId in clients) {
      if (clients[userId] === socket.id) {
        delete clients[userId];
        console.log(`User ${userId} disconnected.`);
        break;
      }
    }
    console.log("User is disconnected");
  });
});




const io2 = require('socket.io-client').io;

const socket = io2('http://localhost:3004')


async function init() {
  await httpServer.listen(3004, ()=> {console.log("socket server started")});
  console.log("this is a test line");
  socket.on("connect", ()=>{
    console.log("client starting")
    console.log(`you are connected with id : ${socket.id}`);
    socket.emit('userConnect', userId);
    // router.post('/chat/send-message', function(req, res, next) {
    //   console.log("This is a send message with the message: ", req.body.message)
    //   socket.emit("sendMessage", "sendUserr", "receiveUserr", req.body.message)
    // });
    socket.on('receiveMessage', (data) => {
      console.log(`Received message: "${data.message}" from user ${data.senderId}.`);
    });

  })
}

init();
// Receive message from server





module.exports = router;