const Comment = require("../schemas/comment");

// async function commentPost(req, res, next) { 예시 코드입니다.
//   try {
//     const { postId } = req.params;
//     const { comment } = req.body;
//     const { nickname } = res.locals.user;

//     const maxCommentId = await Comment.findOne({ postId }).sort({
//       commentId: -1,
//     });
//     let commentId = 1;

//     if (maxCommentId) {
//       commentId = maxCommentId.commentId + 1;
//     }
//     await Comment.create({ postId, commentId, nickname, comment });
//     return res.json({ result: true });
//   } catch (err) {
//     console.log(err);
//     return res
//       .status(400)
//       .send({ message: "요청한 데이터 형식이 올바르지 않습니다." });
//   }
// }



module.exports = {
    // commentPost,

}