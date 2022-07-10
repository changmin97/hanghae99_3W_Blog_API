const express = require("express");
const router = express.Router();
const mainsController = require("../controller/mains");

// 메인 페이지 조회
router.get("/main", mainsController.mainPostGet);

module.exports = router;