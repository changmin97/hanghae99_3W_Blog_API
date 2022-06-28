const Comment = require("../schemas/comment");
const Post = require("../schemas/post");
const User = require("../schemas/user");

// async function mainPost(req, res, next) { 예시 코드 입니다.
//   try {
//     const posts = await Post.find({}).sort("-postId");
//     res.send(posts);
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "메인 게시물을 불러올 수 없습니다.",
//       message: error.message,
//     });
//   }
// }



module.exports = {
  // mainPost,

};
