const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { Schema } = mongoose;

const reviewPostSchema = new Schema(
    {
        reviewPostId: { type: Number, unique: true }, // 게시글 번호
        nickname: { type: String }, // 게시글 작성자
        title: { type: String, required: true }, // 게시글 제목
        content: { type: String, required: true }, // 게시글 내용
        url: { type: String }, // 게시글 구매 주소
        productType: { type: String, required: true }, // 게시글 구매용품 종류
        imageUrl: { type: Array, required: true }, // 게시글 이미지
        bookmarkUsers: { type: Array, default: [] }, // 게시글 북마크한 사용자들
        bookmarkStatus: {type : Boolean , default : false }, // 북마크한 상태
        category: { type: Number, default: 3 }, // 게시글 카테고리
    },
    { timestamps: true } // 게시글 생성 및 수정날짜
);

reviewPostSchema.plugin(AutoIncrement, { inc_field: "reviewPostId" });

module.exports = mongoose.model("ReviewPost", reviewPostSchema);