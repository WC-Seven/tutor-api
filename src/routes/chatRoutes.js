const express = require("express");

const { sendMessage, transcribeAudio } = require("../controllers/chatController");

const chatRouter = express.Router();

chatRouter.post("/message", sendMessage);
chatRouter.post("/transcribe", transcribeAudio);

module.exports = {
  chatRouter,
};
