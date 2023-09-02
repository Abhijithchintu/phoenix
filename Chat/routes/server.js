var express = require('express');
var app = express();
var router = express.Router();
const path = require('path');
// /* GET home page. */
const port = process.env.PORT1 || 3000;

const http = require('http').Server(app);

const io = require('socket.io')(http);

app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname,'/src/index.html'))
})


io.on('connection', socket =>{
  console.log(`User ${socket.id}  is connected` );

  socket.on('disconnect',()=>{
    console.log(`User ${socket.id} is disconnected`);
  })

  socket.on('sendMessage', message=>{
    console.log("message from the clietn, displaying in server side: " + message);
  })

  socket.emit('server', "Received from server");
})


http.listen(port, ()=>{
  console.log(`server is listening to port ${port}`);
});



// const io = new Server(3002, {
//   cors:{
//     origin:['http:/localhost:8080','http:/localhost:3002', 'http:/localhost:3004']
//   }
// });


// let clients = {};

// function initializer(){
//     io.on('connection', (socket) => {
//         console.log(`User ${socket.id} has connected.`);

//         // Handle user connection
//         socket.on('userConnect', (userId) => {
//         clients[userId] = socket.id;
//         console.log(`User ${userId} connected.`);
//         });

//         // Handle message sent by user
//         socket.on('sendMessage', (sender, receiver, messag) => {
//         const userId = receiver;
//         const message = messag;
//         const senderId = sender;

//         // If recipient is connected, send message to them
//         if (userId in clients) {
//             io.to(clients[userId]).emit('receiveMessage', {message: message, senderId:senderId});
//         }
//         });

//         // Handle user disconnection
//         socket.on('disconnect', () => {
//             for (let userId in clients) {
//                 if (clients[userId] === socket.id) {
//                 delete clients[userId];
//                 console.log(`User ${userId} disconnected.`);
//                 break;
//                 }
//             }
//             console.log("User is disconnected");
//         });
//     });
// }

// initializer();
// const io2 = require('socket.io-client').io;

// const socket = io2('https://localhost:3002')


// console.log("this is a test line");

// socket.on("connect", ()=>{
//   console.log(`you are connected with id : ${socket.id}`);
//   socket.emit('userConnect', userId);
//   console.log("This is a send message with the message: ", req.body.message)
//   socket.emit("sendMessage", "sendUserr", "receiveUserr", req.body.message)
//   socket.on('receiveMessage', (data) => {
//     console.log(`Received message: "${data.message}" from user ${data.senderId}.`);
//   });
  
// })
