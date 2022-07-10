const express = require("express");
const router = express.Router();
const chatMessagesController = require("../controller/chatMessages");
const authMiddleware = require("../middlewares/authmiddleware");

// 해당 채팅방 채팅내용 조회
router.get("/chats/messages/:roomId", authMiddleware, chatMessagesController.chatMessagesGet);

module.exports = router;