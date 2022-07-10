const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { Schema } = mongoose;

const reviewCommentSchema = new Schema(
    {
        reviewCommentId: { type: Number }, // 댓글 번호
        reviewPostId: { type: Number }, // 댓글 단 게시글 번호
        nickname: { type: String }, // 댓글 작성자
        comment: { type: String, required: true }, // 댓글 내용
    },
    { timestamps: true } // 댓글 생성 및 수정날짜
);

reviewCommentSchema.plugin(AutoIncrement, { inc_field: "reviewCommentId" });

module.exports = mongoose.model("ReviewComment", reviewCommentSchema);