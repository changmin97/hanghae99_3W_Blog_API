const express = require("express");
const router = express.Router();
const recruitCommentsController = require("../controller/recruitComments");
const authMiddleware = require("../middlewares/authmiddleware");

// 모집 댓글 등록
router.post("/recruits/:recruitPostId/comments",authMiddleware, recruitCommentsController.recruitComments);

// 모집 댓글 삭제
router.delete("/recruits/:recruitPostId/comments/:recruitCommentId",authMiddleware, recruitCommentsController.recruitCommentsDelete);

module.exports = router;