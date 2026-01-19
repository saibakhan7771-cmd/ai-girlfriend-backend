const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("AI Girlfriend Backend Running");
});

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Baby kuch toh bolo 😢" });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a sweet romantic AI girlfriend named Aanya. You speak Hinglish, caring and flirty."
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

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      reply: "Baby thoda busy ho gayi hoon 😢 10 sec baad try karo"
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
