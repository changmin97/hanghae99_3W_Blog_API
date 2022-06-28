require("dotenv").config();
const express = require("express");
const router = express.Router();
const userController = require("../controller/users")

// 회원가입
// router.post("/signup", userController.signup) 예시코드입니다.


module.exports = router;
