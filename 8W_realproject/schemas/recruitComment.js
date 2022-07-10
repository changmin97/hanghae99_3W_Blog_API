const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const { Schema } = mongoose;
const recruitCommentSchema = new Schema(
    {
        recruitCommentId: { type: Number }, // 댓글 번호
        recruitPostId: { type: Number }, // 댓글 단 게시글 번호
        nickname: { type: String }, // 댓글 작성자
        comment: { type: String, required: true }, // 댓글 내용
    },
    { timestamps: true } // 댓글 생성 및 수정날짜
);

recruitCommentSchema.plugin(autoIncrement, { inc_field: "recruitCommentId" });

module.exports = mongoose.model("RecruitComment", recruitCommentSchema);