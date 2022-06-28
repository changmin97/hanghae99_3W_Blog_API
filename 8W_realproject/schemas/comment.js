const mongoose = require("mongoose");

const { Schema } = mongoose;
  const commentSchema = new Schema({
    // postId: {type: Number},
    // nickname : {type: String}, 예시코드입니다.
});

module.exports = mongoose.model("Comment", commentSchema);