const { buildChatReply, buildTranscription } = require("../services/chatService");
const { badRequestError } = require("../utils/httpErrors");

async function sendMessage(request, response, next) {
  try {
    const { message, profile, conversationHistory } = request.body || {};

    validateRequiredString("message", message);
    validateProfile(profile);

    if (!Array.isArray(conversationHistory)) {
      throw badRequestError("Missing required field: conversationHistory");
    }

    const result = await buildChatReply({
      message,
      profile,
      conversationHistory,
    });

    response.status(200).json({
      success: true,
      message: result.message,
      usage: result.usage,
    });
  } catch (error) {
    next(error);
  }
}

async function transcribeAudio(request, response, next) {
  try {
    const { audioBase64 } = request.body || {};
    validateRequiredString("audioBase64", audioBase64);

    const result = await buildTranscription(audioBase64);

    response.status(200).json({
      success: true,
      transcription: result.transcription,
      confidence: result.confidence,
      duration: result.duration,
    });
  } catch (error) {
    next(error);
  }
}

function validateProfile(profile) {
  if (!profile || typeof profile !== "object") {
    throw badRequestError("Missing required field: profile");
  }

  ["name", "area", "role", "level", "goals"].forEach((field) => {
    validateRequiredString(`profile.${field}`, profile[field]);
  });
}

function validateRequiredString(field, value) {
  if (typeof value !== "string" || value.trim() === "") {
    throw badRequestError(`Missing required field: ${field}`);
  }
}

module.exports = {
  sendMessage,
  transcribeAudio,
};
