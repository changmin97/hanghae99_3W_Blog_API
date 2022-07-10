const express = require("express");
const router = express.Router();
const reviewPostsController = require("../controller/reviewPosts");
const authMiddleware = require("../middlewares/authmiddleware");

// 육아용품 리뷰 게시글 작성
router.post("/reviews", authMiddleware, reviewPostsController.reviewPosts);

// 육아용품 리뷰 게시글 전체조회
router.get("/reviews", reviewPostsController.reviewAllGet);

// 육아용품 리뷰 게시글 상세조회
router.get("/reviews/:reviewPostId", reviewPostsController.reviewGet);

// 육아용품 리뷰 게시글 수정
router.put("/reviews/:reviewPostId", authMiddleware, reviewPostsController.reviewUpdate);

// 육아용품 리뷰 게시글 삭제
router.delete("/reviews/:reviewPostId", authMiddleware, reviewPostsController.reviewDelete);

// 육아용품 리뷰 게시글 북마크 표시/해제
router.put("/reviews/bookmark/:reviewPostId", authMiddleware, reviewPostsController.reviewBookmark);

module.exports = router;