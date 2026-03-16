const { Prisma } = require("@prisma/client");

const { buildChatReply, buildTranscription } = require("../services/chatService");
const {
  appendConversationTurn,
  createConversationWithSeed,
  findConversationHistory,
} = require("../services/conversationService");
const { findProfileById } = require("../services/profileService");
const { badRequestError, notFoundError } = require("../utils/httpErrors");

async function sendMessage(request, response, next) {
  try {
    const { message, profile, conversationHistory, conversationId } = request.body || {};

    validateRequiredString("message", message);
    validateProfile(profile);

    if (!Array.isArray(conversationHistory)) {
      throw badRequestError("Missing required field: conversationHistory");
    }

    const persistedProfile = await findPersistedProfile(profile.id);
    let activeConversation = null;

    if (conversationId) {
      activeConversation = await findConversationHistory(conversationId);

      if (!activeConversation) {
        throw notFoundError("Conversation not found");
      }

      if (activeConversation.profileId !== persistedProfile.id) {
        throw badRequestError("Conversation does not belong to the provided profile");
      }
    }

    const result = await buildChatReply({
      message,
      profile: persistedProfile,
      conversationHistory: activeConversation ? activeConversation.messages : conversationHistory,
    });

    if (!activeConversation) {
      activeConversation = await createConversationWithSeed(persistedProfile.id, conversationHistory);
    }

    const savedConversation = await appendConversationTurn(
      activeConversation.id,
      message.trim(),
      result.message
    );

    response.status(200).json({
      success: true,
      message: result.message,
      usage: result.usage,
      conversationId: savedConversation.id,
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return next(badRequestError("Database is unavailable. Configure DATABASE_URL and run Prisma migrations."));
    }

    next(error);
  }
}

async function getConversationHistory(request, response, next) {
  try {
    validateRequiredString("conversationId", request.params.conversationId);

    const conversation = await findConversationHistory(request.params.conversationId);

    if (!conversation) {
      throw notFoundError("Conversation not found");
    }

    response.status(200).json({
      conversationId: conversation.id,
      profileId: conversation.profileId,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messages: conversation.messages,
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return next(badRequestError("Database is unavailable. Configure DATABASE_URL and run Prisma migrations."));
    }

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

  validateRequiredString("profile.id", String(profile.id || ""));

  ["name", "area", "role", "level", "goals"].forEach((field) => {
    validateRequiredString(`profile.${field}`, profile[field]);
  });
}

function validateRequiredString(field, value) {
  if (typeof value !== "string" || value.trim() === "") {
    throw badRequestError(`Missing required field: ${field}`);
  }
}

async function findPersistedProfile(profileId) {
  const profile = await findProfileById(String(profileId));

  if (!profile) {
    throw notFoundError("Profile not found");
  }

  return profile;
}

function isDatabaseUnavailableError(error) {
  return (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientKnownRequestError
  );
}

module.exports = {
  getConversationHistory,
  sendMessage,
  transcribeAudio,
};
