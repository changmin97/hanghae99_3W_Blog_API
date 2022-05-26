const mongoose = require('mongoose')
const listSchema = new mongoose.Schema({
    listId: {
        type: Number,
        require: true,
        unique: true,
    },
    title: {
        type: String,
    },
    name: {
        type: String,
    },
    content: {
        type: String,
    },
    password: {
        type: Number,
        required: true,
    },
    createAt: {
        type: Date
      }
})

module.exports = mongoose.model("List", listSchema )

// db.lists.insert(
// {
//     "listId" : 4,
//     "title": "아자아자",
//     "name": "이창민",
//     "content": "로론애ㅔㅑ러",
//     "password": 331   
// }