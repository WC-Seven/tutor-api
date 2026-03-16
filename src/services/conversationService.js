const { prisma } = require("../lib/prisma");
const { sanitizeConversationHistory } = require("./chatService");

async function findConversationHistory(conversationId) {
  if (typeof conversationId !== "string" || conversationId.trim() === "") {
    return null;
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId.trim() },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return conversation ? serializeConversation(conversation) : null;
}

async function createConversationWithSeed(profileId, conversationHistory) {
  const sanitizedHistory = sanitizeConversationHistory(conversationHistory);

  const conversation = await prisma.conversation.create({
    data: {
      profileId,
      ...(sanitizedHistory.length > 0
        ? {
            messages: {
              create: sanitizedHistory.map((message) => ({
                role: message.role,
                content: message.content,
              })),
            },
          }
        : {}),
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return serializeConversation(conversation);
}

async function appendConversationTurn(conversationId, userMessage, assistantMessage) {
  const updatedConversation = await prisma.$transaction(async (transaction) => {
    await transaction.message.createMany({
      data: [
        {
          conversationId,
          role: "user",
          content: userMessage,
        },
        {
          conversationId,
          role: "assistant",
          content: assistantMessage,
        },
      ],
    });

    return transaction.conversation.update({
      where: { id: conversationId },
      data: {
        updatedAt: new Date(),
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  });

  return serializeConversation(updatedConversation);
}

function serializeConversation(conversation) {
  return {
    id: conversation.id,
    profileId: Number(conversation.profileId),
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
    messages: conversation.messages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      timestamp: message.createdAt.toISOString(),
    })),
  };
}

module.exports = {
  appendConversationTurn,
  createConversationWithSeed,
  findConversationHistory,
};
