const mongoose = require('mongoose')
const listSchema = new mongoose.Schema({
    listId: {
        type: Number,
        unique: true,
        require:true,
    },
    title: {
        type: String,
        require:true,
    },
    nickname: {
        type: String,
        require:true,
    },
    content: {
        type: String,
        require:true,
    },
    createAt: {
        type: Date,
        require:true,
    },

})
//listId,title,content만 적으면 자동으로 nickname,createAt들어가게할거
module.exports = mongoose.model("List", listSchema )