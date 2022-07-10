const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { Schema } = mongoose;

const placePostSchema = new Schema(
    {
        placePostId: { type: Number, unique: true }, // 게시글 번호
        nickname: { type: String }, // 게시글 작성자
        title: { type: String, required: true }, // 게시글 제목
        content: { type: String, required: true }, // 게시글 내용
        region: { type: String, required: true }, // 게시글 장소추천 지역
        imageUrl: { type: Array, required: true }, // 게시글 이미지
        star: { type: String, required: true }, // 게시글 별점
        bookmarkUsers: { type: Array, default: [] }, // 게시글 북마크한 사용자들
        bookmarkStatus: {type : Boolean , default : false }, // 북마크한 상태
        category: { type: Number, default: 2 }, // 게시글 카테고리
    },
    { timestamps: true } // 게시글 생성 및 수정날짜
);

placePostSchema.plugin(AutoIncrement, { inc_field: "placePostId" });

module.exports = mongoose.model("PlacePost", placePostSchema);