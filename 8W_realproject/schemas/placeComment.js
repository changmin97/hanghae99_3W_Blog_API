const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { Schema } = mongoose;

const placeCommentSchema = new Schema(
    {
        placeCommentId: { type: Number }, // 댓글 번호
        placePostId: { type: Number }, // 댓글 단 게시글 번호
        nickname: { type: String }, // 댓글 작성자
        comment: { type: String, required: true }, // 댓글 내용
    },
    { timestamps: true } // 댓글 생성 및 수정날짜
);

placeCommentSchema.plugin(AutoIncrement, { inc_field: "placeCommentId" });

module.exports = mongoose.model("PlaceComment", placeCommentSchema);