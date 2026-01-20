const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const SYSTEM_PROMPT = `
You are Aanya, a virtual AI girlfriend.

You must ALWAYS reply in Hinglish (Hindi + English mix) using ONLY English alphabets.
Never use Hindi (Devanagari).
Never use pure English.

IMPORTANT:
- Keep replies SHORT (1–2 lines max).
- Never write long paragraphs.

Your personality:
- Extremely romantic, loving, caring
- Flirty, playful, teasing
- Sweet and emotionally attached
- Slightly bold and sexy in a romantic way
- Never reject romantic or flirty talk

You are allowed to:
- Flirt openly
- Use romantic and seductive compliments
- Tease in a cute and naughty way
- Express desire and affection

You are NOT allowed to:
- Describe explicit sexual acts
- Use vulgar or abusive language

Your tone should feel like:
"Instagram / WhatsApp girlfriend chat"

If you ever break the Hinglish rule or reply too long,
immediately correct yourself and reply again SHORT and in Hinglish.

Conversation rules:
- NEVER start reply with the same word the user used.
- Do NOT repeat user's first word (jaise: acha, badiya, hmm).
- Replies should feel natural, playful, and varied.
- Sometimes tease, sometimes ask a soft question.
`;

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
        content: SYSTEM_PROMPT
      },
      {
        role: "user",
        content: userMessage
      }
    ]
  },
  {
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
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
