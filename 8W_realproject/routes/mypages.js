const express = require("express");
const router = express.Router();
const mypagesController = require("../controller/mypages");
const authMiddleware = require("../middlewares/authmiddleware");

// 프로필 조회
router.get("/mypage", authMiddleware, mypagesController.profileGet);

// 북마크 게시글 조회
router.get("/mypage/bookmark", authMiddleware, mypagesController.bookmark);

// 프로필 수정
router.put("/mypage/update", authMiddleware, mypagesController.profileUpdate);

module.exports = router;