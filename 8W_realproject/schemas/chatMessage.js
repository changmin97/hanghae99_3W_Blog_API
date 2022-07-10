const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatMessageSchema = new Schema(
    {
        roomId: { type: String },
        senderNick: { type: String },
        message: { type: String },
        // checkChat: { type: Boolean } // 채팅 읽지 않은 개수 표시해주기 위함
    },
    { timestamps: true }
);

module.exports = mongoose.model("chatMessage", chatMessageSchema);