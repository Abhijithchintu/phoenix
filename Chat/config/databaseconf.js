const mongoose = require('mongoose')

const dbconnect = (url) => {
    return mongoose
        .connect(url)
        .then( () => console.log('connected'))
        .catch((err) => console.log(err))
}

module.exports = { dbconnect }

