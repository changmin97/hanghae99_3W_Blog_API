const mongoose = require("mongoose")


const { Schema } = mongoose; 
const postSchema = new Schema({
     // postId: { type: Number, required: true, }, 
     // title: { type: String, required: true },  예시코드입니다.

});

module.exports = mongoose.model("Post", postSchema);