const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    id: Number,
    sender_id: {
        type: String
    },
    message: String,
    timeStamp: Date
})

const roomSchema = new mongoose.Schema({
    id: Number,
    messagesId: Number,
    people: Array,
    lastMessageTime: Date,
    lastMessage: String
})

module.exports = {messages: mongoose.model('Messages', messageSchema), rooms: mongoose.model('rooms', roomSchema)}