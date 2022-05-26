const mongoose = require('mongoose')

const connect = () => {
    mongoose.connect('mongodb+srv://test:sparta@cluster0.bf4q6.mongodb.net/?retryWrites=true&w=majority',{ dbName : "blogAPI" ,ignoreUndefined : true }).catch((err)=>{
        console.error(err)
    })
}

module.exports = connect