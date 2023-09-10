const {messages, rooms} = require('./../db/mongodb/schema')

let lastMessage = {
    getMessages: async (req, res, next) => {
        const senderName = req.body.senderName
        const recieverName = req.body.recieverName
        const id = await rooms.find({people: [senderName, recieverName]}, {messagesId : 1}).limit(1)
        const prevmessages = await messages.find({messageId: id.messageId}, {message: 1}).sort({messageTime: -1}).limit(10)
        res.send({prevmessages}) //see which is best for sending
    }
}

module.exports = lastMessage