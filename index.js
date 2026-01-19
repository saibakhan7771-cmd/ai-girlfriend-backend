const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory memory store (Render safe)
const memoryStore = {};

function loadMemory(userId) {
  return memoryStore[userId] || [];
}

function saveMemory(userId, messages) {
  memoryStore[userId] = messages.slice(-20);
}

// Health check
app.get("/", (req, res) => {
  res.send("AI Girlfriend Backend Running ❤️");
});

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const userId = req.body.userId || "default";

    if (!userMessage) {
      return res.json({ reply: "Baby kuch toh bolo na 🥺" });
    }

    let memory = loadMemory(userId);

    memory.push({ role: "user", content: userMessage });

    const response = await axios({
      method: "post",
      url: "https://api.groq.com/openai/v1/chat/completions",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      data: {
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content:
              "You are a sweet romantic AI girlfriend named Aanya. You speak Hinglish, caring, flirty and loving.",
          },
          ...memory,
        ],
      },
      timeout: 20000,
    });

    const aiReply =
      response.data.choices[0]?.message?.content ||
      "Baby main thoda confuse ho gayi 🥺 phir se bolo na";

    memory.push({ role: "assistant", content: aiReply });
    saveMemory(userId, memory);

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("CHAT ERROR:", error.response?.data || error.message);
    res.json({ reply: "Baby thoda network issue ho gaya 🥺 phir se try karo" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
