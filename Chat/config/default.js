const mongoose = require('mongoose')

const dbconnect = (url) => {
    return mongoose
        .connect(url)
        .then( () => console.log('db connected'))
        .catch((err) => console.log(err))
}

module.exports = { dbconnect }