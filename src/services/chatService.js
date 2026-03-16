const axios = require("axios");

const { internalServerError } = require("../utils/httpErrors");

const groqApiUrl = "https://api.groq.com/openai/v1";

async function buildChatReply({ message, profile, conversationHistory }) {
  if (!process.env.GROQ_API_KEY) {
    return buildFallbackChatReply({ message, profile });
  }

  try {
    const messages = [
      {
        role: "system",
        content: buildSystemPrompt(profile),
      },
      ...sanitizeConversationHistory(conversationHistory),
      {
        role: "user",
        content: message,
      },
    ];

    const { data } = await axios.post(
      `${groqApiUrl}/chat/completions`,
      {
        model: process.env.GROQ_CHAT_MODEL || "mixtral-8x7b-32768",
        temperature: 0.7,
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || content.trim() === "") {
      throw new Error("Invalid Groq chat response");
    }

    return {
      message: content.trim(),
      usage: data?.usage || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };
  } catch (error) {
    throw internalServerError("Internal server error", getErrorDetails(error));
  }
}

async function buildTranscription(audioBase64) {
  if (!process.env.GROQ_API_KEY) {
    return {
      transcription: "Audio transcription is unavailable because GROQ_API_KEY is not configured.",
      confidence: 0,
      duration: 0,
    };
  }

  try {
    const formData = new FormData();
    const audioBuffer = Buffer.from(audioBase64, "base64");
    const audioBlob = new Blob([audioBuffer], { type: "audio/wav" });

    formData.append("file", audioBlob, "recording.wav");
    formData.append("model", process.env.GROQ_TRANSCRIBE_MODEL || "whisper-large-v3");
    formData.append("response_format", "verbose_json");

    const response = await fetch(`${groqApiUrl}/audio/transcriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(details || "Groq transcription request failed");
    }

    const data = await response.json();

    return {
      transcription: typeof data?.text === "string" ? data.text : "",
      confidence: typeof data?.confidence === "number" ? data.confidence : 0,
      duration: typeof data?.duration === "number" ? data.duration : 0,
    };
  } catch (error) {
    throw internalServerError("Internal server error", getErrorDetails(error));
  }
}

function buildSystemPrompt(profile) {
  return [
    "You are an English conversation tutor focused on real professional scenarios.",
    `Student name: ${profile.name}.`,
    `Area: ${profile.area}.`,
    `Role: ${profile.role}.`,
    `English level: ${profile.level}.`,
    `Goals: ${profile.goals}.`,
    "Reply in English with concise guidance, realistic follow-up questions, and natural phrasing corrections when useful.",
  ].join(" ");
}

function sanitizeConversationHistory(conversationHistory) {
  return conversationHistory
    .filter((item) => item && (item.role === "user" || item.role === "assistant"))
    .map((item) => ({
      role: item.role,
      content: String(item.content || ""),
    }))
    .filter((item) => item.content.trim() !== "");
}

function buildFallbackChatReply({ message, profile }) {
  const normalizedMessage = message.trim();
  const roleLabel = profile.role || profile.area;
  const intro = `Let's practice English for your ${roleLabel} context.`;
  const coaching = `You said: "${normalizedMessage}". A more natural version could be: "${normalizedMessage}" if that already sounds natural, or we can refine it together.`;
  const followUp = `Now answer this: how would you explain your experience as a ${profile.role} in two or three sentences?`;

  return {
    message: `${intro} ${coaching} ${followUp}`,
    usage: {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    },
  };
}

function getErrorDetails(error) {
  return error.response?.data || error.message || "Unknown error";
}

module.exports = {
  buildChatReply,
  buildTranscription,
};
