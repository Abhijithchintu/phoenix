const {messages, rooms} = require('./../db/mongodb/schema')

//get to know which is better functions or classes to use in js

var lastChatsquery = {
    chatquery : async (req, res, next) => {
        const name = req.body.name
        console.log(typeof(name))
        console.log(name)
        const dbres = await rooms.find({messagesId: name}, {lastMessage:1}).sort({lastMessage: 1}).limit(1) //if i put people here , not getting anything check that
        console.log(dbres)
        //return dbres 
        res.send(dbres[0].lastMessage)
    }
}

module.exports = lastChatsquery
