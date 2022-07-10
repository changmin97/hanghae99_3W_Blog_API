require("dotenv").config();
const express = require("express");
const passport = require('passport');
const router = express.Router();
const userController = require("../controller/users")
const { isLoggedIn, isNotLoggedIn } = require('./middlewares') // 인증미들웨어2(미들웨어1 작동 안되면 이거쓰기)
const authmiddleware = require('../middlewares/authmiddleware')
// 회원가입
router.post("/signup", userController.signup)  //auth미들웨어 붙이기

router.post("/signin", userController.signin) //auth미들웨어 붙이기

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/api/main',
}), (req, res) => {
  res.redirect('/api/main');
});

module.exports = router;
