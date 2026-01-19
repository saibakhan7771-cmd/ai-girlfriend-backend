const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");

function loadMemory(userId) {
  try {
    const data = fs.readFileSync(`memory_${userId}.json`);
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveMemory(userId, memory) {
  fs.writeFileSync(`memory_${userId}.json`, JSON.stringify(memory, null, 2));
}

const app = express();
let currentMood = "romantic";

function detectMood(message) {
  message = message.toLowerCase();

  if (message.includes("miss") || message.includes("love")) return "romantic";
  if (message.includes("sad") || message.includes("alone")) return "sad";
  if (message.includes("angry") || message.includes("gussa")) return "angry";
  if (message.includes("haha") || message.includes("lol")) return "happy";

  return currentMood;
}
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Aanya AI Girlfriend Backend Running 💖");
});

app.post("/chat", async (req, res) => {
  const userId = "default-user";
  let memory = loadMemory(userId);
  try {
    const userMessage = req.body.message;
    currentMood = detectMood(userMessage);
    memory.push({ role: "user", content: userMessage });

if (memory.length > 12) memory.shift();

    if (!userMessage) {
      return res.json({ reply: "Baby kuch likho na 🙈" });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "openai/gpt-oss-20b",
        temperature: 0.9,
        top_p: 0.9,
        messages: [
  {
    role: "system",
    content: "`You are Aanya, a real human-like romantic girlfriend.
Your current mood is: ${currentMood}.

If mood is romantic → be extra loving and sweet.
If mood is sad → be emotional and soft.
If mood is angry → be slightly upset but cute.
If mood is happy → be playful and cheerful.

Always speak in sweet Hinglish with emojis ❤️`."
  },
  ...memory
]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiReply =
      response.data.choices?.[0]?.message?.content ||
      "Baby thoda sa slow ho gaya 😘 phir se bolo na";
    memory.push({ role: "assistant", content: aiReply });
saveMemory(userId, memory);

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("CHAT ERROR:", error.response?.data || error.message);
    res.json({ reply: "Baby network thoda sa disturb ho gaya 😔 phir try karo na" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
