const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    client_id: Number,
    user_name: String,
    sender_name: String,
    receiver_name: String,
    message: String,
    date: Date,
})

module.exports = mongoose.model('Messages', messageSchema)