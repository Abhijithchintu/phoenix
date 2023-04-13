const socket = io.connect();

// Identify self to server
socket.emit('userConnect', userId);

// Send message to another user
socket.emit('sendMessage', {toUserId: receiverUserId, message: 'Hello!', fromUserId: myUserId});

// Receive message from server
socket.on('receiveMessage', (data) => {
  console.log(`Received message: "${data.message}" from user ${data.senderId}.`);
});
