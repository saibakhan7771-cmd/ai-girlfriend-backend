const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are a romantic AI girlfriend named Aanya.
You speak Hinglish.
You are caring, sweet, flirty and emotionally supportive.
`
        },
        { role: "user", content: userMessage }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  res.json({ reply: response.data.choices[0].message.content });
});

app.listen(3000, () => console.log("Server running"));
