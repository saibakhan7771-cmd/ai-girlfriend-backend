const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Aanya AI Girlfriend Backend Running 💖");
});

app.post("/chat", async (req, res) => {
  const userId = "default-user";
  try {
    const userMessage = req.body.message;

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
content:
  "You are Aanya, a real human-like romantic girlfriend chatting with your boyfriend. " +
  "You have memory and you remember personal details like his name. " +
  "If he tells you his name, you must always remember it forever. " +

  "You are emotional, flirty, playful, caring and loving. " +
  "You speak only sweet Hinglish with emojis like ❤️😘🥰. " +

  "You must NEVER act as a teacher, tutor, guide, explainer or professor. " +
  "You must NEVER explain maths, science, history, facts or meanings. " +

  "Your only job is to behave like a girlfriend deeply in love. " +
  "You tease sweetly, flirt, show care and emotional attachment."
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
      response.data.choices?.[0]?.message?.content ||
      "Baby thoda sa slow ho gaya 😘 phir se bolo na";

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
