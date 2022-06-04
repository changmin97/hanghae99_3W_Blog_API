const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema({
    listId:{
        type: Number,
        required:true
    },
    commentId: {
        type: Number,
        required:true
    },
    nickname: {
        type: String,
        required:true
    },
    content: {
        type: String,
        required:true
    },
    
    createAt: {
        type: Date,
        required:true
      }
})

module.exports = mongoose.model("Comment", commentSchema )

