const mongoose = require("mongoose");

const { Schema } = mongoose;
const UserSchema = new Schema({
    email: { type: String, required: true },
    nickname: { type: String, required: true },
    password: { type: String, required: true },
    myComment: { type: String },
    profileUrl: { type: String },
    refreshToken: { type: String },
    snsId: { type: String },
    provider: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
