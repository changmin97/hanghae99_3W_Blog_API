const express = require("express");
const router = express.Router();
const recruitPostsController = require("../controller/recruitPosts");
const authMiddleware = require("../middlewares/authmiddleware");

// 모집 게시글 작성
router.post("/recruits", authMiddleware, recruitPostsController.recruitPosts);

// 모집 게시글 전체조회
router.get("/recruits", recruitPostsController.recruitAllGet);

// 모집 게시글 상세조회
router.get("/recruits/:recruitPostId", recruitPostsController.recruitGet);

// 모집 게시글 수정
router.put("/recruits/:recruitPostId", authMiddleware, recruitPostsController.recruitUpdate);

// 모집 게시글 삭제
router.delete("/recruits/:recruitPostId", authMiddleware, recruitPostsController.recruitDelete);

// 모집 게시글 북마크 표시/해제
router.put("/recruits/bookmark/:recruitPostId", authMiddleware, recruitPostsController.recruitBookmark);

module.exports = router;