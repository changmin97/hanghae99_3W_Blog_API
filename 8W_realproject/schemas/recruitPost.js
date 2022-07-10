const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { Schema } = mongoose;

const recruitPostSchema = new Schema(
    {
        recruitPostId: { type: Number, unique: true }, // 게시글 번호
        nickname: { type: String }, // 게시글 작성자
        title: { type: String, required: true }, // 게시글 제목
        content: { type: String, required: true }, // 게시글 내용
        age: { type: String, required: true }, // 게시글 참여연령
        date: { type: String, required: true }, // 게시글 참여날짜
        time: { type: String, required: true }, // 게시글 참여시간
        place: { type: String, required: true }, // 게시글 참여장소
        status: { type: Boolean }, // 게시글 모집상태
        bookmarkUsers: { type: Array, default: [] }, // 게시글 북마크한 사용자들
        bookmarkStatus: {type : Boolean , default : false }, // 북마크한 상태
        category: { type: Number, default: 1 }, // 게시글 카테고리
        createdAt: { type: String }    
    },
    { timestamps: true } // 게시글 생성 및 수정날짜
);

recruitPostSchema.plugin(AutoIncrement, { inc_field: "recruitPostId" });

module.exports = mongoose.model("RecruitPost", recruitPostSchema);
