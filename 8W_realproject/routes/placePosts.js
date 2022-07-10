const express = require("express");
const router = express.Router();
const placePostsController = require("../controller/placePosts");
const authMiddleware = require("../middlewares/authmiddleware");

// 장소추천 게시글 작성
router.post("/places", authMiddleware, placePostsController.placePosts);

// 장소추천 게시글 전체조회
router.get("/places", placePostsController.placeAllGet);

// 장소추천 게시글 상세조회
router.get("/places/:placePostId", placePostsController.placeGet);

// 장소추천 게시글 수정
router.put("/places/:placePostId", authMiddleware, placePostsController.placeUpdate);

// 장소추천 게시글 삭제
router.delete("/places/:placePostId", authMiddleware, placePostsController.placeDelete);

// 장소추천 게시글 북마크 표시/해제
router.put("/places/bookmark/:placePostId", authMiddleware, placePostsController.placeBookmark);

module.exports = router;