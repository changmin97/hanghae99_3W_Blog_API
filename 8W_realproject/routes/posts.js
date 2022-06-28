const express = require("express");
const router = express.Router();
const postController = require("../controller/posts")
const authMiddleware = require("../middlewares/authmiddleware");

// 메인페이지
// router.get("/main", postController.main) 예시코드입니다.


module.exports = router;