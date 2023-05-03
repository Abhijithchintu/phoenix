var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/chat', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

const httpServer = require("http").createServer(router);
import { Server } from "socket.io";


const io = new Server(httpServer, {
  // ...
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
  socket.on('sendMessage', (data) => {
    const userId = data.toUserId;
    const message = data.message;
    const senderId = data.fromUserId;

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
  });
});

httpServer.listen(3002);