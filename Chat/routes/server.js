var express = require('express');
var router = express.Router();
const {Server} = require("socket.io");

/* GET home page. */

const httpServer = require("http").createServer(router);



const io = new Server(httpServer, {
  cors:{
    origin:['http:/localhost:8080','http:/localhost:3004']
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

httpServer.listen(3004);

module.exports = router;