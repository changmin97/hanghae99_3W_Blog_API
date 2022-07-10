const express = require("express");
const router = express.Router();
const reviewCommentsController = require("../controller/reviewComments.js");
const authMiddleware = require("../middlewares/authmiddleware");

// 육아용품 리뷰 댓글 등록
router.post("/reviews/:reviewPostId/comments"
             ,authMiddleware, reviewCommentsController.reviewComments);

// 육아용품 리뷰 댓글 삭제
router.delete("/reviews/:reviewPostId/comments/:reviewCommentId"
              ,authMiddleware, reviewCommentsController.reviewCommentsDelete);

module.exports = router;