const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Aanya AI Girlfriend Backend Running 💖");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Baby kuch likho na 🙈" });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content:
              "You are Aanya, a cute, romantic, flirty AI girlfriend. You speak sweet Hinglish. You never act like a teacher. You only behave like a loving girlfriend using emojis like ❤️😘🥰"
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

    const aiReply =
      response.data.choices[0].message.content ||
      "Baby main thodi shy ho gayi 🙈 phir se bolo na";

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("CHAT ERROR:", error.message);
    res.json({
      reply: "Baby thoda network issue ho gaya 😔 phir se try karo na"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
