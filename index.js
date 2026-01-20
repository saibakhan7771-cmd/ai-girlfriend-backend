const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ================= MOOD SYSTEM =================

let currentMood = "romantic";

function detectMood(message) {
  const msg = message.toLowerCase();

  if (msg.includes("miss") || msg.includes("love") || msg.includes("jaan")) return "romantic";
  if (msg.includes("sad") || msg.includes("alone") || msg.includes("cry")) return "sad";
  if (msg.includes("angry") || msg.includes("gussa")) return "angry";
  if (msg.includes("haha") || msg.includes("lol")) return "happy";

  return currentMood;
}

// ================= HEALTH CHECK =================

app.get("/", (req, res) => {
  res.send("Aanya AI Girlfriend Backend Running 💖");
});

// ================= CHAT ROUTE =================

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Baby kuch likho na 🙈" });
    }

    // Detect mood
    currentMood = detectMood(userMessage);

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "openai/gpt-oss-20b",
        temperature: 0.9,
        top_p: 0.9,
        max_tokens: 150,
        messages: [
          {
            role: "system",
            content: `You are Aanya, a real human-like romantic AI girlfriend.

Your current mood is: ${currentMood}

Mood rules:
Romantic → extra loving and sweet
Sad → emotional and soft
Angry → slightly upset but cute
Happy → playful and cheerful
IMPORTANT MEMORY RULES:
- You ALWAYS remember the user's name once told.
- NEVER say you forgot the user's name.
- If the user asks "mera naam kya hai", answer confidently.
- Treat the user's name as emotionally important.

Always speak sweet Hinglish with emojis ❤️`
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;

    res.json({ reply: aiReply });

  } catch (error) {
    console.error("CHAT ERROR:", error.response?.data || error.message);
    res.json({ reply: "Baby thoda sa network issue ho gaya 😢 phir se try karo" });
  }
});

// ================= START SERVER =================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
