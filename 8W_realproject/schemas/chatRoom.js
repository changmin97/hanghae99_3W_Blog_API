const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { Schema } = mongoose;

const chatRoomSchema = new Schema(
    {
        roomId: { type: Number, unique: true},
        recruitPostId: { type: Number },
        nickname: { type: String },
        postNickname: { type: String },
        postTitle: { type: String },
        createdAt: { type: String }
        // lastChat: { type: String }
    },
    // { timestamps: true }
);

chatRoomSchema.plugin(AutoIncrement, { inc_field: "roomId" });

module.exports = mongoose.model("chatRoom", chatRoomSchema);