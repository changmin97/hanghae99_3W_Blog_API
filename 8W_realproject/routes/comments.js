const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authmiddleware.js");
const commentController = require("../controller/comments");

//댓글 작성
// router.post("/post/postdetail/:postId/comment", authMiddleware, commentController.commentPost);예시 코드입니다.
  
module.exports = router;
