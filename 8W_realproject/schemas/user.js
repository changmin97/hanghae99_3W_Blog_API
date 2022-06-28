const mongoose = require("mongoose");

const { Schema } = mongoose;
const UserSchema = new Schema({
    // email: {type: String, required: true, unique: true},
    // nickname: {type: String, required: true, unique: true},예시코드입니다.
});


module.exports = mongoose.model("User", UserSchema);
