const express = require("express");

const { getConversationHistory, sendMessage, transcribeAudio } = require("../controllers/chatController");

const chatRouter = express.Router();

chatRouter.post("/message", sendMessage);
chatRouter.get("/history/:conversationId", getConversationHistory);
chatRouter.post("/transcribe", transcribeAudio);

module.exports = {
  chatRouter,
};
